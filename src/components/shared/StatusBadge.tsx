import React from 'react';

export type StatusType =
  // Order statuses
  | 'PLACED'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'PICKED_UP'
  | 'ON_THE_WAY'
  | 'DELIVERED'
  | 'CANCELLED'
  // Restaurant / Partner statuses
  | 'ACTIVE'
  | 'PENDING'
  | 'SUSPENDED'
  | 'CLOSED'
  | 'NEEDS_CHANGES'
  | 'REJECTED'
  | 'APPROVED'
  // Rider statuses
  | 'ONLINE'
  | 'OFFLINE'
  | 'BUSY'
  // Transaction statuses
  | 'SUCCESS'
  | 'REFUNDED'
  | 'FAILED'
  // Stock statuses
  | 'IN_STOCK'
  | 'LOW_STOCK'
  | 'OUT_OF_STOCK'
  // Support ticket statuses
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'RESOLVED';

interface StatusBadgeProps {
  status: StatusType | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  pulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
  pulse = false,
}) => {
  const normStatus = (status || '').toUpperCase();

  const getStyle = (): { bg: string; text: string; border: string; label: string; dot: string } => {
    switch (normStatus) {
      case 'DELIVERED':
      case 'SUCCESS':
      case 'APPROVED':
      case 'RESOLVED':
      case 'ACTIVE':
      case 'IN_STOCK':
      case 'ONLINE':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200/80',
          label: normStatus.replace(/_/g, ' '),
          dot: 'bg-emerald-500',
        };

      case 'PREPARING':
      case 'CONFIRMED':
      case 'IN_PROGRESS':
      case 'LOW_STOCK':
      case 'BUSY':
      case 'NEEDS_CHANGES':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200/80',
          label: normStatus.replace(/_/g, ' '),
          dot: 'bg-amber-500',
        };

      case 'ON_THE_WAY':
      case 'PICKED_UP':
      case 'PLACED':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200/80',
          label: normStatus.replace(/_/g, ' '),
          dot: 'bg-blue-500',
        };

      case 'CANCELLED':
      case 'REJECTED':
      case 'SUSPENDED':
      case 'OUT_OF_STOCK':
      case 'FAILED':
      case 'OFFLINE':
      case 'CLOSED':
        return {
          bg: 'bg-rose-50',
          text: 'text-rose-700',
          border: 'border-rose-200/80',
          label: normStatus.replace(/_/g, ' '),
          dot: 'bg-rose-500',
        };

      case 'REFUNDED':
      case 'OPEN':
      case 'PENDING':
      default:
        return {
          bg: 'bg-slate-100',
          text: 'text-slate-700',
          border: 'border-slate-200',
          label: normStatus.replace(/_/g, ' '),
          dot: 'bg-slate-400',
        };
    }
  };

  const style = getStyle();

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-[11px] px-2.5 py-1 gap-1.5',
    lg: 'text-xs px-3 py-1.5 gap-2 font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-bold tracking-tight rounded-full border ${style.bg} ${style.text} ${style.border} ${sizeClasses} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${style.dot} ${
          pulse || normStatus === 'ONLINE' || normStatus === 'PREPARING' || normStatus === 'ON_THE_WAY'
            ? 'animate-pulse'
            : ''
        }`}
      />
      <span>{style.label}</span>
    </span>
  );
};
