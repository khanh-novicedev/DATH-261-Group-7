import { useState, useMemo } from 'react';
import { Course, CourseFilterState, CourseMetricsData } from '../types';
import { initialCourses, initialMetrics } from '../api/mockData';

export const useCourseManagement = () => {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [filters, setFilters] = useState<CourseFilterState>({
    search: '',
    status: 'All',
    visibility: 'All',
  });

  const handleFilterChange = (newFilters: Partial<CourseFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Search
      const matchesSearch =
        filters.search.trim() === '' ||
        course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        course.instructor.toLowerCase().includes(filters.search.toLowerCase());

      // Status
      const matchesStatus =
        filters.status === 'All' || course.status === filters.status;

      // Visibility
      const matchesVisibility =
        filters.visibility === 'All' || course.status === filters.visibility;

      return matchesSearch && matchesStatus && matchesVisibility;
    });
  }, [courses, filters]);

  // Compute metrics dynamically based on current courses
  const metrics: CourseMetricsData = useMemo(() => {
    if (courses.length === 0) {
      return { totalEnrolments: 0, completionRate: 0, totalCourses: 0 };
    }
    const totalEnrolments = courses.reduce((acc, c) => acc + c.enrolments, 0);
    const avgCompletion = Math.round(
      courses.reduce((acc, c) => acc + c.completionRate, 0) / courses.length
    );
    return {
      totalEnrolments: totalEnrolments || initialMetrics.totalEnrolments,
      completionRate: avgCompletion || initialMetrics.completionRate,
      totalCourses: courses.length,
    };
  }, [courses]);

  // Toggle Published <-> Hidden
  const handleToggleStatus = (course: Course) => {
    const updatedStatus =
      course.status === 'Published' ? 'Hidden' : 'Published';

    setCourses((prev) =>
      prev.map((c) =>
        c.id === course.id ? { ...c, status: updatedStatus } : c
      )
    );

    if (selectedCourse?.id === course.id) {
      setSelectedCourse((prev) =>
        prev ? { ...prev, status: updatedStatus } : null
      );
    }
  };

  const promptDeleteCourse = (course: Course) => {
    setCourseToDelete(course);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteCourse = () => {
    if (!courseToDelete) return;
    setCourses((prev) => prev.filter((c) => c.id !== courseToDelete.id));

    if (selectedCourse?.id === courseToDelete.id) {
      setSelectedCourse(null);
    }

    setCourseToDelete(null);
  };

  const handleAddCourse = (
    newCourseData: Omit<Course, 'id' | 'enrolments' | 'completionRate'>
  ) => {
    const newCourse: Course = {
      ...newCourseData,
      id: `course-${Date.now()}`,
      enrolments: 0,
      completionRate: 0,
    };
    setCourses((prev) => [newCourse, ...prev]);
  };

  return {
    courses,
    filteredCourses,
    metrics,
    filters,
    selectedCourse,
    courseToDelete,
    isDeleteModalOpen,
    isAddModalOpen,
    handleFilterChange,
    setSelectedCourse,
    handleToggleStatus,
    promptDeleteCourse,
    confirmDeleteCourse,
    handleAddCourse,
    setIsDeleteModalOpen,
    setIsAddModalOpen,
  };
};
