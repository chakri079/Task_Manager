import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatsCard from '../components/StatsCard';
import TaskCard from '../components/TaskCard';
import { Loader, ErrorMessage } from '../components/UiComponents';
import { 
  ClipboardDocumentListIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  ChartPieIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, tasksRes] = await Promise.all([
        api.get('/tasks/stats'),
        api.get('/tasks', { params: { limit: 4, sortBy: 'createdAt', order: 'desc' } })
      ]);
      
      setStats(statsRes.data);
      setRecentTasks(tasksRes.data.tasks);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchDashboardData(); // Refresh data
    } catch (err) {
      alert('Failed to update task status');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchDashboardData(); // Refresh data
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Here's what's happening with your tasks today.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/tasks/new" className="btn-primary flex items-center shadow-md">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Task
          </Link>
        </div>
      </div>

      {error ? (
        <ErrorMessage message={error} />
      ) : (
        <>
          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <StatsCard 
              title="Total Tasks" 
              value={stats?.totalTasks || 0} 
              icon={{
                component: <ClipboardDocumentListIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
                bgColorClasses: "bg-blue-100 dark:bg-blue-900/30"
              }}
            />
            <StatsCard 
              title="Completed" 
              value={stats?.completedTasks || 0} 
              valueColorClass="text-green-600 dark:text-green-400"
              icon={{
                component: <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />,
                bgColorClasses: "bg-green-100 dark:bg-green-900/30"
              }}
            />
            <StatsCard 
              title="Pending" 
              value={stats?.pendingTasks || 0} 
              valueColorClass="text-orange-500 dark:text-orange-400"
              icon={{
                component: <ClockIcon className="w-6 h-6 text-orange-500 dark:text-orange-400" />,
                bgColorClasses: "bg-orange-100 dark:bg-orange-900/30"
              }}
            />
            <StatsCard 
              title="Completion Rate" 
              value={`${stats?.completionPercentage || 0}%`} 
              icon={{
                component: <ChartPieIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
                bgColorClasses: "bg-purple-100 dark:bg-purple-900/30"
              }}
            />
          </div>

          {/* Recent Tasks Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                <ClockIcon className="w-5 h-5 mr-2 text-primary-500" />
                Recently Added Tasks
              </h2>
              <Link to="/tasks" className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center transition-colors">
                View all <ArrowRightIcon className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            {recentTasks.length === 0 ? (
              <div className="card text-center py-12 border-dashed border-2 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No tasks</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new task.</p>
                <div className="mt-6">
                  <Link to="/tasks/new" className="btn-primary inline-flex items-center">
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Task
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                {recentTasks.map((task) => (
                  <TaskCard 
                    key={task._id} 
                    task={task} 
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
