import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { loginUser, clearError } from '../../redux/authSlice';
import { useToast } from '../../context/ToastContext';
import { Spinner } from '../../components/Loader/Loader';
import { Mail, Lock, LogIn, AlertCircle, GraduationCap } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  
  const { loading, error } = useAppSelector((state) => state.auth);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!email) {
      newErrors.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    dispatch(clearError());
    
    const resultAction = await dispatch(loginUser({ email, password, rememberMe }));
    
    if (loginUser.fulfilled.match(resultAction)) {
      showToast('Logged in successfully', 'success');
      navigate('/');
    } else {
      const errorMsg = resultAction.payload as string || 'Login failed';
      showToast(errorMsg, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-md w-full space-y-8">
        
        {/* Header Logo */}
        <div className="flex flex-col items-center">
          <div className="p-3 bg-primary-600 rounded-2xl text-white shadow-xl shadow-primary-500/20 mb-3.5">
            <GraduationCap size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            SCT Tracker
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Student Career & Internship Tracker
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl transition-colors">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            Log in to your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* API Error Box */}
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-400 rounded-xl text-xs leading-relaxed">
                <AlertCircle size={16} className="shrink-0 text-rose-500" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Mail size={16} />
                </span>
                <input
                  type="text"
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  className={`block w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm transition-all
                    ${errors.email 
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10' 
                      : 'border-slate-200 dark:border-slate-700 focus:border-primary-500'
                    }`}
                />
              </div>
              {errors.email && (
                <span className="text-xs text-rose-500 font-semibold">{errors.email}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                  }}
                  className={`block w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm transition-all
                    ${errors.password 
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10' 
                      : 'border-slate-200 dark:border-slate-700 focus:border-primary-500'
                    }`}
                />
              </div>
              {errors.password && (
                <span className="text-xs text-rose-500 font-semibold">{errors.password}</span>
              )}
            </div>

            {/* Remember Me Box */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4.5 w-4.5 text-primary-600 focus:ring-primary-500 border-slate-300 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                  Remember me
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-primary-500/10 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Spinner size="sm" color="border-white" />
              ) : (
                <LogIn size={18} />
              )}
              <span>Log In</span>
            </button>
          </form>

          {/* Quick Login Hint */}
          <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-5">
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              Demo Credentials:<br />
              Email: <span className="font-semibold text-slate-700 dark:text-slate-300">student@example.com</span> / Password: <span className="font-semibold text-slate-700 dark:text-slate-300">password123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
