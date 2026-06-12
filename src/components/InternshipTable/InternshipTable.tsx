import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { deleteApplication } from '../../redux/internshipSlice';
import { useToast } from '../../context/ToastContext';
import ConfirmationModal from '../Modal/ConfirmationModal';
import { 
  Eye, 
  Edit3, 
  Trash2, 
  MapPin, 
  Calendar, 
  Inbox, 
  Plus,
  Mail,
  DollarSign,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import type { InternshipApplication } from '../../types';


const ITEMS_PER_PAGE = 5;

const InternshipTable: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  
  const { applications, filters } = useAppSelector((state) => state.internships);

  // States
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApp, setSelectedApp] = useState<InternshipApplication | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // 1. Apply Filters & Sorting
  const filteredApplications = applications
    .filter((app) => {
      // Search query (Company or Job Title)
      const query = filters.searchQuery.toLowerCase();
      const matchesSearch = 
        app.companyName.toLowerCase().includes(query) || 
        app.jobTitle.toLowerCase().includes(query);
      
      // Status filter
      const matchesStatus = filters.status === 'All' || app.status === filters.status;

      // Company filter
      const matchesCompany = !filters.company || app.companyName === filters.company;

      // Location filter
      const matchesLocation = !filters.location || app.location === filters.location;

      return matchesSearch && matchesStatus && matchesCompany && matchesLocation;
    })
    .sort((a, b) => {
      // Sorting
      if (filters.sortBy === 'appliedDateDesc') {
        return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
      }
      if (filters.sortBy === 'appliedDateAsc') {
        return new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime();
      }
      if (filters.sortBy === 'companyName') {
        return a.companyName.localeCompare(b.companyName);
      }
      if (filters.sortBy === 'status') {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });

  // 2. Pagination Calculations
  const totalItems = filteredApplications.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedApps = filteredApplications.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Adjust current page if filters reduce items
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  // Handle Delete Confirmation
  const handleDeleteConfirm = () => {
    if (deleteId) {
      dispatch(deleteApplication(deleteId));
      showToast('Application deleted successfully', 'success');
      setDeleteId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      Applied: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      Screening: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      Interview: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      Offer: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      Rejected: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    };
    return badges[status as keyof typeof badges] || '';
  };

  return (
    <div className="w-full">
      {/* Empty State */}
      {totalItems === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center">
          <div className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-2xl mb-4 border border-slate-100 dark:border-slate-700">
            <Inbox size={42} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No applications found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
            Try adjusting your search criteria or add a new internship application to start tracking.
          </p>
          <button
            onClick={() => navigate('/applications/add')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-xs"
          >
            <Plus size={16} />
            Track Internship
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs transition-colors">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800">
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Company</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Job Title</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Applied Date</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Location</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {paginatedApps.map((app) => (
                  <tr 
                    key={app.id} 
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="py-4.5 px-6">
                      <span className="font-semibold text-slate-900 dark:text-white block">{app.companyName}</span>
                    </td>
                    <td className="py-4.5 px-6">
                      <span className="text-slate-700 dark:text-slate-300 font-medium block">{app.jobTitle}</span>
                    </td>
                    <td className="py-4.5 px-6">
                      <span className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1.5">
                        <Calendar size={14} />
                        {app.appliedDate}
                      </span>
                    </td>
                    <td className="py-4.5 px-6">
                      <span className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1.5">
                        <MapPin size={14} />
                        {app.location}
                      </span>
                    </td>
                    <td className="py-4.5 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-4.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => navigate(`/applications/edit/${app.id}`)}
                          className="p-1.5 text-primary-500 hover:text-primary-700 hover:bg-primary-50 dark:hover:bg-primary-950/20 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteId(app.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="block md:hidden space-y-4">
            {paginatedApps.map((app) => (
              <div 
                key={app.id} 
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col gap-3.5 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-950 dark:text-white text-base leading-tight">{app.companyName}</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm font-medium mt-0.5">{app.jobTitle}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(app.status)}`}>
                    {app.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 border-y border-slate-100 dark:border-slate-800 py-3">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    {app.appliedDate}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} />
                    {app.location}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    <Eye size={14} /> Details
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/applications/edit/${app.id}`)}
                      className="p-2 text-primary-500 bg-primary-50 dark:bg-primary-950/40 rounded-xl transition-all"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteId(app.id)}
                      className="p-2 text-rose-500 bg-rose-50 dark:bg-rose-950/40 rounded-xl transition-all"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-5 px-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, totalItems)} of {totalItems} entries
              </span>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`h-9 w-9 text-xs font-semibold rounded-xl border transition-all ${
                      currentPage === idx + 1
                        ? 'bg-primary-600 border-primary-600 text-white shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* 3. Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteId !== null}
        title="Delete Application"
        message="Are you sure you want to remove this internship application? This action cannot be undone."
        confirmText="Remove"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />

      {/* 4. Details View Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs" 
            onClick={() => setSelectedApp(null)}
          ></div>
          
          {/* Modal content */}
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl max-w-lg w-full z-10 animate-scale-up">
            <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-950 dark:text-white leading-tight">
                  {selectedApp.companyName}
                </h3>
                <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mt-0.5">
                  {selectedApp.jobTitle}
                </p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(selectedApp.status)}`}>
                {selectedApp.status}
              </span>
            </div>

            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-semibold text-slate-400 block uppercase">Applied Date</span>
                  <span className="font-medium flex items-center gap-1.5 mt-1 text-slate-800 dark:text-slate-200">
                    <Calendar size={14} className="text-slate-400" />
                    {selectedApp.appliedDate}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 block uppercase">Location</span>
                  <span className="font-medium flex items-center gap-1.5 mt-1 text-slate-800 dark:text-slate-200">
                    <MapPin size={14} className="text-slate-400" />
                    {selectedApp.location}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-50 dark:border-slate-800/40 pt-4">
                <div>
                  <span className="text-xs font-semibold text-slate-400 block uppercase">Salary / Compensation</span>
                  <span className="font-medium flex items-center gap-1.5 mt-1 text-slate-800 dark:text-slate-200">
                    <DollarSign size={14} className="text-slate-400" />
                    {selectedApp.salary || 'Not specified'}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 block uppercase">Recruiter Contact</span>
                  {selectedApp.contactEmail ? (
                    <a 
                      href={`mailto:${selectedApp.contactEmail}`}
                      className="font-medium flex items-center gap-1.5 mt-1 text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      <Mail size={14} />
                      {selectedApp.contactEmail}
                    </a>
                  ) : (
                    <span className="font-medium flex items-center gap-1.5 mt-1 text-slate-400 italic">
                      None
                    </span>
                  )}
                </div>
              </div>

              {selectedApp.status === 'Interview' && selectedApp.interviewDate && (
                <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/50 rounded-2xl p-4.5">
                  <span className="text-xs font-bold text-purple-750 dark:text-purple-400 uppercase tracking-wider block">Scheduled Interview</span>
                  <span className="text-sm font-semibold text-purple-900 dark:text-purple-300 flex items-center gap-2 mt-1.5">
                    <Calendar size={16} />
                    {selectedApp.interviewDate}
                  </span>
                </div>
              )}

              <div className="border-t border-slate-50 dark:border-slate-800 pt-4">
                <span className="text-xs font-semibold text-slate-400 block uppercase">Application Notes</span>
                <p className="mt-2 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 text-sm leading-relaxed whitespace-pre-line">
                  {selectedApp.notes || 'No notes added for this application.'}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
              <button
                onClick={() => navigate(`/applications/edit/${selectedApp.id}`)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-sm transition-colors"
              >
                Edit Details
              </button>
              
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternshipTable;
