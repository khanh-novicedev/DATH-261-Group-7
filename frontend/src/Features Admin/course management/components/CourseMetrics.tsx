import React from 'react';
import { CourseMetricsData } from '../types';

interface CourseMetricsProps {
  metrics: CourseMetricsData;
}

export const CourseMetrics: React.FC<CourseMetricsProps> = ({ metrics }) => {
  const cards = [
    {
      title: 'Total Enrolments',
      value: metrics.totalEnrolments.toLocaleString(),
    },
    {
      title: 'Completion Rate',
      value: `${metrics.completionRate}%`,
    },
    {
      title: 'Total Courses',
      value: metrics.totalCourses.toString(),
    },
  ];

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-medium text-slate-500">
        Enrolment &amp; Completion Metrics
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-[#EFF6FF] border border-blue-100/60 rounded-xl p-5 shadow-2xs transition-transform hover:-translate-y-0.5"
          >
            <p className="text-sm sm:text-base text-slate-600 font-normal">
              {card.title}
            </p>
            <p className="text-3xl sm:text-4xl font-bold text-blue-600 mt-2 tracking-tight">
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
