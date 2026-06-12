import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { postNewApplication } from '../../redux/internshipSlice';
import DashboardCards from '../../components/DashboardCards/DashboardCards';
import { useToast } from '../../context/ToastContext';
import { 
  StatusPieChart, 
  MonthlyBarChart, 
  GrowthLineChart 
} from '../../components/Charts/Charts';
import { apiService } from '../../services/api';
import type { JobRecommendation } from '../../services/api';
import { 
  BookOpen, 
  Briefcase, 
  AlertTriangle,
  RefreshCw,
  Plus,
  ArrowRight
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  
  const { user } = useAppSelector((state) => state.auth);
  const { goals } = useAppSelector((state) => state.learning);


  // Job recommendations state
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobsError, setJobsError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    setLoadingJobs(true);
    setJobsError(null);
    try {
      // Simulate real delay to demonstrate skeletons/spinners
      await new Promise(resolve => setTimeout(resolve, 600));
      const jobs = await apiService.getJobRecommendations();
      setRecommendations(jobs.slice(0, 3)); // show top 3
    } catch (err: any) {
      setJobsError(err.message || 'Failed to fetch job recommendations.');
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  // Learning progress statistics
  const totalCourses = goals.length;
  const completedCourses = goals.filter(g => g.progressPercentage === 100).length;
  const averageProgress = totalCourses > 0 
    ? Math.round(goals.reduce((sum, g) => sum + g.progressPercentage, 0) / totalCourses) 
    : 0;

  // Handler to simulate "quick add" application from recommendations
  const handleQuickAdd = async (job: JobRecommendation) => {
    const applicationData = {
      companyName: job.companyName,
      jobTitle: job.jobTitle,
      location: job.location,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Applied' as const,
      notes: `Quick-added from dashboard recommendations. Description: ${job.description.slice(0, 100)}...`,
    };

    try {
      showToast(`Submitting application to ${job.companyName} via API...`, 'info');
      const resultAction = await dispatch(postNewApplication(applicationData));
      
      if (postNewApplication.fulfilled.match(resultAction)) {
        showToast(`Successfully added ${job.jobTitle} at ${job.companyName}!`, 'success');
      } else {
        showToast(resultAction.payload as string || 'Failed to submit application', 'error');
      }
    } catch {
      showToast('Error quick-adding application', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, {user?.name.split(' ')[0] || 'Student'}! 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Here is your career search and internship applications overview.
          </p>
        </div>
        
        <button
          onClick={() => navigate('/applications/add')}
          className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-sm transition-all hover:-translate-y-0.5 shadow-md shadow-primary-500/10"
        >
          <Plus size={16} />
          Add Application
        </button>
      </div>

      {/* Stats Cards Row */}
      <DashboardCards />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Applications by Status</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Visual breakdown of your active trackers</p>
          </div>
          <div className="mt-4 flex-1 flex items-center justify-center">
            <StatusPieChart />
          </div>
        </div>

        {/* Bar Chart Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Monthly Submissions</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Number of internship applications filed per month</p>
          </div>
          <div className="mt-4 flex-1">
            <MonthlyBarChart />
          </div>
        </div>
      </div>

      {/* Row 3: Growth Line Chart & Learning Progress & Recommended Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart (2/3 width on desktop) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Application Trend</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Cumulative growth profile of your job applications</p>
          </div>
          <div className="mt-4 flex-1">
            <GrowthLineChart />
          </div>
        </div>

        {/* Learning Goals Summary */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen size={18} className="text-secondary-500" />
              Learning Progress
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Self-paced learning goal statistics</p>
          </div>

          <div className="space-y-5 my-6 flex-1 flex flex-col justify-center">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 border border-slate-100 dark:border-slate-800 rounded-2xl">
                <span className="text-xs font-semibold text-slate-400 block">COURSES</span>
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">{totalCourses}</span>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 border border-slate-100 dark:border-slate-800 rounded-2xl">
                <span className="text-xs font-semibold text-slate-400 block">COMPLETED</span>
                <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">{completedCourses}</span>
              </div>
            </div>

            {/* Progress Bar Widget */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400">
                <span>Avg Progress</span>
                <span className="text-slate-700 dark:text-slate-300">{averageProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-3.5 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                <div 
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${averageProgress}%` }}
                ></div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/learning')}
            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold rounded-xl text-sm transition-colors"
          >
            Manage Goals
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Row 4: Recommended Internships Feed (API Integration Verification) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase size={18} className="text-primary-500" />
              Recommended Internships
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Fetched in real-time from dummyjson.com API posts
            </p>
          </div>

          {jobsError && (
            <button
              onClick={fetchRecommendations}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-xs transition-colors"
            >
              <RefreshCw size={12} />
              Retry
            </button>
          )}
        </div>

        {/* API Loading Feed */}
        {loadingJobs ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="flex justify-between items-center py-4 border-b border-slate-100 dark:border-slate-800 animate-pulse">
                <div className="space-y-2 w-2/3">
                  <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-sm w-1/3"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-sm w-1/2"></div>
                </div>
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-20"></div>
              </div>
            ))}
          </div>
        ) : jobsError ? (
          /* API Failure View */
          <div className="flex flex-col items-center justify-center py-8 text-center bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/50 rounded-2xl p-6">
            <AlertTriangle className="text-rose-500 mb-2" size={30} />
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Failed to retrieve postings</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-4">
              {jobsError}
            </p>
            <button
              onClick={fetchRecommendations}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs"
            >
              <RefreshCw size={13} />
              Retry Connection
            </button>
          </div>
        ) : (
          /* API Success View */
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recommendations.map((job) => (
              <div 
                key={job.id} 
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4.5 gap-4 group"
              >
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-base hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      {job.jobTitle}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
                      {job.location}
                    </span>
                  </div>
                  
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    {job.companyName}
                  </p>
                  
                  <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-1">
                    {job.description}
                  </p>
                </div>

                <button
                  onClick={() => handleQuickAdd(job)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-xs transition-all opacity-90 hover:opacity-100 shadow-xs"
                >
                  <Plus size={14} />
                  Quick Track
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
