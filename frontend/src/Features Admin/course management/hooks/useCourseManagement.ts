import { useState, useMemo, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Course, CourseMetricsData, LessonType } from '../types';
import { CourseStatus } from '@shared/types'
// import { initialMetrics } from '../api/mockData';
import { updateCourseStatus } from '@shared/api/courseApi';
import { getCatalog, getCourse, CatalogQuery } from '@shared/api/courseApi';
import type { CourseCatalogItem } from '@shared/api/types';


function mapCatalogItemToCourse(item: CourseCatalogItem): Course {
  return {
    id: item.id,
    title: item.title,
    instructor: item.instructor?.fullName ?? 'Unknown Instructor',
    instructorId: item.instructor?.id,
    category: item.category,
    lessonCount: item.lessonCount,
    enrolments: 0,
    completionRate: 0,
    status: item.status,
    description: item.description ?? '',
    lessons: [],
    prerequisites: [],
    livePracticesCount: 0,
    studentCount: 0,
    forumThreadsCount: 0,
    unansweredThreadsCount: 0,
  };
}

export const useCourseManagement = () => {
  // Get courses
  const [filters, setFilters] = useState<CatalogQuery>({
    keyword: undefined,
    status: undefined,
    category: undefined,
  });
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [courses, setCourses] = useState<Course[]>([]);
  
  // Get courses details
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  // Hide course
  const [courseToChangeStatus, setCourseToChangeStatus] = useState<Course | null>(null);
  const [courseNewStatus, setCourseNewStatus] = useState<CourseStatus>('HIDDEN');
  const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] = useState(false);
  
  // Metrics
  const [totalElements, setTotalElements] = useState(0);
  
  // Add course
  // const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Call API
  const [isLoading, setIsLoading] = useState(false);

  // Error
  const [error, setError] = useState<string | null>(null);

  // ========================== Functions ==========================
  // Get courses
  const handleFilterChange = (newFilters: Partial<CatalogQuery>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(0);
  };

  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
    setPage(0);
  };


  const loadCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const activeStatus = filters.status ? filters.status : undefined;
    const activeCategory = filters.category ? filters.category : undefined;

    try {
      const response = await getCatalog({
        keyword: filters.keyword?.trim() || undefined,
        status: activeStatus,
        category: activeCategory,
        page,
        size,
      });

      if (response && Array.isArray(response.items)) {
        const mapped = response.items.map(mapCatalogItemToCourse);
        setCourses(mapped);
        setTotalElements(response.totalElements ?? mapped.length);
        setTotalPages(response.totalPages ?? 1);
      }
    } catch (err: unknown) {
      console.warn('[useCourseManagement] Could not fetch catalog from API, falling back to initial data:', err);
      if (axios.isAxiosError(err) && err.response) {
        const status = err.response.status;
        if (status === 403) {
          setError('You do not have permission to view the course catalog.');
        } else {
          setError(`Error loading course catalog (HTTP ${status}).`);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [filters.keyword, filters.status, filters.category, page, size]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  /*const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Search
      const matchesSearch =
        filters.keyword?.trim() === '' ||
        course.title.toLowerCase().includes(filters.keyword ? filters.keyword.toLowerCase() : "") ||
        course.instructor.toLowerCase().includes(filters.keyword ? filters.keyword.toLowerCase() : "");

      // Status
      const matchesStatus =
        filters.status || course.status === filters.status;

      // Visibility
      const matchesVisibility =
        filters.visibility === 'All' || course.status === filters.visibility;

      return matchesSearch && matchesStatus && matchesVisibility;
    });
  }, [courses, filters]);*/

  // Get courses details
  const handleSelectCourse = async (course: Course | null) => {
    setSelectedCourse(course);
    if (!course) return;

    try {
      const detailed = await getCourse(course.id);
      setSelectedCourse((prev) => {
        if (!prev || prev.id !== course.id) return prev;
        return {
          ...prev,
          description: detailed.description ?? prev.description,
          status: detailed.status ?? prev.status,
          category: detailed.category ?? prev.category,
          lessons: detailed.lessons?.map((l) => ({
            id: l.id,
            lessonNumber: l.sequenceNumber,
            title: l.title,
            type: (l.type === 'VIDEO' ? 'Video' : l.type === 'LIVE_PRACTICE' ? 'Live Practice' : 'Document') as LessonType,
            durationOrMeta: `${l.type} · Lesson ${l.sequenceNumber}`,
            isUnlocked: true,
          })) ?? prev.lessons,
        };
      });
    } catch (err) {
      console.debug('[useCourseManagement] Could not fetch detailed course info:', err);
    }
  };

  // Change course status
  // PUBLISHED / DRAFT
  const handleToggleStatus = async (course: Course) => {
    const updatedStatus: CourseStatus = (course.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED');
    setIsLoading(true);
    setError(null);

    try {
      const result = await updateCourseStatus(course.id, updatedStatus);
      const newStatus = result.status;

      setCourses((prev) =>
        prev.map((c) =>
          c.id === course.id ? { ...c, status: newStatus } : c
        )
      );

      if (selectedCourse?.id === course.id) {
        setSelectedCourse((prev) =>
          prev ? { ...prev, status: newStatus } : null
        );
      }
    } catch (err: unknown) {
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // HIDDEN
  const promptDeleteCourse = (course: Course, targetStatus: CourseStatus = 'HIDDEN') => {
    setCourseToChangeStatus(course);
    setCourseNewStatus(targetStatus);
    setIsChangeStatusModalOpen(true);
  };

  const confirmChangeCourseStatus = async () => {
    if (!courseToChangeStatus) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await updateCourseStatus(courseToChangeStatus.id, courseNewStatus);
      const newStatus = result.status;

      setCourses((prev) => prev.filter((c) => c.id !== courseToChangeStatus.id));

      if (selectedCourse?.id === courseToChangeStatus.id) {
        setSelectedCourse((prev) =>
          prev ? { ...prev, status: newStatus } : null
        );
      }
    } catch (err: unknown) {
      handleApiError(err);
    } finally {
      setIsLoading(false);
      setIsChangeStatusModalOpen(false);
      setCourseToChangeStatus(null);
    }
  };

  // Add course
  /*const handleAddCourse = (
    newCourseData: Omit<Course, 'id' | 'enrolments' | 'completionRate'>
  ) => {
    const newCourse: Course = {
      ...newCourseData,
      id: `course-${Date.now()}`,
      enrolments: 0,
      completionRate: 0,
    };
    setCourses((prev) => [newCourse, ...prev]);
  };*/

  // Metrics
  const metrics: CourseMetricsData = useMemo(() => {
    const totalCount = totalElements;
    if (courses.length === 0) {
      return { totalEnrolments: 0, completionRate: 0, totalCourses: totalCount };
    }
    const totalEnrolments = courses.reduce((acc, c) => acc + (c.enrolments ?? 0), 0);
    const avgCompletion = Math.round(
      courses.reduce((acc, c) => acc + (c.completionRate ?? 0), 0) / courses.length
    );
    return {
      totalEnrolments: totalEnrolments,
      completionRate: avgCompletion,
      totalCourses: totalCount,
    };
  }, [courses, totalElements]);

  // Error
  const handleApiError = (err: unknown) => {
    if (axios.isAxiosError(err) && err.response) {
      const status = err.response.status;
      switch (status) {
        case 400:
          console.error(
            '[CourseManagement] 400 VALIDATION_ERROR – Invalid status value or request body.',
            err.response.data,
          );
          setError('Validation error: Invalid course status provided.');
          break;
        case 403:
          console.error(
            '[CourseManagement] 403 FORBIDDEN – Not course owner or Admin.',
            err.response.data,
          );
          setError('You do not have permission to change this course status.');
          break;
        case 404:
          console.error(
            '[CourseManagement] 404 COURSE_NOT_FOUND – Course ID does not exist.',
            err.response.data,
          );
          setError('Course not found.');
          break;
        default:
          console.error(
            `[CourseManagement] Unexpected HTTP ${status}`,
            err.response.data,
          );
          setError(`An unexpected error occurred (HTTP ${status}).`);
      }
    } else {
      console.error('[CourseManagement] Network / unknown error', err);
      setError('Unable to connect to the server. Please check your network.');
    }
  };

  return {
    courses,
    metrics,
    filters,
    selectedCourse,
    courseToChangeStatus,
    courseNewStatus,
    isChangeStatusModalOpen,
    // isAddModalOpen,
    isLoading,
    error,
    page,
    setPage,
    size,
    setSize: handleSizeChange,
    totalPages,
    totalElements,
    loadCourses,
    handleFilterChange,
    setSelectedCourse: handleSelectCourse,
    handleToggleStatus,
    promptDeleteCourse,
    confirmChangeCourseStatus,
    // handleAddCourse,
    setIsChangeStatusModalOpen,
    // setIsAddModalOpen,
    setError,
  };
};
