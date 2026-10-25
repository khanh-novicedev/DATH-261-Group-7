import { useCallback, useState } from "react";
import { MOCK_COURSES, MOCK_USER } from "../api/mockCourses";
import type { Course, NewCourseInput } from "../types/course";
import type { Lesson } from "../types/course";

function makeId(): string {
  return `course-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Local, in-memory course list. Newly created courses are added to the top. */
export function useCourses(initial: Course[] = MOCK_COURSES) {
  const [courses, setCourses] = useState<Course[]>(initial);

  const addLesson = (courseId: string, lesson: Lesson) => {
    setCourses((previous) =>
      previous.map((course) =>
        course.id === courseId
          ? {
              ...course,
              lessons: [...course.lessons, lesson],
            }
          : course,
      ),
    );
  };

  const updateLesson = (
    courseId: string,
    lessonId: string,
    updatedLesson: Lesson,
  ) => {
    setCourses((previous) =>
      previous.map((course) =>
        course.id !== courseId
          ? course
          : {
              ...course,
              lessons: course.lessons.map((lesson) =>
                lesson.id === lessonId ? updatedLesson : lesson,
              ),
            },
      ),
    );
  };

  const deleteLesson = (courseId: string, lessonId: string) => {
    setCourses((previous) =>
      previous.map((course) =>
        course.id !== courseId
          ? course
          : {
              ...course,
              lessons: course.lessons.filter(
                (lesson) => lesson.id !== lessonId,
              ),
            },
      ),
    );
  };

  const addCourse = useCallback((input: NewCourseInput): Course => {
    const course: Course = {
      id: makeId(),
      title: input.name.trim(),
      instructor: MOCK_USER.name,
      description: input.description.trim(),
      students: 0,
      forumThreads: 0,
      unansweredThreads: 0,
      lessons: [],
    };
    setCourses((prev) => [course, ...prev]);
    return course;
  }, []);

  return { courses, addCourse, addLesson, updateLesson, deleteLesson };
}
