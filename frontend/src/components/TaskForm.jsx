import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import api from '../services/api';
import { Loader, ErrorMessage } from './UiComponents';

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAddMode = !id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Todo',
    priority: 'Medium',
    dueDate: '',
  });

  const [loading, setLoading] = useState(false);
  const [fetchingTask, setFetchingTask] = useState(!isAddMode);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAddMode) {
      const fetchTask = async () => {
        try {
          // Since there is no single task endpoint in the routes provided by user (only get all tasks),
          // We will fetch all and filter, or just use GET /tasks?search=title.
          // Wait, actually I can just add a single task API if needed, but for now let's just fetch all and find the task.
          // In a real app we would have GET /api/tasks/:id, but user didn't request that endpoint specifically.
          // Let's assume we can fetch all and find it, or use the Update endpoint which implies the route exists.
          
          const { data } = await api.get('/tasks', { params: { limit: 100 } });
          const task = data.tasks.find(t => t._id === id);
          
          if (task) {
            setFormData({
              title: task.title,
              description: task.description || '',
              status: task.status,
              priority: task.priority,
              dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '',
            });
          } else {
            setError('Task not found');
          }
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch task');
        } finally {
          setFetchingTask(false);
        }
      };
      
      fetchTask();
    }
  }, [id, isAddMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isAddMode) {
        await api.post('/tasks', formData);
      } else {
        await api.put(`/tasks/${id}`, formData);
      }
      navigate('/tasks');
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isAddMode ? 'create' : 'update'} task`);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingTask) return <Loader />;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="card">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isAddMode ? 'Create New Task' : 'Edit Task'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isAddMode ? 'Fill out the details below to add a new task.' : 'Update the details for this task.'}
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="title" className="label">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="input"
              placeholder="e.g. Finish the Q3 report"
            />
          </div>

          <div>
            <label htmlFor="description" className="label">Description</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="input resize-none"
              placeholder="Details about the task..."
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="status" className="label">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input"
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="label">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="input"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="dueDate" className="label">Due Date</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex justify-center items-center min-w-[120px]"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : isAddMode ? (
                'Create Task'
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
