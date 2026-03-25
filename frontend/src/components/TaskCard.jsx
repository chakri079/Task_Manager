import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarIcon, ClockIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

const TaskCard = ({ task, onDelete, onStatusChange }) => {
  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'High': return 'badge-high';
      case 'Medium': return 'badge-medium';
      case 'Low': return 'badge-low';
      default: return 'badge-todo';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Done': return 'badge-done';
      case 'In Progress': return 'badge-inprogress';
      case 'Todo': return 'badge-todo';
      default: return 'badge-todo';
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done';

  return (
    <div className={`card hover:shadow-lg transition-shadow duration-300 group flex flex-col h-full border-t-4 ${
      task.priority === 'High' ? 'border-t-red-500' : 
      task.priority === 'Medium' ? 'border-t-orange-400' : 'border-t-blue-400'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate pr-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {task.title}
        </h3>
        <span className={getPriorityBadgeClass(task.priority)}>
          {task.priority}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-grow">
        {task.description || <span className="italic text-gray-400 dark:text-gray-500">No description provided</span>}
      </p>
      
      <div className="mt-auto space-y-3">
        <div className="flex flex-wrap gap-2 text-xs font-medium">
          <span className={getStatusBadgeClass(task.status)}>
            {task.status}
          </span>
          {task.dueDate && (
            <span className={`flex items-center px-2 py-0.5 rounded-md ${
              isOverdue 
                ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' 
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              <CalendarIcon className="w-3 h-3 mr-1" />
              {isOverdue && <span className="mr-1 font-bold">!</span>}
              {format(new Date(task.dueDate), 'MMM dd, yyyy')}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <ClockIcon className="w-3 h-3 mr-1" />
            {format(new Date(task.createdAt), 'MMM dd')}
          </div>
          
          <div className="flex gap-2">
            {task.status !== 'Done' && (
              <button
                onClick={() => onStatusChange(task._id, 'Done')}
                className="text-xs text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40 px-2 py-1 rounded transition-colors font-medium"
                title="Mark as Done"
              >
                Complete
              </button>
            )}
            
            <Link
              to={`/tasks/edit/${task._id}`}
              className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              title="Edit Task"
            >
              <PencilSquareIcon className="w-4 h-4" />
            </Link>
            
            <button
              onClick={() => {
                if(window.confirm('Are you sure you want to delete this task?')) {
                  onDelete(task._id);
                }
              }}
              className="text-gray-500 hover:text-red-600 dark:hover:text-red-400 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              title="Delete Task"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
