import React from 'react';
import { Course } from '../types';
import { CourseTableRow } from './CourseTableRow';
import { SharedTable } from '../../shared/components/SharedTable';

interface CourseTableProps {
  courses: Course[];
  onPreview: (course: Course) => void;
  onToggleStatus: (course: Course) => void;
  onDelete: (course: Course) => void;
}

/**
 * CourseTable now uses the generic SharedTable component.
 */
export const CourseTable: React.FC<CourseTableProps> = ({
  courses,
  onPreview,
  onToggleStatus,
  onDelete,
}) => {
  return (
    <SharedTable
      items={courses}
      renderRow={(course) => (
        <CourseTableRow
          key={course.id}
          course={course}
          onPreview={onPreview}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
        />
      )}
      header={(
        <thead>
          <tr className="bg-slate-50/80 border-b border-slate-200">
            <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Course / Instructor
            </th>
            <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Enrolments
            </th>
            <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Completion
            </th>
            <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
              Actions
            </th>
          </tr>
        </thead>
      )}
      emptyMessage="No courses found matching your criteria."
      colSpan={4}
    />
  );
};
