import { useEffect, useState, type FormEvent } from "react";
import {
  errorMessage,
  getLessonAssignments,
  type AssignmentDto,
} from "@shared/api";
import { useAuth } from "@shared/context";
import { createAssignmentApi } from "../api/assignmentApi";
import { ChevronRightIcon } from "./Icons";
import type { Course, Lesson, LessonType } from "../types/course";

interface LessonDetailViewProps {
  course: Course;
  lesson: Lesson;
  onBack: () => void;
  onGoToCourses: () => void;
  onSelectAssignment?: (assignment: AssignmentDto) => void;
}

const typeLabels: Record<LessonType, string> = {
  video: "Video",
  document: "Document",
  quiz: "Quiz",
  assignment: "Assignment",
  live: "Live practice",
};

const formatDateTime = (value?: string | null) =>
  value
    ? new Date(value).toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Not set";

export function LessonDetailView({
  course,
  lesson,
  onBack,
  onGoToCourses,
  onSelectAssignment,
}: LessonDetailViewProps) {
  const [assignments, setAssignments] = useState<AssignmentDto[]>([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [assignmentError, setAssignmentError] = useState("");

  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newInstructions, setNewInstructions] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateFileAssignment = async (e: FormEvent) => {
    e.preventDefault();
    if (!user?.id || !newTitle.trim()) return;

    setIsCreating(true);
    setAssignmentError("");
    try {
      const created = await createAssignmentApi(lesson.id, user.id, {
        title: newTitle.trim(),
        type: "FILE_SUBMISSION",
        instructions: newInstructions.trim() || undefined,
        deadline: newDeadline ? `${newDeadline}:00` : null,
        questions: [],
      });
      setAssignments((prev) => [...prev, created]);
      setNewTitle("");
      setNewInstructions("");
      setNewDeadline("");
      setShowCreateForm(false);
    } catch (err: unknown) {
      setAssignmentError(errorMessage(err));
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    let active = true;
    setLoadingAssignments(true);
    setAssignmentError("");

    // API-26: Lấy danh sách assignment gắn với lesson này
    getLessonAssignments(lesson.id)
      .then((data) => {
        if (active) setAssignments(data ?? []);
      })
      .catch((error: unknown) => {
        if (active) setAssignmentError(errorMessage(error));
      })
      .finally(() => {
        if (active) setLoadingAssignments(false);
      });

    return () => {
      active = false;
    };
  }, [lesson.id]);

  const typeLabel = typeLabels[lesson.type];

  const sectionTitle =
    lesson.type === "document" ? "Learning material" : "Lesson details";

  return (
    <main className="td-main td-main--course td-lesson-detail-page">
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

        <span className="td-breadcrumb__current" aria-current="page">
          {lesson.title}
        </span>
      </nav>

      <div className="td-lesson-detail__heading">
        <span className="td-lesson-detail__type">{typeLabel}</span>
        <h1 className="td-h1">{lesson.title}</h1>
        <p className="td-subtitle">{course.title}</p>
      </div>

      <div className="td-lesson-detail__grid">
        <section className="td-card td-lesson-detail__card">
          <h2 className="td-h3">{sectionTitle}</h2>

          <p className="td-lesson-detail__description">
            {lesson.description || lesson.detail || "No description provided."}
          </p>

          <div className="td-lesson-detail__times">
            <div>
              <span>Opens</span>
              <strong>{formatDateTime(lesson.openAt)}</strong>
            </div>

            <div>
              <span>Closes</span>
              <strong>{formatDateTime(lesson.closeAt)}</strong>
            </div>
          </div>

          {/* Danh sách Assignment (API-26) gắn trong Lesson */}
          <div className="td-lesson-detail__notice">
            <h3>Assignments & Quizzes ({assignments.length})</h3>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3>Assignments & Quizzes ({assignments.length})</h3>
              <button
                type="button"
                className="td-btn td-btn--primary"
                onClick={() => setShowCreateForm((v) => !v)}
              >
                {showCreateForm ? "Cancel" : "+ New assignment"}
              </button>
            </div>

            {showCreateForm && (
              <form
                onSubmit={(e) => void handleCreateFileAssignment(e)}
                style={{
                  display: "grid",
                  gap: 10,
                  margin: "12px 0",
                  padding: 12,
                  border: "1px solid #cbd5e1",
                  borderRadius: 8,
                }}
              >
                <input
                  className="td-lesson-form__input"
                  placeholder="Assignment title (e.g. Lab 1 Report)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
                <textarea
                  className="td-lesson-form__input"
                  rows={2}
                  placeholder="Instructions (optional)"
                  value={newInstructions}
                  onChange={(e) => setNewInstructions(e.target.value)}
                />
                <input
                  type="datetime-local"
                  className="td-lesson-form__input"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                />
                <button
                  type="submit"
                  className="td-btn td-btn--primary"
                  disabled={isCreating}
                >
                  {isCreating ? "Creating..." : "Create assignment"}
                </button>
              </form>
            )}

            {assignmentError && (
              <p className="td-course-action-error" role="alert">
                {assignmentError}
              </p>
            )}

            {loadingAssignments ? (
              <p>Loading assignments...</p>
            ) : assignments.length === 0 ? (
              <p>No assignments attached to this lesson.</p>
            ) : (
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  marginTop: 12,
                  display: "grid",
                  gap: 10,
                }}
              >
                {assignments.map((item) => (
                  <li
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 12px",
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                    }}
                  >
                    <div>
                      <strong>{item.title}</strong>
                      <div style={{ fontSize: 13, color: "#64748b" }}>
                        Type: {item.type} · Due: {formatDateTime(item.deadline)}
                      </div>
                    </div>

                    {item.type === "FILE_SUBMISSION" && onSelectAssignment && (
                      <button
                        type="button"
                        className="td-btn td-btn--outline"
                        onClick={() => onSelectAssignment(item)}
                      >
                        View submissions
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <aside className="td-card td-lesson-detail__card">
          <h2 className="td-h3">Lesson attachment</h2>

          {lesson.fileUrl && lesson.fileName ? (
            <>
              <div className="td-lesson-file">
                <span className="td-lesson-file__icon" aria-hidden="true">
                  📄
                </span>
                <div className="td-lesson-file__info">
                  <strong>{lesson.fileName}</strong>
                  <span>{typeLabel} resource</span>
                </div>
              </div>

              <div className="td-lesson-file__actions">
                <a
                  className="td-btn td-btn--primary"
                  href={lesson.fileUrl}
                  download={lesson.fileName}
                >
                  Download file
                </a>

                <a
                  className="td-btn td-btn--outline"
                  href={lesson.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open file
                </a>
              </div>
            </>
          ) : (
            <p className="td-empty">
              No attachment has been added to this lesson.
            </p>
          )}

          <button
            type="button"
            className="td-btn td-btn--outline td-btn--block td-lesson-detail__back"
            onClick={onBack}
          >
            Back to course
          </button>
        </aside>
      </div>
    </main>
  );
}
