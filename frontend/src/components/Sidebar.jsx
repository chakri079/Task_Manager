import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AboutModal from './AboutModal';
import { 
  HomeIcon, 
  ListBulletIcon, 
  ChartBarIcon, 
  PlusCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ open, setOpen }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  if (!user) return null;

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'My Tasks', href: '/tasks', icon: ListBulletIcon },
    { name: 'Create Task', href: '/tasks/new', icon: PlusCircleIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/80 backdrop-blur-sm lg:hidden transition-opacity" 
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar component */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center justify-between px-4 lg:hidden mb-5">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-blue-400">
              TaskFlow
            </span>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md p-2"
              onClick={() => setOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-5 flex-grow px-3">
            <nav className="space-y-1.5">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || (location.pathname.startsWith('/tasks/edit') && item.href === '/tasks/new');
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className={`
                      group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 shadow-sm' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'}
                    `}
                  >
                    <item.icon
                      className={`
                        mr-3 flex-shrink-0 h-5 w-5 transition-colors
                        ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'}
                      `}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="px-4 mt-auto pt-5">
            <div className="bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 shadow-sm border border-primary-100 dark:border-gray-600">
              <h4 className="text-sm font-semibold text-primary-900 dark:text-white mb-1">Need help?</h4>
              <p className="text-xs text-primary-700 dark:text-gray-300 mb-3">Check out our documentation for tips.</p>
              <button 
                onClick={() => setIsAboutOpen(true)}
                className="w-full text-xs font-medium bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 py-1.5 px-3 rounded-lg border border-primary-200 dark:border-gray-500 shadow-sm hover:shadow transition-shadow"
              >
                View Docs
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </>
  );
};

export default Sidebar;
