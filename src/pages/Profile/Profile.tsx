import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { updateProfile } from '../../redux/authSlice';
import { useToast } from '../../context/ToastContext';
import { 
  User as UserIcon, 
  Mail, 
  MapPin, 
  Briefcase, 
  Tag, 
  Plus, 
  X, 
  Save, 
  FileText,
  Building2,
  GraduationCap
} from 'lucide-react';

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { user } = useAppSelector((state) => state.auth);

  // Form State
  const [name, setName] = useState(user?.name || '');
  const email = user?.email || '';

  const [locationPreference, setLocationPreference] = useState(
    user?.preferences?.locationPreference || 'remote'
  );
  const [jobTypePreference, setJobTypePreference] = useState(
    user?.preferences?.jobTypePreference || 'internship'
  );
  
  // Tag fields
  const [industries, setIndustries] = useState<string[]>(user?.targetIndustries || []);
  const [newIndustry, setNewIndustry] = useState('');

  const handleAddIndustry = (e: React.FormEvent) => {
    e.preventDefault();
    const tag = newIndustry.trim();
    if (tag && !industries.includes(tag)) {
      setIndustries([...industries, tag]);
      setNewIndustry('');
    }
  };

  const handleRemoveIndustry = (tag: string) => {
    setIndustries(industries.filter(i => i !== tag));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }

    dispatch(updateProfile({
      name: name.trim(),
      targetIndustries: industries,
      preferences: {
        locationPreference,
        jobTypePreference
      }
    }));

    showToast('Profile updated successfully', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header section */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <UserIcon className="text-primary-600 dark:text-primary-400" size={28} />
          Profile Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Customize your career objective, target domains, and workspace preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Avatar & Summary (1/3 width) */}
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-center shadow-xs transition-colors">
            <div className="relative inline-block mb-4">
              <img
                src={user?.avatarUrl || 'https://api.dicebear.com/7.x/adventurer/svg?seed=student'}
                alt="Student Avatar"
                className="w-24 h-24 rounded-full mx-auto bg-slate-50 border-2 border-primary-500 p-1 shadow-sm"
              />
              <div className="absolute bottom-0 right-0 p-1.5 bg-primary-600 rounded-full text-white shadow-xs">
                <GraduationCap size={14} />
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{user?.name}</h3>
            <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 mt-0.5">Undergraduate Student</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 flex items-center justify-center gap-1">
              <Mail size={12} />
              {user?.email}
            </p>

            <div className="border-t border-slate-100 dark:border-slate-800 mt-5 pt-5 text-left space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Target Profile</span>
              <div className="flex flex-wrap gap-1.5">
                {industries.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">No target industries set</span>
                ) : (
                  industries.map((tag) => (
                    <span 
                      key={tag} 
                      className="text-xs font-semibold px-2.5 py-1 bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400 rounded-lg border border-primary-100 dark:border-primary-900"
                    >
                      {tag}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Resume Upload Placeholder */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs transition-colors">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <FileText size={16} className="text-slate-400" />
              Resume Attachment
            </h4>
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-600 rounded-2xl p-5 text-center cursor-pointer transition-colors group">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-primary-500 rounded-full inline-block mb-3 border border-slate-100 dark:border-slate-800 transition-colors">
                <FileText size={20} />
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Upload new resume</p>
              <p className="text-[10px] text-slate-400 mt-1">PDF, DOCX up to 5MB</p>
            </div>
          </div>
        </div>

        {/* Right Column: Editable Settings (2/3 width) */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs transition-colors">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6">Profile details</h3>
            
            <form onSubmit={handleSave} className="space-y-6">
              {/* Name (Input) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <UserIcon size={16} />
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm transition-all"
                  />
                </div>
              </div>

              {/* Email (Disabled/Read-only) */}
              <div className="flex flex-col gap-1.5 opacity-70">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Email Address (Not editable)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Mail size={16} />
                  </span>
                  <input
                    type="text"
                    disabled
                    value={email}
                    className="block w-full pl-9 pr-3 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Preferences Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-slate-100 dark:border-slate-800 pt-5">
                {/* Location Preference */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1">
                    <MapPin size={12} /> Work Location Preference
                  </label>
                  <select
                    value={locationPreference}
                    onChange={(e) => setLocationPreference(e.target.value as any)}
                    className="block w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
                  >
                    <option value="remote">Remote Only</option>
                    <option value="on-site">On-Site Only</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="any">Flexible / Any</option>
                  </select>
                </div>

                {/* Job Type Preference */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1">
                    <Briefcase size={12} /> Target Employment Type
                  </label>
                  <select
                    value={jobTypePreference}
                    onChange={(e) => setJobTypePreference(e.target.value as any)}
                    className="block w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
                  >
                    <option value="internship">Internship</option>
                    <option value="co-op">Co-Op</option>
                    <option value="full-time">Full-Time Entry Level</option>
                    <option value="any">Flexible / Any</option>
                  </select>
                </div>
              </div>

              {/* Target Industries Editor */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-3">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1">
                  <Building2 size={12} /> Target Industries & Fields
                </label>
                
                {/* Form to Add Industry Tag */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <Tag size={14} />
                    </span>
                    <input
                      type="text"
                      placeholder="Add industry (e.g. Cybersecurity, AI)"
                      value={newIndustry}
                      onChange={(e) => setNewIndustry(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddIndustry}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Plus size={14} />
                    Add Tag
                  </button>
                </div>

                {/* Render Editable Tags list */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {industries.map((tag) => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 group"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveIndustry(tag)}
                        className="text-slate-400 hover:text-rose-500 transition-colors"
                        title={`Remove ${tag}`}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end pt-5 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-sm transition-all hover:-translate-y-0.5 shadow-md shadow-primary-500/10"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
