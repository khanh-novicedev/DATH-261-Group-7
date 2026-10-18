import React from 'react';

/**
 * Generic reusable table component used by both Course and User management pages.
 * It renders a <table> with a supplied header and a list of rows rendered via `renderRow`.
 * The component is intentionally lightweight – it only handles the surrounding layout,
 * empty‑state handling and basic styling (Tailwind) that is shared across the two pages.
 */
export interface SharedTableProps<T> {
  /** Array of items to render as rows */
  items: T[];
  /** Render a single row given an item */
  renderRow: (item: T) => React.ReactNode;
  /** Header JSX (usually a <tr> with <th> cells) */
  header: React.ReactNode;
  /** Message shown when `items` is empty */
  emptyMessage: string;
  /** Number of columns for the empty‑state <td> (colSpan) */
  colSpan: number;
  /** Additional Tailwind classes for the outer wrapper div */
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
        <thead>{header}</thead>
        <tbody className="divide-y divide-slate-100">
          {items.length > 0 ? (
            items.map((item, idx) => (
              // Row components already provide a unique key prop
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
