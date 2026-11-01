import { useCallback, useState } from "react";
import { MOCK_COURSES, MOCK_USER } from "../api/mockCourses";
import type { Course, NewCourseInput } from "../types/course";
import type { Lesson } from "../types/course";

function makeId(): string {
  return `course-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Local, in-memory course list. Newly created courses are added to the top. */
export function useCourses(
  initial: Course[] = MOCK_COURSES,
  instructorName = MOCK_USER.name,
) {
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

  const addCourse = useCallback((input: NewCourseInput, id = makeId()): Course => {
    const course: Course = {
      id,
      title: input.name.trim(),
      instructor: instructorName,
      description: input.description.trim(),
      category: input.category?.trim(),
      students: 0,
      forumThreads: 0,
      unansweredThreads: 0,
      lessons: [],
    };
    setCourses((prev) => [course, ...prev]);
    return course;
  }, [instructorName]);

  const updateCourseDetails = useCallback(
    (courseId: string, input: NewCourseInput) => {
      setCourses((previous) =>
        previous.map((course) =>
          course.id === courseId
            ? {
                ...course,
                title: input.name.trim(),
                description: input.description.trim(),
                category: input.category?.trim(),
              }
            : course,
        ),
      );
    },
    [],
  );

  return {
    courses,
    addCourse,
    updateCourseDetails,
    addLesson,
    updateLesson,
    deleteLesson,
  };
}
