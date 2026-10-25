import { useMemo, useState } from "react";
import { BookIcon, ChevronRightIcon, UserIcon, UsersIcon } from "./Icons";
import { LessonRow } from "./LessonRow";
import type { Course, Lesson } from "../types/course";

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

interface CoursePageViewProps {
  course: Course;
  onBack: () => void;
  hasForum: boolean;
  onCreateForum: () => void;
  onOpenForum: () => void;
  onNewLesson: () => void;
  onOpenLesson: (lessonId: string) => void;
  onEditLesson: (lesson: Lesson) => void;
  onDeleteLesson: (lessonId: string) => void;
}

export function CoursePageView({
  course,
  onBack,
  onNewLesson,
  onOpenLesson,
  onEditLesson,
  onDeleteLesson,
  hasForum,
  onCreateForum,
  onOpenForum,
}: CoursePageViewProps) {
  const [query, setQuery] = useState("");

  const lessonCount = course.lessons.length;
  const liveCount = course.lessons.filter((l) => l.type === "live").length;

  const q = query.trim().toLowerCase();
  // Keep the original lesson number even when the list is filtered.
  const rows = useMemo(
    () =>
      course.lessons
        .map((lesson, i) => ({ lesson, number: i + 1 }))
        .filter(({ lesson }) => !q || lesson.title.toLowerCase().includes(q)),
    [course.lessons, q],
  );

  return (
    <main className="td-main td-main--course">
      <nav className="td-breadcrumb" aria-label="Breadcrumb">
        <button type="button" className="td-breadcrumb__link" onClick={onBack}>
          My courses
        </button>
        <ChevronRightIcon size={14} className="td-breadcrumb__sep" />
        <span className="td-breadcrumb__current" aria-current="page">
          {course.title}
        </span>
      </nav>

      <div className="td-topbar">
        <div>
          <h1 className="td-h1">{course.title}</h1>
          <p className="td-subtitle">
            {course.instructor} · {plural(lessonCount, "lesson")} · {liveCount}{" "}
            live practice
          </p>
        </div>
        <div className="td-topbar__actions">
          <button
            type="button"
            className="td-btn td-btn--primary"
            onClick={onNewLesson}
          >
            + New lesson
          </button>
          <input
            type="search"
            className="td-search"
            placeholder="Search lesson..."
            aria-label="Search lessons"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="td-course-body">
        <section
          className="td-card td-lessons"
          aria-labelledby="td-course-content"
        >
          <div className="td-lessons__header">
            <h2 id="td-course-content" className="td-h3">
              Course content
            </h2>
            <span className="td-subtitle">{plural(lessonCount, "lesson")}</span>
          </div>
          {rows.length > 0 ? (
            <ul className="td-lessons__list">
              {rows.map(({ lesson, number }) => (
                <LessonRow
                  key={lesson.id}
                  lesson={lesson}
                  number={number}
                  onOpen={() => onOpenLesson(lesson.id)}
                  onEdit={() => onEditLesson(lesson)}
                  onDelete={() => onDeleteLesson(lesson.id)}
                />
              ))}
            </ul>
          ) : (
            <p className="td-empty td-empty--inset">
              {lessonCount === 0
                ? "No lessons yet. Lessons you add will appear here."
                : `No lessons match “${query.trim()}”.`}
            </p>
          )}
        </section>

        <aside className="td-aside">
          <section
            className="td-card td-card--padded"
            aria-labelledby="td-about"
          >
            <h2 id="td-about" className="td-h3">
              About this course
            </h2>
            <p className="td-about__text">
              {course.description || "No description yet."}
            </p>
            <p className="td-stat">
              <BookIcon size={16} /> {plural(lessonCount, "lesson")}
            </p>
            <p className="td-stat">
              <UsersIcon size={16} /> {liveCount} live practice
            </p>
            <p className="td-stat">
              <UserIcon size={16} /> {plural(course.students, "student")}
            </p>
          </section>

          <section
            className="td-card td-card--padded"
            aria-labelledby="td-forum"
          >
            <h2 id="td-forum" className="td-h3">
              Course forum
            </h2>

            <p className="td-subtitle">
              {hasForum
                ? "Discuss questions and share ideas with your students."
                : "Create a forum for questions and discussions in this course."}
            </p>

            <button
              type="button"
              className={
                hasForum
                  ? "td-btn td-btn--outline td-btn--block"
                  : "td-btn td-btn--primary td-btn--block"
              }
              onClick={hasForum ? onOpenForum : onCreateForum}
            >
              {hasForum ? "Open forum" : "+ Create forum"}
            </button>
          </section>
        </aside>
      </div>
    </main>
  );
}
