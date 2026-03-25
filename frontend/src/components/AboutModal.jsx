import { Fragment } from 'react';
import { XMarkIcon, InformationCircleIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-gray-100 dark:border-gray-700">
          
          <div className="bg-gradient-to-r from-primary-600 to-blue-500 px-6 py-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center">
              <InformationCircleIcon className="w-6 h-6 mr-2" />
              About TaskFlow
            </h3>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white focus:outline-none transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="px-6 py-6 space-y-5">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                TaskFlow is a modern, full-stack Task Management application designed to help you organize your daily objectives efficiently. It utilizes a MERN architecture (MongoDB, Express, React, Node.js) with JWT authentication.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                <CheckBadgeIcon className="w-5 h-5 text-primary-500 mr-2" />
                Key Features
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300 ml-7 list-disc">
                <li><strong className="text-gray-900 dark:text-gray-200">Task Management:</strong> Create, Read, Update, and Delete tasks with custom priorities and statuses.</li>
                <li><strong className="text-gray-900 dark:text-gray-200">Smart View:</strong> Quickly filter tasks by status (Todo, In Progress, Done) or search by keywords.</li>
                <li><strong className="text-gray-900 dark:text-gray-200">Analytics Dashboard:</strong> Get visual insights with dynamic Recharts for task priority and completion percentages.</li>
                <li><strong className="text-gray-900 dark:text-gray-200">Dark Mode:</strong> Seamlessly toggle between light and dark themes matching your system preferences.</li>
              </ul>
            </div>

            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4 mt-2">
              <h4 className="text-sm font-semibold text-primary-800 dark:text-primary-300 mb-1">Getting Started</h4>
              <p className="text-xs text-primary-900/80 dark:text-primary-100/70">
                To start, click on the "New Task" button or navigate to the "Create Task" page in the sidebar. You can manage your existing tasks from the "My Tasks" page. Stay productive!
              </p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
            <button
              type="button"
              className="btn-primary w-full sm:w-auto"
              onClick={onClose}
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
