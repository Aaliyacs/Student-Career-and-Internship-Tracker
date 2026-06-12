import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { addGoal, updateGoal, deleteGoal } from '../../redux/learningSlice';
import { useToast } from '../../context/ToastContext';
import ConfirmationModal from '../../components/Modal/ConfirmationModal';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Sparkles,
  Sliders,
  GraduationCap
} from 'lucide-react';
import type { LearningGoal } from '../../types';


const LearningProgress: React.FC = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { goals } = useAppSelector((state) => state.learning);

  // Add Goal Form State
  const [courseName, setCourseName] = useState('');
  const [platform, setPlatform] = useState('');
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Inline edit state
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [editProgress, setEditProgress] = useState(0);

  // Delete modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Compute metrics
  const total = goals.length;
  const completed = goals.filter(g => g.progressPercentage === 100).length;
  const inProgress = total - completed;

  // Validate and submit new goal
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!courseName.trim()) newErrors.courseName = 'Course name is required';
    if (!platform.trim()) newErrors.platform = 'Platform name is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    dispatch(addGoal({
      courseName: courseName.trim(),
      platform: platform.trim(),
      progressPercentage,
      completionDate: progressPercentage === 100 ? new Date().toISOString().split('T')[0] : undefined
    }));

    showToast('Learning goal added successfully', 'success');
    setCourseName('');
    setPlatform('');
    setProgressPercentage(0);
    setErrors({});
  };

  // Open progress editor
  const startEditingProgress = (goal: LearningGoal) => {
    setEditingGoalId(goal.id);
    setEditProgress(goal.progressPercentage);
  };

  // Save progress updates
  const handleSaveProgress = (goal: LearningGoal) => {
    const updatedGoal: LearningGoal = {
      ...goal,
      progressPercentage: editProgress,
      completionDate: editProgress === 100 ? new Date().toISOString().split('T')[0] : undefined
    };
    dispatch(updateGoal(updatedGoal));
    showToast(`Updated progress for "${goal.courseName}" to ${editProgress}%`, 'success');
    setEditingGoalId(null);
  };

  // Handle delete
  const handleDeleteConfirm = () => {
    if (deleteId) {
      dispatch(deleteGoal(deleteId));
      showToast('Learning goal deleted successfully', 'success');
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <BookOpen className="text-secondary-600" size={28} />
          Learning Goals
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Stay competitive! Track technical tutorials, bootcamps, and certifications to polish your internship portfolio.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex items-center gap-4 transition-colors">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-900">
            <BookOpen size={20} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase">Total Courses</span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{total}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex items-center gap-4 transition-colors">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-100 dark:border-emerald-900">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase">Completed</span>
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{completed}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex items-center gap-4 transition-colors">
          <div className="p-3 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-xl border border-purple-100 dark:border-purple-900">
            <Sparkles size={20} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase">In Progress</span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{inProgress}</span>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Goals List (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Learning Sprints</h3>
          
          {goals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-center shadow-xs transition-colors">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-2xl mb-4 border border-slate-100 dark:border-slate-700">
                <GraduationCap size={36} />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">No learning goals tracked yet</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-4">
                Use the form on the right to add your current study materials, online courses, or projects.
              </p>
            </div>
          ) : (
            <div className="space-y-4.5">
              {goals.map((goal) => (
                <div 
                  key={goal.id} 
                  className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-xs transition-all duration-200 flex flex-col gap-4
                    ${goal.progressPercentage === 100 
                      ? 'border-emerald-100 dark:border-emerald-900 bg-emerald-50/10 dark:bg-emerald-950/5' 
                      : 'border-slate-200 dark:border-slate-800 hover:shadow-md'
                    }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md">
                        {goal.platform}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                        {goal.courseName}
                      </h4>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditingProgress(goal)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Update Progress"
                      >
                        <Sliders size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteId(goal.id)}
                        className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors"
                        title="Delete Goal"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Progress bar or Slider selector */}
                  {editingGoalId === goal.id ? (
                    /* Inline Progress Editor */
                    <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-4 animate-slide-in">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400">
                        <span>SLIDE TO CHANGE PROGRESS:</span>
                        <span className="text-primary-600 dark:text-primary-400">{editProgress}%</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={editProgress}
                          onChange={(e) => setEditProgress(Number(e.target.value))}
                          className="flex-1 accent-primary-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                        />
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 w-8 text-right">
                          {editProgress}%
                        </span>
                      </div>
                      
                      <div className="flex justify-end gap-2 text-xs font-semibold">
                        <button
                          onClick={() => setEditingGoalId(null)}
                          className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveProgress(goal)}
                          className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Standard Progress Bar display */
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-400">Progress</span>
                        <span className={`font-bold ${goal.progressPercentage === 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'}`}>
                          {goal.progressPercentage}% 
                          {goal.progressPercentage === 100 && ' (Completed)'}
                        </span>
                      </div>
                      
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                        <div 
                          className={`h-full rounded-full transition-all duration-300
                            ${goal.progressPercentage === 100 
                              ? 'bg-emerald-500' 
                              : 'bg-gradient-to-r from-primary-500 to-secondary-500'
                            }`}
                          style={{ width: `${goal.progressPercentage}%` }}
                        ></div>
                      </div>

                      {goal.completionDate && (
                        <span className="text-[10px] font-semibold text-slate-400 block mt-1">
                          Completed on: {goal.completionDate}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Add Goal Card (1/3 width) */}
        <div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs sticky top-24 transition-colors">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Plus size={18} className="text-primary-600" />
              Add Course/Goal
            </h3>
            
            <form onSubmit={handleAddGoal} className="space-y-4.5">
              {/* Course Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Course / Goal Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Master React 19"
                  value={courseName}
                  onChange={(e) => {
                    setCourseName(e.target.value);
                    if (errors.courseName) setErrors((prev) => ({ ...prev, courseName: '' }));
                  }}
                  className={`block w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm transition-all
                    ${errors.courseName 
                      ? 'border-rose-400 focus:border-rose-500' 
                      : 'border-slate-200 dark:border-slate-700 focus:border-primary-500'
                    }`}
                />
                {errors.courseName && (
                  <span className="text-xs text-rose-500 font-semibold">{errors.courseName}</span>
                )}
              </div>

              {/* Platform */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Platform / Provider
                </label>
                <input
                  type="text"
                  placeholder="e.g. Udemy, Coursera, YouTube"
                  value={platform}
                  onChange={(e) => {
                    setPlatform(e.target.value);
                    if (errors.platform) setErrors((prev) => ({ ...prev, platform: '' }));
                  }}
                  className={`block w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm transition-all
                    ${errors.platform 
                      ? 'border-rose-400 focus:border-rose-500' 
                      : 'border-slate-200 dark:border-slate-700 focus:border-primary-500'
                    }`}
                />
                {errors.platform && (
                  <span className="text-xs text-rose-500 font-semibold">{errors.platform}</span>
                )}
              </div>

              {/* Slider for Initial Progress */}
              <div className="flex flex-col gap-1.5 pt-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  <span>Current Progress</span>
                  <span className="text-primary-600 dark:text-primary-400 font-bold">{progressPercentage}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progressPercentage}
                    onChange={(e) => setProgressPercentage(Number(e.target.value))}
                    className="flex-1 accent-primary-600 h-2 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 text-white font-semibold rounded-xl text-sm transition-all hover:-translate-y-0.5 shadow-md shadow-primary-500/10"
              >
                <Plus size={16} />
                Add Learning Goal
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteId !== null}
        title="Delete Learning Goal"
        message="Are you sure you want to remove this course goal? This will permanently delete your progress history for this item."
        confirmText="Remove Goal"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default LearningProgress;
