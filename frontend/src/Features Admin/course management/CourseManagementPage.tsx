import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { AdminHeader } from './components/AdminHeader';
import { CourseMetrics } from './components/CourseMetrics';
import { CourseFilters } from './components/CourseFilters';
import { CourseTable } from './components/CourseTable';
import { CoursePreview } from './components/CoursePreview';
import { AddCourseModal } from './components/AddCourseModal';
import { DeleteCourseModal } from './components/DeleteCourseModal';
import { useCourseManagement } from './hooks/useCourseManagement';

interface CourseManagementPageProps {
  onTabChange?: (tab: string) => void;
}

export const CourseManagementPage: React.FC<CourseManagementPageProps> = ({
  onTabChange,
}) => {
  const [currentTab, setCurrentTab] = useState('Course Management');

  const {
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
  } = useCourseManagement();

  const handleHeaderTabChange = (tab: string) => {
    setCurrentTab(tab);
    onTabChange?.(tab);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <AdminHeader
        activeTab={currentTab}
        onTabChange={handleHeaderTabChange}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {selectedCourse ? (
          /* Course Preview Mode */
          <CoursePreview
            course={selectedCourse}
            onBack={() => setSelectedCourse(null)}
            onToggleStatus={handleToggleStatus}
            onDelete={promptDeleteCourse}
            onViewMetrics={() => setSelectedCourse(null)}
          />
        ) : (
          /* Course Management Overview */
          <>
            {/* Page Header & Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Course Management
                </h1>
                <p className="text-sm sm:text-base text-slate-500 mt-1">
                  Manage your course catalog and track student progress.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-medium text-sm rounded-lg transition-colors shadow-2xs cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Course</span>
              </button>
            </div>

            {/* Metrics Section */}
            <CourseMetrics metrics={metrics} />

            {/* Filters / Toolbar */}
            <CourseFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />

            {/* Data Table */}
            <CourseTable
              courses={filteredCourses}
              onPreview={(course) => setSelectedCourse(course)}
              onToggleStatus={handleToggleStatus}
              onDelete={promptDeleteCourse}
            />
          </>
        )}
      </main>

      {/* Modals */}
      <AddCourseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCourse={handleAddCourse}
      />

      <DeleteCourseModal
        course={courseToDelete}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteCourse}
      />
    </div>
  );
};

export default CourseManagementPage;
