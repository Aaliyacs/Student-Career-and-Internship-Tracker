import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setFilters, resetFilters } from '../../redux/internshipSlice';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import type { ApplicationStatus } from '../../types';


const SearchFilter: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filters, applications } = useAppSelector((state) => state.internships);

  // Extract unique companies for dropdown filter
  const uniqueCompanies = Array.from(
    new Set(applications.map((app) => app.companyName))
  ).sort();

  // Extract unique locations for dropdown filter
  const uniqueLocations = Array.from(
    new Set(applications.map((app) => app.location).filter(Boolean))
  ).sort();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilters({ searchQuery: e.target.value }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilters({ status: e.target.value as ApplicationStatus | 'All' }));
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilters({ company: e.target.value }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilters({ location: e.target.value }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilters({ sortBy: e.target.value as any }));
  };

  const handleClearFilters = () => {
    dispatch(resetFilters());
  };

  // Determine if any filters are active
  const isFilterActive = 
    filters.searchQuery !== '' || 
    filters.status !== 'All' || 
    filters.company !== '' ||
    filters.location !== '' ||
    filters.sortBy !== 'appliedDateDesc';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs mb-6 transition-colors">
      <div className="flex flex-col gap-4">
        {/* Top row: Search input & Clear Button */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search by company name or job title..."
              value={filters.searchQuery}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm transition-all"
            />
          </div>

          {isFilterActive && (
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-sm transition-colors border border-slate-200 dark:border-slate-700"
            >
              <X size={16} />
              Clear Filters
            </button>
          )}
        </div>

        {/* Bottom row: Filter Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {/* Status Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <SlidersHorizontal size={12} /> Status
            </label>
            <select
              value={filters.status}
              onChange={handleStatusChange}
              className="block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
            >
              <option value="All">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Screening">Screening</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Company Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Company
            </label>
            <select
              value={filters.company}
              onChange={handleCompanyChange}
              className="block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
            >
              <option value="">All Companies</option>
              {uniqueCompanies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Location
            </label>
            <select
              value={filters.location}
              onChange={handleLocationChange}
              className="block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
            >
              <option value="">All Locations</option>
              {uniqueLocations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <ArrowUpDown size={12} /> Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              className="block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
            >
              <option value="appliedDateDesc">Applied Date (Newest)</option>
              <option value="appliedDateAsc">Applied Date (Oldest)</option>
              <option value="companyName">Company (A-Z)</option>
              <option value="status">Application Status</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
