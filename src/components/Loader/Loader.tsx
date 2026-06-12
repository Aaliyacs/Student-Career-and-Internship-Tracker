import React from 'react';

export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; color?: string }> = ({ 
  size = 'md', 
  color = 'border-primary-500' 
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex items-center justify-center">
      <div 
        className={`animate-spin rounded-full border-t-transparent ${color} ${sizeClasses[size]}`}
      ></div>
    </div>
  );
};

export const FullPageSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl flex flex-col items-center gap-3">
        <Spinner size="lg" />
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Loading your profile...</span>
      </div>
    </div>
  );
};

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-xs animate-pulse">
          <div className="flex justify-between items-start mb-4">
            <div className="h-6 w-1/3 bg-slate-200 dark:bg-slate-700 rounded-sm"></div>
            <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
          </div>
          <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded-sm mb-2"></div>
          <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-700 rounded-sm mb-4"></div>
          <div className="h-8 w-full bg-slate-100 dark:bg-slate-700 rounded-lg"></div>
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-xs animate-pulse">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex gap-4">
        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded-sm"></div>
        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded-sm"></div>
        <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded-sm"></div>
      </div>
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="px-6 py-5 flex items-center justify-between">
            <div className="flex flex-col gap-2 w-1/3">
              <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-sm w-3/4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-sm w-1/2"></div>
            </div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-sm w-1/6"></div>
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-20"></div>
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-16"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
