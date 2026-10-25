import { BookIcon } from './Icons';
import type { Course } from '../types/course';

export type ThumbTone = 'sky' | 'amber' | 'emerald';
export const THUMB_TONES: ThumbTone[] = ['sky', 'amber', 'emerald'];

interface CourseRowProps {
  course: Course;
  tone: ThumbTone;
  onOpen: (courseId: string) => void;
}

export function CourseRow({ course, tone, onOpen }: CourseRowProps) {
  const open = () => onOpen(course.id);

  return (
    <li
      className="td-course-row"
      onClick={(e) => {
        // Make the whole row clickable without double-firing the inner buttons.
        if (!(e.target as HTMLElement).closest('button')) open();
      }}
    >
      <div className={`td-thumb td-thumb--${tone}`}>
        <BookIcon />
      </div>
      <div className="td-course-row__info">
        <button type="button" className="td-course-row__title" onClick={open}>
          {course.title}
        </button>
        <p className="td-course-row__sub">{course.instructor}</p>
      </div>
      <button type="button" className="td-btn td-btn--outline" onClick={open}>
        Continue
      </button>
    </li>
  );
}
