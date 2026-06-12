import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { logout } from '../../redux/authSlice';
import { useToast } from '../../context/ToastContext';
import { 
  Sun, 
  Moon, 
  LogOut, 
  Menu, 
  X, 
  User as UserIcon, 
  GraduationCap
} from 'lucide-react';


interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { user } = useAppSelector((state) => state.auth);
  
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('sct_theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sct_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sct_theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = () => {
    dispatch(logout());
    showToast('Logged out successfully', 'info');
    navigate('/login');
  };



  return (
    <nav className="sticky top-0 z-40 w-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand / Sidebar Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 lg:hidden focus:outline-none"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 bg-primary-600 rounded-xl text-white shadow-md shadow-primary-500/20">
                <GraduationCap size={22} className="animate-pulse" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent hidden sm:block">
                SCT Tracker
              </span>
            </Link>
          </div>

          {/* Right: Quick actions, Theme Toggle, User Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors focus:outline-none"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun size={20} className="text-amber-500" /> : <Moon size={20} className="text-primary-600" />}
            </button>

            {/* Profile Dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
                >
                  <img
                    src={user.avatarUrl || 'https://api.dicebear.com/7.x/adventurer/svg?seed=student'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 dark:border-slate-700"
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden md:block max-w-[120px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                {dropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setDropdownOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-20 animate-scale-up">
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      </div>
                      
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <UserIcon size={16} />
                        My Profile
                      </Link>
                      
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          handleLogout();
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                      >
                        <LogOut size={16} />
                        Log Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar overlay for consistency (shown when sidebarOpen is true) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-slate-900/40 dark:bg-slate-950/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
