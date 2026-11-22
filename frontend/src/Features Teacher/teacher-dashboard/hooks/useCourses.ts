import { useCallback, useEffect, useState } from "react";
import {
  errorMessage,
  getCatalog,
  getCourse,
  updateCourseStatus,
} from "@shared/api";
import { createCourseApi, updateCourseApi } from "../api/courseApi";
import { useAuth } from "@shared/context";
import type {
  Course,
  Lesson,
  NewCourseInput,
  TeacherCourseStatus,
} from "../types/course";

type ApiLessonType = "VIDEO" | "TEXT" | "LIVE_PRACTICE";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const LESSON_TYPE_STORAGE_KEY = "td_lesson_ui_types";

function getStoredLessonTypes(): Record<string, Lesson["type"]> {
  try {
    return JSON.parse(localStorage.getItem(LESSON_TYPE_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveStoredLessonType(lessonId: string, type: Lesson["type"]) {
  const current = getStoredLessonTypes();
  current[lessonId] = type;
  localStorage.setItem(LESSON_TYPE_STORAGE_KEY, JSON.stringify(current));
}

function fromApiLessonType(
  type: ApiLessonType,
  lessonId?: string,
): Lesson["type"] {
  if (lessonId) {
    const saved = getStoredLessonTypes()[lessonId];
    if (saved) return saved;
  }
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
    case "live":
      return "LIVE_PRACTICE";
    case "document":
    case "quiz":
    case "assignment":
    default:
      return "TEXT";
  }
}

function catalogItemToCourse(
  item: Awaited<ReturnType<typeof getCatalog>>["items"][number],
): Course {
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
          const coursesById = new Map(
            items.map((item) => [item.id, catalogItemToCourse(item)]),
          );
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

  const loadCourseDetails = useCallback(
    async (courseId: string): Promise<Course> => {
      const details = await getCourse(courseId);
      let loadedCourse!: Course;

      setCourses((previous) => {
        const current = previous.find((course) => course.id === courseId);
        loadedCourse = {
          id: details.id,
          title: details.title,
          instructor: current?.instructor ?? user?.fullName ?? "Instructor",
          description: details.description ?? "",
          category: details.category ?? "",
          prerequisites: details.prerequisites ?? current?.prerequisites ?? "",
          status: details.status,
          students: current?.students ?? 0,
          forumThreads: current?.forumThreads ?? 0,
          unansweredThreads: current?.unansweredThreads ?? 0,
          lessons: (details.lessons ?? []).map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            type: fromApiLessonType(lesson.type, lesson.id),
            detail: `Lesson ${lesson.sequenceNumber}`,
            fileUrl: lesson.contentUrl ?? undefined,
            status: "not-started",
          })),
        };

        return previous.map((item) =>
          item.id === courseId ? loadedCourse : item,
        );
      });

      return loadedCourse;
    },
    [user],
  );

  const syncCourseLessons = useCallback(
    async (courseId: string, nextLessons: Lesson[]) => {
      const targetCourse = courses.find((c) => c.id === courseId);
      if (!targetCourse) {
        throw new Error("Course not found.");
      }

      const response = await updateCourseApi(courseId, {
        title: targetCourse.title,
        description: targetCourse.description || undefined,
        category: targetCourse.category || undefined,
        prerequisites: targetCourse.prerequisites || undefined,
        status: targetCourse.status ?? "DRAFT",
        lessons: nextLessons.map((lesson, index) => ({
          id: UUID_REGEX.test(lesson.id) ? lesson.id : undefined,
          sequenceNumber: index + 1,
          title: lesson.title,
          type: toApiLessonType(lesson.type),
          contentUrl: lesson.fileUrl,
        })),
      });

      const localMetaBySeq = new Map(
        nextLessons.map((item, idx) => [idx + 1, item]),
      );

      const savedLessons: Lesson[] = (response.data.lessons ?? []).map((l) => {
        const meta = localMetaBySeq.get(l.sequenceNumber);
        const resolvedType = meta?.type ?? fromApiLessonType(l.type, l.id);
        saveStoredLessonType(l.id, resolvedType);

        return {
          id: l.id,
          title: l.title,
          type: resolvedType,
          detail: `Lesson ${l.sequenceNumber}`,
          status: meta?.status ?? "not-started",
          description: meta?.description,
          openAt: meta?.openAt,
          closeAt: meta?.closeAt,
          fileName: meta?.fileName,
          fileUrl: l.contentUrl ?? meta?.fileUrl,
          accessibleClassIds: meta?.accessibleClassIds,
        };
      });

      setCourses((previous) =>
        previous.map((course) =>
          course.id === courseId
            ? { ...course, lessons: savedLessons }
            : course,
        ),
      );
    },
    [courses],
  );

  const addLesson = useCallback(
    async (courseId: string, lesson: Lesson) => {
      const targetCourse = courses.find((c) => c.id === courseId);
      if (!targetCourse) return;
      await syncCourseLessons(courseId, [...targetCourse.lessons, lesson]);
    },
    [courses, syncCourseLessons],
  );

  const updateLesson = useCallback(
    async (courseId: string, lessonId: string, updatedLesson: Lesson) => {
      const targetCourse = courses.find((c) => c.id === courseId);
      if (!targetCourse) return;
      await syncCourseLessons(
        courseId,
        targetCourse.lessons.map((lesson) =>
          lesson.id === lessonId ? updatedLesson : lesson,
        ),
      );
    },
    [courses, syncCourseLessons],
  );

  const deleteLesson = useCallback(
    async (courseId: string, lessonId: string) => {
      const targetCourse = courses.find((c) => c.id === courseId);
      if (!targetCourse) return;
      await syncCourseLessons(
        courseId,
        targetCourse.lessons.filter((lesson) => lesson.id !== lessonId),
      );
    },
    [courses, syncCourseLessons],
  );

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
          type: fromApiLessonType(l.type, l.id),
          detail: `Lesson ${l.sequenceNumber}`,
          status: "not-started",
        })),
      };

      setCourses((prev) => [course, ...prev]);
      return course;
    },
    [user],
  );

  const updateCourse = useCallback(
    async (course: Course, input: NewCourseInput) => {
      const response = await updateCourseApi(course.id, {
        title: input.name.trim(),
        description: input.description.trim() || undefined,
        category: input.category.trim() || undefined,
        prerequisites: input.prerequisites.trim() || undefined,
        status: course.status ?? "DRAFT",
        lessons: course.lessons.map((lesson, index) => ({
          id: UUID_REGEX.test(lesson.id) ? lesson.id : undefined,
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
    },
    [],
  );

  const changeCourseStatus = useCallback(
    async (courseId: string, status: TeacherCourseStatus) => {
      const updated = await updateCourseStatus(courseId, status);
      setCourses((previous) =>
        previous.map((course) =>
          course.id === courseId
            ? { ...course, status: updated.status }
            : course,
        ),
      );
    },
    [],
  );

  return {
    courses,
    isLoading,
    loadError,
    addCourse,
    loadCourseDetails,
    updateCourse,
    changeCourseStatus,
    addLesson,
    updateLesson,
    deleteLesson,
  };
}
