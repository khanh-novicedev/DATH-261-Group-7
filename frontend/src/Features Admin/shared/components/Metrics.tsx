import React from 'react';
import { Metric } from '../types/Metric';

interface MetricsProps {
  metrics: Metric[];
}

export const Metrics: React.FC<MetricsProps> = (list) => {
  return (
    <section className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {list.metrics.map((metric) => (
          <div
            key={metric.title}
            className="bg-[#EFF6FF] border border-blue-100/60 rounded-xl p-5 shadow-2xs transition-transform hover:-translate-y-0.5"
          >
            <p className="text-sm sm:text-base text-slate-600 font-normal">
              {metric.title}
            </p>
            <p className="text-3xl sm:text-4xl font-bold text-blue-600 mt-2 tracking-tight">
              {metric.value} {metric.unit}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
