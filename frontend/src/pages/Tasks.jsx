import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import TaskCard from '../components/TaskCard';
import { Loader, ErrorMessage } from '../components/UiComponents';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ArrowsUpDownIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  // URL Search params for filtering/sorting
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [priorityFilter, setPriorityFilter] = useState(searchParams.get('priority') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');
  const [order, setOrder] = useState(searchParams.get('order') || 'desc');
  
  // Toggle filter panel on mobile
  const [showFilters, setShowFilters] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      
      const params = {
        page,
        limit: 8,
        sortBy,
        order
      };
      
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      
      const { data } = await api.get('/tasks', { params });
      
      setTasks(data.tasks);
      setTotalPages(data.pages);
      setTotalItems(data.total);
      
      // Update URL params implicitly
      const newParams = new URLSearchParams();
      if (search) newParams.set('search', search);
      if (statusFilter) newParams.set('status', statusFilter);
      if (priorityFilter) newParams.set('priority', priorityFilter);
      newParams.set('sortBy', sortBy);
      newParams.set('order', order);
      newParams.set('page', page);
      setSearchParams(newParams, { replace: true });
      
    } catch (err) {
      setError('Failed to fetch tasks.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortBy, order, statusFilter, priorityFilter]); 
  
  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1); // Reset to page 1 on new search
      fetchTasks();
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      alert('Failed to update task status');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setPriorityFilter('');
    setSortBy('createdAt');
    setOrder('desc');
    setPage(1);
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Tasks</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Manage, filter, and track your tasks.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden btn-secondary flex items-center shadow-sm"
          >
            <FunnelIcon className="w-5 h-5 mr-1" />
            Filters
          </button>
          <Link to="/tasks/new" className="btn-primary flex items-center shadow-md">
            <PlusIcon className="w-5 h-5 mr-1 border-2 border-current rounded-full p-0.5" />
            New Task
          </Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="card sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <FunnelIcon className="w-5 h-5 mr-2" />
                Filters
              </h2>
              {(search || statusFilter || priorityFilter || sortBy !== 'createdAt' || order !== 'desc') && (
                <button 
                  onClick={clearFilters}
                  className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="space-y-5">
              {/* Search */}
              <div>
                <label className="label text-xs uppercase tracking-wider text-gray-500">Search</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input pl-9 py-1.5 text-sm"
                    placeholder="Search tasks..."
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="label text-xs uppercase tracking-wider text-gray-500">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                  className="input py-1.5 text-sm"
                >
                  <option value="">All Statuses</option>
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="label text-xs uppercase tracking-wider text-gray-500">Priority</label>
                <select
                  value={priorityFilter}
                  onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
                  className="input py-1.5 text-sm"
                >
                  <option value="">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <hr className="border-gray-100 dark:border-gray-700" />

              {/* Sort By */}
              <div>
                <label className="label text-xs uppercase tracking-wider text-gray-500 flex items-center">
                  <ArrowsUpDownIcon className="w-4 h-4 mr-1" />
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input py-1.5 text-sm"
                >
                  <option value="createdAt">Date Created</option>
                  <option value="dueDate">Due Date</option>
                  <option value="priority">Priority</option>
                </select>
              </div>

              {/* Order */}
              <div>
                <label className="label text-xs uppercase tracking-wider text-gray-500">Order</label>
                <select
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  className="input py-1.5 text-sm"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="flex-1">
          {error && <ErrorMessage message={error} />}
          
          {loading ? (
            <div className="card h-64 flex items-center justify-center">
              <Loader />
            </div>
          ) : tasks.length === 0 ? (
            <div className="card text-center py-16 border-dashed border-2 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No tasks found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {search || statusFilter || priorityFilter ? 'Try adjusting your filters or search term.' : 'Get started by creating a new task.'}
              </p>
              {!(search || statusFilter || priorityFilter) && (
                <div className="mt-6">
                  <Link to="/tasks/new" className="btn-primary inline-flex items-center">
                    <PlusIcon className="w-5 h-5 mr-1" />
                    New Task
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                Showing {tasks.length} of {totalItems} tasks
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {tasks.map((task) => (
                  <TaskCard 
                    key={task._id} 
                    task={task} 
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 sm:px-6 rounded-xl shadow-sm">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Showing page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          disabled={page === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                        >
                          <span className="sr-only">Previous</span>
                          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                        
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => setPage(i + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === i + 1
                                ? 'z-10 bg-primary-50 dark:bg-primary-900/50 border-primary-500 text-primary-600 dark:text-primary-400'
                                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                          disabled={page === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                        >
                          <span className="sr-only">Next</span>
                          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </nav>
                    </div>
                  </div>
                  
                  {/* Mobile pagination */}
                  <div className="flex items-center justify-between w-full sm:hidden">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="btn-secondary"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-700 dark:text-gray-300 px-4">
                      {page} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="btn-secondary"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
