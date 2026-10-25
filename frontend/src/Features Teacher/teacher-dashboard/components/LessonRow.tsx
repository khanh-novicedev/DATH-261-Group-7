import type { Lesson } from "../types/course";

interface LessonRowProps {
  lesson: Lesson;
  number: number;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const typeLabels: Record<Lesson["type"], string> = {
  video: "Video",
  document: "Document",
  quiz: "Quiz",
  assignment: "Assignment",
  live: "Live practice",
};

export function LessonRow({
  lesson,
  number,
  onOpen,
  onEdit,
  onDelete,
}: LessonRowProps) {
  return (
    <li className="td-lesson-item">
      <button type="button" className="td-lesson-item__button" onClick={onOpen}>
        <span className="td-lesson-item__number">{number}</span>

        <span className="td-lesson-item__info">
          <span className="td-lesson-item__title">{lesson.title}</span>
          <span className="td-lesson-item__description">
            {lesson.description || lesson.detail}
          </span>
        </span>

        <span className="td-lesson-item__type">{typeLabels[lesson.type]}</span>

        <span aria-hidden="true" className="td-lesson-item__arrow">
          ›
        </span>
      </button>

      <div className="td-lesson-row-actions">
        <button type="button" className="td-forum-text-action" onClick={onEdit}>
          Edit
        </button>
        <button
          type="button"
          className="td-forum-text-action td-forum-text-action--danger"
          onClick={onDelete}
        >
          Remove
        </button>
      </div>
    </li>
  );
}
