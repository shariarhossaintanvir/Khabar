import React from 'react';
import { Search, X } from 'lucide-react';

export interface FilterChipItem {
  id: string;
  label: string;
  count?: number;
}

interface FilterBarProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterChips?: FilterChipItem[];
  activeChip?: string;
  onChipSelect?: (id: string) => void;
  actionButton?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  };
  children?: React.ReactNode;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchPlaceholder = 'Search...',
  searchValue,
  onSearchChange,
  filterChips,
  activeChip,
  onChipSelect,
  actionButton,
  children,
  className = '',
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 shadow-2xs transition-all"
          />
          {searchValue && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right Action / Addons */}
        <div className="flex items-center gap-2 flex-wrap">
          {children}

          {actionButton && (
            <button
              onClick={actionButton.onClick}
              className="px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs hover:shadow-brand transition-all active:scale-95 shrink-0"
            >
              {actionButton.icon}
              <span>{actionButton.label}</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter chips horizontal list */}
      {filterChips && filterChips.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-1 pt-0.5">
          {filterChips.map((chip) => {
            const isActive = activeChip === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => onChipSelect?.(chip.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                <span>{chip.label}</span>
                {chip.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {chip.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
