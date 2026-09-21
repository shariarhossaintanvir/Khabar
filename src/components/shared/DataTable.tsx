import React from 'react';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessor?: keyof T | ((item: T) => React.ReactNode);
  className?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  renderMobileCard?: (item: T) => React.ReactNode;
  emptyMessage?: string;
  emptySubtext?: string;
  itemsPerPage?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  renderMobileCard,
  emptyMessage = 'No data available',
  emptySubtext = 'Try changing your search or filter settings.',
  itemsPerPage = 10,
  currentPage = 1,
  onPageChange,
  className = '',
}: DataTableProps<T>) {
  const totalPages = Math.ceil(data.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 border border-slate-100 shadow-card text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto border border-slate-100">
          <Inbox className="w-7 h-7" />
        </div>
        <h4 className="font-display font-black text-base text-slate-800 tracking-tight">
          {emptyMessage}
        </h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">{emptySubtext}</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden ${className}`}>
      {/* Desktop & Tablet Table */}
      <div className={`${renderMobileCard ? 'hidden md:block' : 'block'} overflow-x-auto`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`py-3.5 px-4 sm:px-6 ${col.className || ''} ${
                    col.align === 'right'
                      ? 'text-right'
                      : col.align === 'center'
                      ? 'text-center'
                      : 'text-left'
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs sm:text-sm">
            {paginatedData.map((item) => {
              const key = keyExtractor(item);
              return (
                <tr
                  key={key}
                  className="hover:bg-slate-50/60 transition-colors duration-100 group"
                >
                  {columns.map((col, cIdx) => {
                    let content: React.ReactNode = null;
                    if (typeof col.accessor === 'function') {
                      content = col.accessor(item);
                    } else if (col.accessor) {
                      content = (item[col.accessor] as unknown) as React.ReactNode;
                    }
                    return (
                      <td
                        key={cIdx}
                        className={`py-4 px-4 sm:px-6 text-slate-800 ${col.className || ''} ${
                          col.align === 'right'
                            ? 'text-right'
                            : col.align === 'center'
                            ? 'text-center'
                            : 'text-left'
                        }`}
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Conversion */}
      {renderMobileCard && (
        <div className="md:hidden divide-y divide-slate-100">
          {paginatedData.map((item) => (
            <div key={keyExtractor(item)} className="p-4 hover:bg-slate-50/50 transition-colors">
              {renderMobileCard(item)}
            </div>
          ))}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-800">{startIndex + 1}</strong> to{' '}
            <strong className="text-slate-800">
              {Math.min(startIndex + itemsPerPage, data.length)}
            </strong>{' '}
            of <strong className="text-slate-800">{data.length}</strong> items
          </span>

          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage <= 1}
              onClick={() => onPageChange?.(currentPage - 1)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-bold text-slate-800">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange?.(currentPage + 1)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
