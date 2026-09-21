import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

export interface ChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  formattedValue?: string;
  tooltipInfo?: string;
}

interface ChartCardProps {
  title: string;
  subtitle?: string;
  data: ChartDataPoint[];
  type?: 'area' | 'bar';
  height?: number;
  valuePrefix?: string;
  valueSuffix?: string;
  timeframeOptions?: string[];
  selectedTimeframe?: string;
  onTimeframeChange?: (timeframe: string) => void;
  secondaryLabel?: string;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  data,
  type = 'area',
  height = 200,
  valuePrefix = '',
  valueSuffix = '',
  timeframeOptions = ['Today', '7 Days', '30 Days', '3 Months'],
  selectedTimeframe = '7 Days',
  onTimeframeChange,
  className = '',
}) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [currentTimeframe, setCurrentTimeframe] = useState(selectedTimeframe);

  const handleTimeframeClick = (tf: string) => {
    setCurrentTimeframe(tf);
    onTimeframeChange?.(tf);
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card">
        <h3 className="font-display font-bold text-base text-slate-800">{title}</h3>
        <p className="text-xs text-slate-400 mt-1">No chart data available</p>
      </div>
    );
  }

  const values = data.map((d) => d.value);
  const maxVal = Math.max(...values) * 1.15 || 100;
  const minVal = 0;
  const range = maxVal - minVal || 1;

  const width = 600;
  const svgHeight = height;
  const paddingX = 24;
  const paddingY = 24;
  const chartWidth = width - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  // Build points
  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1 || 1)) * chartWidth;
    const y = svgHeight - paddingY - ((d.value - minVal) / range) * chartHeight;
    return { x, y, data: d, index: i };
  });

  const linePath = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaPath = points.length
    ? `${linePath} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`
    : '';

  const hoveredPoint = activeIdx !== null ? points[activeIdx] : points[points.length - 1];

  return (
    <div
      className={`bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-card ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display font-black text-base sm:text-lg text-slate-900 tracking-tight">
              {title}
            </h3>
            {hoveredPoint && (
              <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-100 animate-in fade-in duration-200">
                {hoveredPoint.data.label}: {valuePrefix}
                {hoveredPoint.data.formattedValue || hoveredPoint.data.value.toLocaleString()}
                {valueSuffix}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>

        {/* Timeframe selector pills */}
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100 self-start sm:self-auto">
          {timeframeOptions.map((tf) => (
            <button
              key={tf}
              onClick={() => handleTimeframeClick(tf)}
              className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all ${
                currentTimeframe === tf
                  ? 'bg-white text-brand-600 shadow-xs border border-slate-200/80 font-black'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart Area */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${svgHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="brandChartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff4d2e" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ff4d2e" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff4d2e" />
              <stop offset="100%" stopColor="#ff7b65" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.33, 0.66, 1].map((ratio, i) => {
            const y = paddingY + ratio * chartHeight;
            return (
              <line
                key={i}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#f1f5f9"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            );
          })}

          {type === 'area' ? (
            <>
              {/* Filled Area */}
              <path d={areaPath} fill="url(#brandChartGrad)" />

              {/* Main Stroke Line */}
              <path
                d={linePath}
                fill="none"
                stroke="#ff4d2e"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Dots */}
              {points.map((p, i) => (
                <g key={i} className="cursor-pointer" onMouseEnter={() => setActiveIdx(i)}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={activeIdx === i ? 6 : 4}
                    fill="#ffffff"
                    stroke="#ff4d2e"
                    strokeWidth={activeIdx === i ? 3 : 2}
                    className="transition-all duration-150"
                  />
                  {/* Invisible hover hotspot */}
                  <rect
                    x={p.x - chartWidth / (data.length * 2)}
                    y={paddingY}
                    width={chartWidth / data.length}
                    height={chartHeight}
                    fill="transparent"
                  />
                </g>
              ))}
            </>
          ) : (
            /* Bar Chart Rendering */
            points.map((p, i) => {
              const barWidth = Math.max(8, (chartWidth / data.length) * 0.55);
              const barHeight = svgHeight - paddingY - p.y;
              const isHovered = activeIdx === i;
              return (
                <g key={i} className="cursor-pointer" onMouseEnter={() => setActiveIdx(i)}>
                  <rect
                    x={p.x - barWidth / 2}
                    y={p.y}
                    width={barWidth}
                    height={barHeight}
                    rx="4"
                    fill={isHovered ? '#e03e22' : 'url(#barGrad)'}
                    className="transition-all duration-150"
                  />
                  {/* Invisible hover hotspot */}
                  <rect
                    x={p.x - chartWidth / (data.length * 2)}
                    y={paddingY}
                    width={chartWidth / data.length}
                    height={chartHeight}
                    fill="transparent"
                  />
                </g>
              );
            })
          )}
        </svg>

        {/* X-Axis labels */}
        <div className="flex justify-between items-center px-4 pt-2 text-[11px] font-semibold text-slate-400">
          {data.map((d, i) => {
            // Show select labels on smaller screens to prevent crowding
            const isVisible =
              data.length <= 7 || i === 0 || i === Math.floor(data.length / 2) || i === data.length - 1;
            return (
              <span
                key={i}
                className={`${isVisible ? 'inline' : 'hidden sm:inline'} ${
                  activeIdx === i ? 'text-brand-600 font-bold' : ''
                }`}
              >
                {d.label}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
