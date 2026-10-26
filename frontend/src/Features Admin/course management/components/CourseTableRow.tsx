import React from 'react';
import { MoreHorizontal, Eye, EyeOff, Trash2 } from 'lucide-react';
import { Course } from '../types';
import { Dropdown } from '../../shared/components/Dropdown';

interface CourseTableRowProps {
  course: Course;
  onPreview: (course: Course) => void;
  onToggleStatus: (course: Course) => void;
  onDelete: (course: Course) => void;
}

export const CourseTableRow: React.FC<CourseTableRowProps> = ({
  course,
  onPreview,
  onToggleStatus,
  onDelete,
}) => {
  const isPublished = course.status === 'Published';

  return (
    <tr className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60 transition-colors">
      {/* Course / Instructor */}
      <td className="px-6 py-4">
        <div
          className="flex items-center gap-3.5 cursor-pointer group"
          onClick={() => onPreview(course)}
        >
          {course.thumbnailUrl ? (
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="w-12 h-12 rounded-lg object-cover border border-slate-200/80 shrink-0 shadow-2xs"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-slate-100 text-slate-700 font-semibold flex items-center justify-center shrink-0 border border-slate-200">
              {course.title.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors truncate">
              {course.title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{course.instructor}</p>
          </div>
        </div>
      </td>

      {/* Enrolments */}
      <td className="px-6 py-4 text-sm text-slate-700 font-normal">
        {course.enrolments.toLocaleString()}
      </td>

      {/* Completion */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-700 w-10">
            {course.completionRate}%
          </span>
          <div className="w-20 sm:w-28 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
            <div
              className="bg-slate-900 h-full rounded-full transition-all duration-300"
              style={{ width: `${course.completionRate}%` }}
            />
          </div>
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-right">
        <Dropdown
          trigger={<MoreHorizontal className="w-4 h-4" />}
        >
          <button
            type="button"
            onClick={() => {
              onPreview(course);
            }}
            className="w-full text-left px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-slate-500" />
            <span>Preview Course</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onToggleStatus(course);
            }}
            className="w-full text-left px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            {isPublished ? (
              <>
                <EyeOff className="w-4 h-4 text-slate-500" />
                <span>Hide Course</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-slate-500" />
                <span>Publish Course</span>
              </>
            )}
          </button>
          <div className="border-t border-slate-100 my-1" />
          <button
            type="button"
            onClick={() => {
              onDelete(course);
            }}
            className="w-full text-left px-3.5 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
            <span>Delete Course</span>
          </button>
        </Dropdown>
      </td>
    </tr>
  );
};
