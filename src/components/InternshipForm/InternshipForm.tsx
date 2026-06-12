import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { postNewApplication, editApplication } from '../../redux/internshipSlice';
import { useToast } from '../../context/ToastContext';
import { Spinner } from '../Loader/Loader';
import { 
  Building2, 
  Briefcase, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Mail, 
  FileText,
  Save,
  ArrowLeft
} from 'lucide-react';
import type { InternshipApplication, ApplicationStatus } from '../../types';

interface InternshipFormProps {
  editId?: string;
}

const InternshipForm: React.FC<InternshipFormProps> = ({ editId }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  
  const { applications, loading } = useAppSelector((state) => state.internships);

  const editingApp = editId ? applications.find(app => app.id === editId) : null;

  // Form State
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    location: '',
    appliedDate: new Date().toISOString().split('T')[0],
    status: 'Applied' as ApplicationStatus,
    notes: '',
    salary: '',
    contactEmail: '',
    interviewDate: '',
  });

  // Errors State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Load editing application data if present
  useEffect(() => {
    if (editingApp) {
      setFormData({
        companyName: editingApp.companyName,
        jobTitle: editingApp.jobTitle,
        location: editingApp.location,
        appliedDate: editingApp.appliedDate,
        status: editingApp.status,
        notes: editingApp.notes || '',
        salary: editingApp.salary || '',
        contactEmail: editingApp.contactEmail || '',
        interviewDate: editingApp.interviewDate || '',
      });
    }
  }, [editingApp]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.appliedDate) {
      newErrors.appliedDate = 'Applied date is required';
    }
    if (formData.status === 'Interview' && !formData.interviewDate) {
      newErrors.interviewDate = 'Interview date is required for Interview status';
    }

    if (formData.contactEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.contactEmail)) {
        newErrors.contactEmail = 'Please enter a valid email address';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      if (editId) {
        // Edit mode
        const updatedApp: InternshipApplication = {
          id: editId,
          ...formData,
        };
        dispatch(editApplication(updatedApp));
        showToast('Application updated successfully', 'success');
        navigate('/applications');
      } else {
        // Add mode - calls DummyJSON async post thunk
        const resultAction = await dispatch(postNewApplication(formData));
        if (postNewApplication.fulfilled.match(resultAction)) {
          showToast('Application created and uploaded successfully', 'success');
          navigate('/applications');
        } else {
          // thunk failed
          showToast(resultAction.payload as string || 'Failed to submit application', 'error');
        }
      }
    } catch (err) {
      showToast('An unexpected error occurred.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Back Link */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <button
          type="button"
          onClick={() => navigate('/applications')}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Applications
        </button>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {editId ? 'Edit Application' : 'New Internship Application'}
        </h2>
      </div>

      {/* Main Form Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Company Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Company Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Building2 size={16} />
            </span>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="e.g. Google"
              className={`block w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm transition-all
                ${errors.companyName 
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10' 
                  : 'border-slate-200 dark:border-slate-700 focus:border-primary-500'
                }`}
            />
          </div>
          {errors.companyName && (
            <span className="text-xs text-rose-500 font-semibold">{errors.companyName}</span>
          )}
        </div>

        {/* Job Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Job Title <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Briefcase size={16} />
            </span>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="e.g. Software Engineering Intern"
              className={`block w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm transition-all
                ${errors.jobTitle 
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10' 
                  : 'border-slate-200 dark:border-slate-700 focus:border-primary-500'
                }`}
            />
          </div>
          {errors.jobTitle && (
            <span className="text-xs text-rose-500 font-semibold">{errors.jobTitle}</span>
          )}
        </div>

        {/* Location */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Location <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <MapPin size={16} />
            </span>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Remote / New York, NY"
              className={`block w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm transition-all
                ${errors.location 
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10' 
                  : 'border-slate-200 dark:border-slate-700 focus:border-primary-500'
                }`}
            />
          </div>
          {errors.location && (
            <span className="text-xs text-rose-500 font-semibold">{errors.location}</span>
          )}
        </div>

        {/* Applied Date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Applied Date <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Calendar size={16} />
            </span>
            <input
              type="date"
              name="appliedDate"
              value={formData.appliedDate}
              onChange={handleChange}
              className={`block w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm transition-all
                ${errors.appliedDate 
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10' 
                  : 'border-slate-200 dark:border-slate-700 focus:border-primary-500'
                }`}
            />
          </div>
          {errors.appliedDate && (
            <span className="text-xs text-rose-500 font-semibold">{errors.appliedDate}</span>
          )}
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Application Status <span className="text-rose-500">*</span>
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="block w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
          >
            <option value="Applied">Applied</option>
            <option value="Screening">Screening</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Salary */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Compensation / Salary
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <DollarSign size={16} />
            </span>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g. $45/hr or $90,000/yr"
              className="block w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm transition-all"
            />
          </div>
        </div>

        {/* Contact Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Recruiter Email Contact
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Mail size={16} />
            </span>
            <input
              type="text"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              placeholder="recruiter@company.com"
              className={`block w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm transition-all
                ${errors.contactEmail 
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10' 
                  : 'border-slate-200 dark:border-slate-700 focus:border-primary-500'
                }`}
            />
          </div>
          {errors.contactEmail && (
            <span className="text-xs text-rose-500 font-semibold">{errors.contactEmail}</span>
          )}
        </div>

        {/* Interview Date (Conditional) */}
        {formData.status === 'Interview' && (
          <div className="flex flex-col gap-1.5 animate-slide-in">
            <label className="text-xs font-bold text-purple-650 dark:text-purple-400 uppercase tracking-wide">
              Interview Date & Time <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-purple-500">
                <Calendar size={16} />
              </span>
              <input
                type="datetime-local"
                name="interviewDate"
                value={formData.interviewDate}
                onChange={handleChange}
                className={`block w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm transition-all
                  ${errors.interviewDate 
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10' 
                    : 'border-slate-200 dark:border-slate-700 focus:border-purple-500'
                  }`}
              />
            </div>
            {errors.interviewDate && (
              <span className="text-xs text-rose-500 font-semibold">{errors.interviewDate}</span>
            )}
          </div>
        )}
      </div>

      {/* Notes (Textarea) */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          Application Notes
        </label>
        <div className="relative">
          <span className="absolute top-3 left-3 text-slate-400">
            <FileText size={16} />
          </span>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add details about interview questions, follow-up dates, coding assessments, referrals, etc."
            rows={4}
            className="block w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm transition-all"
          />
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={() => navigate('/applications')}
          className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold rounded-xl text-sm transition-colors"
        >
          Cancel
        </button>
        
        <button
          type="submit"
          disabled={submitting || loading}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-75 disabled:cursor-not-allowed shadow-xs"
        >
          {submitting || loading ? (
            <Spinner size="sm" color="border-white" />
          ) : (
            <Save size={16} />
          )}
          {editId ? 'Save Changes' : 'Track Application'}
        </button>
      </div>
    </form>
  );
};

export default InternshipForm;
