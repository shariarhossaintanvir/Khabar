import React from 'react';

export const RestaurantCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/70 shadow-xs animate-pulse">
      <div className="h-44 w-full bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div className="h-4 bg-slate-200 rounded w-3/5" />
          <div className="h-4 bg-slate-200 rounded w-10" />
        </div>
        <div className="h-3 bg-slate-100 rounded w-4/5" />
        <div className="pt-3 border-t border-slate-100 flex justify-between">
          <div className="h-3 bg-slate-200 rounded w-16" />
          <div className="h-3 bg-slate-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
};

export const FoodCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-3 border border-slate-200/70 shadow-xs animate-pulse flex gap-3">
      <div className="w-24 h-24 rounded-xl bg-slate-200 shrink-0" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-4 bg-slate-200 rounded w-16 mt-2" />
      </div>
    </div>
  );
};

export const OrderCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs animate-pulse space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-5 bg-slate-200 rounded w-1/3" />
        <div className="h-5 bg-slate-200 rounded w-20" />
      </div>
      <div className="h-3 bg-slate-100 rounded w-1/2" />
      <div className="h-10 bg-slate-100 rounded-xl w-full" />
    </div>
  );
};
