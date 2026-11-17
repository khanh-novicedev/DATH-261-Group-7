import React from 'react';
import { /*Plus,*/ AlertCircle } from 'lucide-react';
import { TablePagination } from '../shared/components/TablePagination';
import { CourseMetrics } from './components/CourseMetrics';
import { CourseFilters } from './components/CourseFilters';
import { CourseTable } from './components/CourseTable';
import { CoursePreview } from './components/CoursePreview';
// import { AddCourseModal } from './components/AddCourseModal';
import { DeleteCourseModal } from './components/DeleteCourseModal';
import { useCourseManagement } from './hooks/useCourseManagement';

export const CourseManagementPage: React.FC = () => {
  const {
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
    totalPages,
    totalElements,
    size,
    setSize,
    setPage,
    handleFilterChange,
    setSelectedCourse,
    handleToggleStatus,
    promptDeleteCourse,
    confirmChangeCourseStatus,
    // handleAddCourse,
    setIsChangeStatusModalOpen,
    // setIsAddModalOpen,
    setError,
  } = useCourseManagement();

  return (
    <div className="space-y-6">
      {/* Error Alert Banner */}
      {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center justify-between text-sm animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => setError?.(null)}
              className="text-xs font-semibold text-red-600 hover:text-red-800 underline cursor-pointer ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

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

              {/* <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-medium text-sm rounded-lg transition-colors shadow-2xs cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Course</span>
              </button> */}
            </div>

            {/* Metrics Section */}
            <CourseMetrics metrics={metrics} />

            {/* Filters / Toolbar */}
            <CourseFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />

            {/* Data Table */}
            {isLoading && courses.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-sm">
                Loading courses...
              </div>
            ) : (
              <>
                <CourseTable
                  courses={courses}
                  onPreview={(course) => setSelectedCourse(course)}
                  onToggleStatus={handleToggleStatus}
                  onDelete={promptDeleteCourse}
                />
                <TablePagination
                  page={page}
                  totalPages={totalPages}
                  totalElements={totalElements}
                  size={size}
                  onPageChange={setPage}
                  onSizeChange={setSize}
                />
              </>
            )}
          </>
        )}

      {/* Modals */}
      {/* <AddCourseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCourse={handleAddCourse}
      /> */}

      <DeleteCourseModal
        course={courseToChangeStatus}
        status={courseNewStatus}
        isOpen={isChangeStatusModalOpen}
        onClose={() => setIsChangeStatusModalOpen(false)}
        onConfirm={confirmChangeCourseStatus}
      />
    </div>
  );
};

export default CourseManagementPage;
