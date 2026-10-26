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
      header={["Course / Instructor", "Enrolments", "Completion", "Actions"]}
      emptyMessage="No courses found matching your criteria."
      colSpan={4}
    />
  );
};
