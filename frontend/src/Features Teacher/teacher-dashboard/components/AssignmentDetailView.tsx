import { useEffect, useState } from "react";
import {
  errorMessage,
  getAssignmentSubmissions,
  getLessonAssignments,
  type AssignmentDto,
  type SubmissionDto,
} from "@shared/api";
import { useAuth } from "@shared/context";
import { ChevronRightIcon } from "./Icons";
import type { Course, Lesson } from "../types/course";

interface AssignmentDetailViewProps {
  course: Course;
  lesson: Lesson;
  initialAssignment?: AssignmentDto;
  onBack: () => void;
  onGoToCourses: () => void;
}

export function AssignmentDetailView({
  course,
  lesson,
  initialAssignment,
  onBack,
  onGoToCourses,
}: AssignmentDetailViewProps) {
  const { user } = useAuth();
  const [assignment, setAssignment] = useState<AssignmentDto | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionDto[]>([]);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "graded" | "ungraded"
  >("all");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadAssignmentAndSubmissions() {
      setIsLoading(true);
      setLoadError("");

      try {
        // API-26: Lấy danh sách assignment của lesson

        const currentAssignment =
          initialAssignment ??
          (await getLessonAssignments(lesson.id))[0] ??
          null;
        setAssignment(currentAssignment);

        if (!currentAssignment || !user?.id) {
          setSubmissions([]);
          return;
        }

        // API-30: Lấy danh sách bài nộp của assignment đó
        const submissionPage = await getAssignmentSubmissions(
          currentAssignment.id,
          {
            instructorId: user.id,
            page: 0,
            size: 50,
          },
        );
        if (!active) return;

        setSubmissions(submissionPage.items ?? []);
      } catch (error: unknown) {
        if (active) setLoadError(errorMessage(error));
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadAssignmentAndSubmissions();
    return () => {
      active = false;
    };
  }, [lesson.id, user?.id]);

  const filteredSubmissions = submissions.filter((sub) => {
    if (statusFilter === "graded") return sub.score !== null;
    if (statusFilter === "ungraded") return sub.score === null;
    return true;
  });

  const dueDate = assignment?.deadline ?? lesson.closeAt;

  return (
    <main className="td-main td-main--course td-assignment-page">
      <nav className="td-breadcrumb" aria-label="Breadcrumb">
        <button
          type="button"
          className="td-breadcrumb__link"
          onClick={onGoToCourses}
        >
          My Courses
        </button>
        <ChevronRightIcon size={14} className="td-breadcrumb__sep" />
        <button type="button" className="td-breadcrumb__link" onClick={onBack}>
          {course.title}
        </button>
        <ChevronRightIcon size={14} className="td-breadcrumb__sep" />
        <span className="td-breadcrumb__current">
          {assignment?.title ?? lesson.title}
        </span>
      </nav>

      <div className="td-assignment-heading">
        <div>
          <span className="td-lesson-detail__type">Assignment</span>
          <h1 className="td-h1">{assignment?.title ?? lesson.title}</h1>
          <p className="td-subtitle">{course.title}</p>
        </div>
      </div>

      {loadError && (
        <p className="td-course-action-error" role="alert">
          {loadError}
        </p>
      )}

      <div className="td-assignment-layout">
        <section className="td-card td-assignment-instructions">
          <h2 className="td-h3">Instructions</h2>

          <div className="td-assignment-instructions__scroll">
            <p className="td-lesson-detail__description">
              {assignment?.instructions ||
                lesson.description ||
                "No instructions have been added yet."}
            </p>

            <div className="td-lesson-detail__times">
              <div>
                <span>Opens</span>
                <strong>
                  {lesson.openAt
                    ? new Date(lesson.openAt).toLocaleString()
                    : "Not set"}
                </strong>
              </div>
              <div>
                <span>Due date</span>
                <strong>
                  {dueDate ? new Date(dueDate).toLocaleString() : "Not set"}
                </strong>
              </div>
            </div>

            {lesson.fileUrl && lesson.fileName && (
              <div className="td-assignment-attachment">
                <strong>Attached resource</strong>
                <span>{lesson.fileName}</span>
                <a
                  className="td-btn td-btn--outline"
                  href={lesson.fileUrl}
                  download={lesson.fileName}
                >
                  Download attachment
                </a>
              </div>
            )}
          </div>
        </section>

        <section className="td-card td-assignment-students">
          <div className="td-assignment-students__header">
            <div>
              <h2 className="td-h3">Student submissions</h2>
              <p className="td-subtitle">{submissions.length} submitted</p>
            </div>
          </div>

          <div className="td-assignment-filters">
            <strong>Filter submissions</strong>
            <div className="td-assignment-filters__classes">
              {(["all", "ungraded", "graded"] as const).map((filter) => (
                <label className="td-class-access__option" key={filter}>
                  <input
                    type="radio"
                    name="submissionFilter"
                    checked={statusFilter === filter}
                    onChange={() => setStatusFilter(filter)}
                  />
                  <span>
                    {filter === "all"
                      ? "All"
                      : filter === "graded"
                        ? "Graded"
                        : "Needs grading"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="td-assignment-student-list">
            {isLoading ? (
              <p className="td-empty">Loading submissions...</p>
            ) : filteredSubmissions.length > 0 ? (
              filteredSubmissions.map((sub) => {
                const isGraded = sub.score !== null;
                return (
                  <article className="td-assignment-student" key={sub.id}>
                    <div className="td-assignment-student__avatar">
                      {sub.learnerName.charAt(0)}
                    </div>

                    <div className="td-assignment-student__info">
                      <strong>{sub.learnerName}</strong>
                      <span>
                        Submitted: {new Date(sub.submittedAt).toLocaleString()}
                        {sub.fileUrl && (
                          <>
                            {" · "}
                            <a
                              href={sub.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              View file
                            </a>
                          </>
                        )}
                      </span>
                    </div>

                    <span
                      className={`td-submission-status td-submission-status--${
                        isGraded ? "submitted" : "not-submitted"
                      }`}
                    >
                      {isGraded ? `Score: ${sub.score}` : "Submitted"}
                    </span>
                  </article>
                );
              })
            ) : (
              <p className="td-empty">No submissions found.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
