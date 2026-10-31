import { useCallback, useState } from "react";
import { createCourseApi } from "../api/courseApi";
import { useAuth } from "@shared/context";
import type { Course, NewCourseInput } from "../types/course";
import type { Lesson } from "../types/course";

export function useCourses(initial: Course[] = []) {
  const [courses, setCourses] = useState<Course[]>(initial);
  const { user } = useAuth();

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

  const addCourse = useCallback(
    async (input: NewCourseInput): Promise<Course> => {
      const response = await createCourseApi({
        title: input.name.trim(),
        description: input.description.trim() || undefined,
        category: "General",
        status: "DRAFT",
        lessons: [],
      });

      const created = response.data;

      const course: Course = {
        id: created.id,
        title: created.title,
        instructor: user?.fullName || "Instructor",
        description: created.description || "",
        students: 0,
        forumThreads: 0,
        unansweredThreads: 0,
        lessons: (created.lessons || []).map((l) => ({
          id: l.id,
          title: l.title,
          type: "video",
          detail: `Lesson ${l.sequenceNumber}`,
          status: "not-started",
        })),
      };

      setCourses((prev) => [course, ...prev]);
      return course;
    },
    [user],
  );

  return { courses, addCourse, addLesson, updateLesson, deleteLesson };
}
