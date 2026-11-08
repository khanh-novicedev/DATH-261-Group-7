import { useCallback, useEffect, useState } from "react";
import { errorMessage, getCatalog, getCourse } from "@shared/api";
import {
  createCourseApi,
  updateCourseApi,
} from "../api/courseApi";
import { useAuth } from "@shared/context";
import type { Course, NewCourseInput } from "../types/course";
import type { Lesson } from "../types/course";

type ApiLessonType = "VIDEO" | "TEXT" | "LIVE_PRACTICE";

function fromApiLessonType(type: ApiLessonType): Lesson["type"] {
  switch (type) {
    case "VIDEO":
      return "video";
    case "TEXT":
      return "document";
    case "LIVE_PRACTICE":
      return "live";
  }
}

function toApiLessonType(type: Lesson["type"]): ApiLessonType {
  switch (type) {
    case "video":
      return "VIDEO";
    case "document":
      return "TEXT";
    case "live":
      return "LIVE_PRACTICE";
    default:
      throw new Error(`The course API does not support ${type} lessons.`);
  }
}

function catalogItemToCourse(item: Awaited<ReturnType<typeof getCatalog>>["items"][number]): Course {
  return {
    id: item.id,
    title: item.title,
    instructor: item.instructor?.fullName ?? "Instructor",
    description: item.description ?? "",
    category: item.category ?? "",
    status: item.status,
    students: 0,
    forumThreads: 0,
    unansweredThreads: 0,
    lessons: [],
  };
}

export function useCourses(initial: Course[] = []) {
  const [courses, setCourses] = useState<Course[]>(initial);
  const [isLoading, setIsLoading] = useState(initial.length === 0);
  const [loadError, setLoadError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    let active = true;
    getCatalog({ mine: true })
      .then(({ items }) => {
        if (!active) return;
        setCourses((previous) => {
          const coursesById = new Map(items.map((item) => [item.id, catalogItemToCourse(item)]));
          previous.forEach((course) => coursesById.set(course.id, course));
          return [...coursesById.values()];
        });
        setLoadError("");
      })
      .catch((error: unknown) => {
        if (active) setLoadError(errorMessage(error));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const loadCourseDetails = useCallback(async (courseId: string): Promise<Course> => {
    const details = await getCourse(courseId);
    const current = courses.find((course) => course.id === courseId);
    const course: Course = {
      id: details.id,
      title: details.title,
      instructor: current?.instructor ?? user?.fullName ?? "Instructor",
      description: details.description ?? "",
      category: details.category ?? "",
      status: details.status,
      students: current?.students ?? 0,
      forumThreads: current?.forumThreads ?? 0,
      unansweredThreads: current?.unansweredThreads ?? 0,
      lessons: (details.lessons ?? []).map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        type: fromApiLessonType(lesson.type),
        detail: `Lesson ${lesson.sequenceNumber}`,
        fileUrl: lesson.contentUrl ?? undefined,
        status: "not-started",
      })),
    };
    setCourses((previous) =>
      previous.map((item) => (item.id === courseId ? course : item)),
    );
    return course;
  }, [courses, user]);

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
        category: input.category.trim() || undefined,
        prerequisites: input.prerequisites.trim() || undefined,
        status: "DRAFT",
        lessons: [],
      });

      const created = response.data;

      const course: Course = {
        id: created.id,
        title: created.title,
        instructor: user?.fullName || "Instructor",
        description: created.description || "",
        category: created.category ?? input.category.trim(),
        prerequisites: created.prerequisites ?? input.prerequisites.trim(),
        status: created.status,
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

  const updateCourse = useCallback(async (course: Course, input: NewCourseInput) => {
    const response = await updateCourseApi(course.id, {
      title: input.name.trim(),
      description: input.description.trim() || undefined,
      category: input.category.trim() || undefined,
      prerequisites: input.prerequisites.trim() || undefined,
      status: course.status ?? "DRAFT",
      lessons: course.lessons.map((lesson, index) => ({
        id: lesson.id,
        sequenceNumber: index + 1,
        title: lesson.title,
        type: toApiLessonType(lesson.type),
        contentUrl: lesson.fileUrl,
      })),
    });
    const updated = response.data;
    const nextCourse: Course = {
      ...course,
      title: updated.title,
      description: updated.description ?? "",
      category: updated.category ?? input.category.trim(),
      prerequisites: updated.prerequisites ?? input.prerequisites.trim(),
      status: updated.status,
    };
    setCourses((previous) =>
      previous.map((item) => (item.id === course.id ? nextCourse : item)),
    );
    return nextCourse;
  }, []);

  const previewCourseStatus = useCallback((courseId: string, status: Course["status"]) => {
    setCourses((previous) =>
      previous.map((course) =>
        course.id === courseId ? { ...course, status } : course,
      ),
    );
  }, []);

  return {
    courses,
    isLoading,
    loadError,
    addCourse,
    loadCourseDetails,
    updateCourse,
    previewCourseStatus,
    addLesson,
    updateLesson,
    deleteLesson,
  };
}
