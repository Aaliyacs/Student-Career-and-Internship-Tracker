import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchFilter from '../../components/SearchFilter/SearchFilter';
import InternshipTable from '../../components/InternshipTable/InternshipTable';
import { Plus, Briefcase } from 'lucide-react';

const Applications: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Briefcase className="text-primary-600 dark:text-primary-400" size={28} />
            My Applications
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Track and update all your active internship submissions and interview cycles.
          </p>
        </div>
        
        <button
          onClick={() => navigate('/applications/add')}
          className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-sm transition-all hover:-translate-y-0.5 shadow-md shadow-primary-500/10 shrink-0"
        >
          <Plus size={16} />
          Track Internship
        </button>
      </div>

      {/* Filters & Search Component */}
      <SearchFilter />

      {/* Main Internship Table / Cards list */}
      <InternshipTable />
    </div>
  );
};

export default Applications;
