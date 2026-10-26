import React from 'react';

export interface SharedTableProps<T> {
  items: T[];
  renderRow: (item: T) => React.ReactNode;
  header: string[];
  emptyMessage: string;
  colSpan: number;
  wrapperClassName?: string;
}

export const SharedTable = <T,>(props: SharedTableProps<T>) => {
  const {
    items,
    renderRow,
    header,
    emptyMessage,
    colSpan,
    wrapperClassName = 'bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-2xs',
  } = props;

  return (
    <div className={wrapperClassName}>
      <table className="w-full text-left border-collapse min-w-37.5">
        <thead>
          <tr className="bg-slate-50/80 border-b border-slate-200">
            {header.map((col) => (
              <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.length > 0 ? (
            items.map((item, idx) => (
              <React.Fragment key={idx}>{renderRow(item)}</React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={colSpan} className="px-6 py-12 text-center text-slate-500 text-sm">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
