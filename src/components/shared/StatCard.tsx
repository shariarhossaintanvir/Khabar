import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string | number;
    isPositive: boolean;
    label?: string;
  };
  sparkline?: number[];
  subtext?: string;
  accent?: 'brand' | 'emerald' | 'blue' | 'amber' | 'purple';
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  sparkline,
  subtext,
  accent = 'brand',
  className = '',
  onClick,
}) => {
  const accentColors = {
    brand: {
      iconBg: 'bg-brand-50 text-brand-600 border-brand-100',
      spark: '#ff4d2e',
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      spark: '#10b981',
    },
    blue: {
      iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
      spark: '#3b82f6',
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      spark: '#f59e0b',
    },
    purple: {
      iconBg: 'bg-purple-50 text-purple-600 border-purple-100',
      spark: '#8b5cf6',
    },
  }[accent];

  // Generate SVG path for sparkline if provided
  const renderSparkline = () => {
    if (!sparkline || sparkline.length < 2) return null;
    const min = Math.min(...sparkline);
    const max = Math.max(...sparkline);
    const range = max - min || 1;
    const width = 80;
    const height = 28;

    const points = sparkline.map((val, idx) => {
      const x = (idx / (sparkline.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return (
      <svg
        className="overflow-visible w-20 h-7 shrink-0 opacity-80"
        viewBox={`0 0 ${width} ${height}`}
      >
        <polyline
          fill="none"
          stroke={accentColors.spark}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points.join(' ')}
        />
      </svg>
    );
  };

  return (
    <div
      onClick={onClick}
      className={`relative bg-white rounded-2xl p-5 border border-slate-100 shadow-card hover:shadow-card-hover transition-all duration-200 group ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
            {title}
          </p>
          <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            {value}
          </h3>
        </div>

        <div
          className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-105 ${accentColors.iconBg}`}
        >
          {icon}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {trend && (
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                trend.isPositive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                  : 'bg-rose-50 text-rose-700 border border-rose-200/60'
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{trend.value}</span>
            </span>
          )}

          {subtext && (
            <span className="text-xs text-slate-400 font-medium">
              {subtext}
            </span>
          )}
        </div>

        {renderSparkline()}
      </div>
    </div>
  );
};
