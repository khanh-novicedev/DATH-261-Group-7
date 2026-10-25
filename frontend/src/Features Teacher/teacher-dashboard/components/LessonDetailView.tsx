import { ChevronRightIcon } from "./Icons";
import type { Course, Lesson, LessonType } from "../types/course";

interface LessonDetailViewProps {
  course: Course;
  lesson: Lesson;
  onBack: () => void;
  onGoToCourses: () => void;
}

const typeLabels: Record<LessonType, string> = {
  video: "Video",
  document: "Document",
  quiz: "Quiz",
  assignment: "Assignment",
  live: "Live practice",
};

const formatDateTime = (value?: string) =>
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
}: LessonDetailViewProps) {
  const typeLabel = typeLabels[lesson.type];

  const sectionTitle =
    lesson.type === "quiz"
      ? "Quiz overview"
      : lesson.type === "assignment"
        ? "Assignment instructions"
        : lesson.type === "document"
          ? "Learning material"
          : "Lesson details";

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

          {lesson.type === "quiz" && (
            <div className="td-lesson-detail__notice">
              <h3>Quiz workspace</h3>
              <p>
                The quiz page is ready. Quiz questions, attempts, and scoring
                have not been connected yet.
              </p>
            </div>
          )}

          {lesson.type === "assignment" && (
            <div className="td-lesson-detail__notice">
              <h3>Assignment</h3>
              <p>
                Students can read the instructions and download the attachment
                below. Student submission is not connected yet.
              </p>
            </div>
          )}

          {lesson.type === "document" && (
            <div className="td-lesson-detail__notice">
              <h3>Learning material</h3>
              <p>Open the attached material or download it to read later.</p>
            </div>
          )}
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
