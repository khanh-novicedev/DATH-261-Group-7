import { useMemo, useState } from "react";
import { CourseRow, THUMB_TONES } from "./CourseRow";
import type { Course } from "../types/course";

interface MyCoursesViewProps {
  courses: Course[];
  userName: string;
  onNewCourse: () => void;
  onOpenCourse: (courseId: string) => void;
}

export function MyCoursesView({
  courses,
  userName,
  onNewCourse,
  onOpenCourse,
}: MyCoursesViewProps) {
  const [query, setQuery] = useState("");

  const filteredCourses = useMemo(() => {
    const q = query.trim().toLowerCase();

    return courses.filter((course) => course.title.toLowerCase().includes(q));
  }, [courses, query]);

  return (
    <main className="td-main td-main--dashboard">
      <div className="td-topbar">
        <div>
          <h1 className="td-h1">My Courses</h1>
          <p className="td-subtitle">
            Welcome back, {userName}. Manage your courses here.
          </p>
        </div>

        <div className="td-topbar__actions">
          <button
            type="button"
            className="td-btn td-btn--primary"
            onClick={onNewCourse}
          >
            + New course
          </button>

          <input
            type="search"
            className="td-search"
            placeholder="Search course..."
            aria-label="Search courses"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      <section
        id="td-my-courses"
        className="td-section"
        aria-labelledby="td-in-progress"
      >
        <div className="td-section__header">
          <h2 id="td-in-progress" className="td-h2">
            In progress
          </h2>
          <span className="td-link td-link--static">
            {filteredCourses.length} courses
          </span>
        </div>

        {filteredCourses.length > 0 ? (
          <ul className="td-list">
            {filteredCourses.map((course, index) => (
              <CourseRow
                key={course.id}
                course={course}
                tone={THUMB_TONES[index % THUMB_TONES.length]}
                onOpen={onOpenCourse}
              />
            ))}
          </ul>
        ) : (
          <p className="td-empty">
            {query.trim()
              ? `No courses match "${query.trim()}".`
              : 'No courses yet. Select "+ New course" to create one.'}
          </p>
        )}
      </section>
    </main>
  );
}
