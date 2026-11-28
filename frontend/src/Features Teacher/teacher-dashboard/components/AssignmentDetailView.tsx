import { useEffect, useMemo, useState } from "react";
import { errorMessage } from "@shared/api";
import type { AssignmentDto } from "@shared/api";
import { useAuth } from "@shared/context";
import { ChevronRightIcon } from "./Icons";
import { MOCK_CLASSES, MOCK_CLASS_STUDENTS } from "../api/mockClasses";
import {
  getLatestSubmissionsApi,
  gradeSubmissionApi,
  type TeacherSubmissionDto,
} from "../api/teacherAssessmentApi";
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
  const [selectedClasses, setSelectedClasses] = useState<string[]>(["all"]);

  // State cho bài nộp thật & form chấm điểm (API-31)
  const [submissions, setSubmissions] = useState<TeacherSubmissionDto[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
  const [gradeError, setGradeError] = useState("");
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [scoreDrafts, setScoreDrafts] = useState<Record<string, string>>({});
  const [feedbackDrafts, setFeedbackDrafts] = useState<Record<string, string>>(
    {},
  );
  const [savingSubmissionId, setSavingSubmissionId] = useState<string | null>(
    null,
  );

  const assignmentId = initialAssignment?.id;
  const isFileAssignment =
    !initialAssignment || initialAssignment.type === "FILE_SUBMISSION";

  useEffect(() => {
    if (!assignmentId || !user?.id || !isFileAssignment) return;

    let active = true;
    setIsLoadingSubmissions(true);
    setGradeError("");

    void getLatestSubmissionsApi(assignmentId, user.id)
      .then((page) => {
        if (!active) return;
        setSubmissions(page.items);
        const nextScores: Record<string, string> = {};
        const nextFeedbacks: Record<string, string> = {};
        for (const item of page.items) {
          nextScores[item.id] = item.score !== null ? String(item.score) : "";
          nextFeedbacks[item.id] = item.feedback ?? "";
        }
        setScoreDrafts(nextScores);
        setFeedbackDrafts(nextFeedbacks);
      })
      .catch((err: unknown) => {
        if (active) setGradeError(errorMessage(err));
      })
      .finally(() => {
        if (active) setIsLoadingSubmissions(false);
      });

    return () => {
      active = false;
    };
  }, [assignmentId, user?.id, isFileAssignment]);

  const handleSaveGrade = async (submissionId: string) => {
    if (!user?.id) {
      setGradeError("Missing instructor ID. Please log in again.");
      return;
    }

    const rawScore = scoreDrafts[submissionId] ?? "";
    const parsedScore = Number(rawScore);

    if (
      rawScore.trim() === "" ||
      Number.isNaN(parsedScore) ||
      parsedScore < 0
    ) {
      setGradeError("Score must be a number greater than or equal to 0.");
      return;
    }

    try {
      setSavingSubmissionId(submissionId);
      setGradeError("");
      const updated = await gradeSubmissionApi(submissionId, user.id, {
        score: parsedScore,
        feedback: feedbackDrafts[submissionId]?.trim() || undefined,
      });

      setSubmissions((prev) =>
        prev.map((item) => (item.id === submissionId ? updated : item)),
      );
      setGradingId(null);
    } catch (err: unknown) {
      setGradeError(errorMessage(err));
    } finally {
      setSavingSubmissionId(null);
    }
  };

  // Fallback mock khi mở lesson assignment chưa gắn assignmentId từ backend
  const accessibleIds = lesson.accessibleClassIds?.length
    ? lesson.accessibleClassIds
    : ["all"];

  const allowedClasses = MOCK_CLASSES.filter(
    (teacherClass) =>
      accessibleIds.includes("all") || accessibleIds.includes(teacherClass.id),
  );

  const allowedClassIds = allowedClasses.map((item) => item.id);

  const students = useMemo(
    () =>
      MOCK_CLASS_STUDENTS.filter((student) =>
        allowedClassIds.includes(student.classId),
      ),
    [allowedClassIds.join("|")],
  );

  const filteredStudents = students.filter((student) =>
    selectedClasses.includes("all")
      ? true
      : selectedClasses.includes(student.classId),
  );

  const toggleClass = (classId: string) => {
    setSelectedClasses((previous) => {
      if (classId === "all") return ["all"];
      const selected = previous.filter((id) => id !== "all");
      return selected.includes(classId)
        ? selected.filter((id) => id !== classId)
        : [...selected, classId];
    });
  };

  const getStatus = (demoSubmitted: boolean) => {
    if (demoSubmitted) return "Submitted";
    if (lesson.closeAt && new Date(lesson.closeAt).getTime() < Date.now()) {
      return "Overdue";
    }
    return "Not submitted";
  };

  const submittedCount = filteredStudents.filter(
    (student) => getStatus(student.demoSubmitted) === "Submitted",
  ).length;

  const displayTitle = initialAssignment?.title ?? lesson.title;
  const displayInstructions =
    initialAssignment?.instructions ||
    lesson.description ||
    "No instructions have been added yet.";
  const displayDeadline = initialAssignment?.deadline ?? lesson.closeAt;

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
        <span className="td-breadcrumb__current">{displayTitle}</span>
      </nav>

      <div className="td-assignment-heading">
        <div>
          <span className="td-lesson-detail__type">
            {initialAssignment?.type === "QUIZ" ? "Quiz" : "Assignment"}
          </span>
          <h1 className="td-h1">{displayTitle}</h1>
          <p className="td-subtitle">{course.title}</p>
        </div>
      </div>

      <div className="td-assignment-layout">
        <section className="td-card td-assignment-instructions">
          <h2 className="td-h3">Instructions</h2>

          <div className="td-assignment-instructions__scroll">
            <p className="td-lesson-detail__description">
              {displayInstructions}
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
                  {displayDeadline
                    ? new Date(displayDeadline).toLocaleString()
                    : "Not set"}
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
              <h2 className="td-h3">Student submissions & grading</h2>
              <p className="td-subtitle">
                {assignmentId
                  ? `${submissions.length} submission${submissions.length === 1 ? "" : "s"}`
                  : `${submittedCount} of ${filteredStudents.length} submitted (demo)`}
              </p>
            </div>
          </div>

          {gradeError && (
            <p className="td-course-action-error" role="alert">
              {gradeError}
            </p>
          )}

          {assignmentId ? (
            <div className="td-assignment-student-list">
              {isLoadingSubmissions && (
                <p className="td-subtitle">Loading submissions...</p>
              )}

              {!isLoadingSubmissions && submissions.length === 0 && (
                <p className="td-empty">No student submissions yet.</p>
              )}

              {submissions.map((sub) => {
                const isGraded = sub.score !== null;
                const isEditing = gradingId === sub.id;

                return (
                  <article
                    className="td-assignment-student"
                    key={sub.id}
                    style={{
                      flexDirection: "column",
                      alignItems: "stretch",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <div className="td-assignment-student__avatar">
                        {sub.learnerName.charAt(0).toUpperCase()}
                      </div>

                      <div
                        className="td-assignment-student__info"
                        style={{ flex: 1 }}
                      >
                        <strong>{sub.learnerName}</strong>
                        <span>
                          Submitted {new Date(sub.submittedAt).toLocaleString()}
                        </span>
                        {sub.fileUrl && (
                          <a
                            href={sub.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="td-qna-attachment-link"
                          >
                            View submitted file
                          </a>
                        )}
                      </div>

                      <span
                        className={`td-submission-status ${
                          isGraded
                            ? "td-submission-status--submitted"
                            : "td-submission-status--not-submitted"
                        }`}
                      >
                        {isGraded ? `Score: ${sub.score}` : "Needs grading"}
                      </span>

                      <button
                        type="button"
                        className="td-btn td-btn--outline"
                        onClick={() => setGradingId(isEditing ? null : sub.id)}
                      >
                        {isEditing ? "Close" : isGraded ? "Re-grade" : "Grade"}
                      </button>
                    </div>

                    {sub.feedback && !isEditing && (
                      <p className="td-subtitle" style={{ margin: 0 }}>
                        Feedback: {sub.feedback}
                      </p>
                    )}

                    {isEditing && (
                      <div
                        style={{
                          display: "grid",
                          gap: 8,
                          paddingTop: 8,
                          borderTop: "1px solid #e5e7eb",
                        }}
                      >
                        <label style={{ display: "grid", gap: 4 }}>
                          <span>Score *</span>
                          <input
                            type="number"
                            min={0}
                            step="0.5"
                            className="td-lesson-form__input"
                            value={scoreDrafts[sub.id] ?? ""}
                            onChange={(e) =>
                              setScoreDrafts((prev) => ({
                                ...prev,
                                [sub.id]: e.target.value,
                              }))
                            }
                            placeholder="e.g. 8.5"
                          />
                        </label>

                        <label style={{ display: "grid", gap: 4 }}>
                          <span>Feedback</span>
                          <textarea
                            rows={2}
                            className="td-forum-textarea"
                            value={feedbackDrafts[sub.id] ?? ""}
                            onChange={(e) =>
                              setFeedbackDrafts((prev) => ({
                                ...prev,
                                [sub.id]: e.target.value,
                              }))
                            }
                            placeholder="Write feedback for the learner..."
                          />
                        </label>

                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            type="button"
                            className="td-btn td-btn--primary"
                            disabled={savingSubmissionId === sub.id}
                            onClick={() => void handleSaveGrade(sub.id)}
                          >
                            {savingSubmissionId === sub.id
                              ? "Saving..."
                              : "Save grade"}
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <>
              <div className="td-assignment-filters">
                <strong>Filter by class</strong>
                <label className="td-class-access__option">
                  <input
                    type="checkbox"
                    checked={selectedClasses.includes("all")}
                    onChange={() => toggleClass("all")}
                  />
                  <span>All classes</span>
                </label>

                <div className="td-assignment-filters__classes">
                  {allowedClasses.map((teacherClass) => (
                    <label
                      className="td-class-access__option"
                      key={teacherClass.id}
                    >
                      <input
                        type="checkbox"
                        checked={selectedClasses.includes(teacherClass.id)}
                        onChange={() => toggleClass(teacherClass.id)}
                      />
                      <span>{teacherClass.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="td-assignment-student-list">
                {filteredStudents.map((student) => {
                  const status = getStatus(student.demoSubmitted);
                  const teacherClass = allowedClasses.find(
                    (item) => item.id === student.classId,
                  );

                  return (
                    <article className="td-assignment-student" key={student.id}>
                      <div className="td-assignment-student__avatar">
                        {student.name.charAt(0)}
                      </div>

                      <div className="td-assignment-student__info">
                        <strong>{student.name}</strong>
                        <span>{teacherClass?.name ?? "Unknown class"}</span>
                      </div>

                      <span
                        className={`td-submission-status td-submission-status--${status
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {status}
                      </span>
                    </article>
                  );
                })}

                {filteredStudents.length === 0 && (
                  <p className="td-empty">
                    No students match the selected classes.
                  </p>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
