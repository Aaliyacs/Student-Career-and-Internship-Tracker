import React from 'react';
import { useAppSelector } from '../../hooks';
import { 
  Briefcase, 
  Clock, 
  Calendar, 
  Award, 
  XCircle 
} from 'lucide-react';

const DashboardCards: React.FC = () => {
  const { applications } = useAppSelector((state) => state.internships);

  // Compute metrics
  const total = applications.length;
  
  const inProgress = applications.filter(
    (app) => app.status === 'Applied' || app.status === 'Screening'
  ).length;
  
  const interviews = applications.filter((app) => app.status === 'Interview').length;
  const offers = applications.filter((app) => app.status === 'Offer').length;
  const rejections = applications.filter((app) => app.status === 'Rejected').length;

  const cardStats = [
    {
      label: 'Total Applications',
      value: total,
      icon: Briefcase,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900',
    },
    {
      label: 'In Progress',
      value: inProgress,
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900',
    },
    {
      label: 'Interviews Scheduled',
      value: interviews,
      icon: Calendar,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900',
    },
    {
      label: 'Offers Received',
      value: offers,
      icon: Award,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900',
    },
    {
      label: 'Rejected',
      value: rejections,
      icon: XCircle,
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
      {cardStats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className={`flex flex-row sm:flex-col lg:flex-row justify-between items-center sm:items-start lg:items-center p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${stat.bgColor}`}
          >
            <div className="flex flex-col gap-1.5 order-2 sm:order-1 lg:order-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {stat.label}
              </span>
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {stat.value}
              </span>
            </div>
            
            <div className={`p-3 rounded-xl bg-white dark:bg-slate-800 border shadow-xs border-slate-100 dark:border-slate-800 order-1 sm:order-2 lg:order-1 ${stat.color}`}>
              <Icon size={22} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCards;
