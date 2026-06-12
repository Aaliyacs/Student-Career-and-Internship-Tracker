import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks';
import { logout } from '../../redux/authSlice';
import { useToast } from '../../context/ToastContext';
import { 
  LayoutDashboard, 
  Briefcase, 
  BookOpen, 
  User, 
  LogOut
} from 'lucide-react';


interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogout = () => {
    dispatch(logout());
    showToast('Logged out successfully', 'info');
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Applications', path: '/applications', icon: Briefcase },
    { label: 'Learning Goals', path: '/learning', icon: BookOpen },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <aside
      className={`fixed top-16 bottom-0 left-0 z-35 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="flex flex-col h-full justify-between py-6 px-4">
        {/* Navigation links */}
        <div className="space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={() => setIsOpen(false)} // Close mobile drawer on link click
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 group
                ${isActive 
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/45 dark:text-primary-400 font-semibold shadow-xs shadow-primary-500/5' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                }
              `}
            >
              {({ isActive }) => {
                const Icon = item.icon;
                return (
                  <>
                    <Icon 
                      size={20} 
                      className={`transition-colors 
                        ${isActive 
                          ? 'text-primary-600 dark:text-primary-400' 
                          : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400'
                        }`} 
                    />
                    <span>{item.label}</span>
                  </>
                );
              }}
            </NavLink>
          ))}
        </div>

        {/* Footer actions inside Sidebar */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all duration-150"
          >
            <LogOut size={20} className="text-rose-500 dark:text-rose-400" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
