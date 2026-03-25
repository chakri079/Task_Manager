import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import api from '../services/api';
import { Loader, ErrorMessage } from '../components/UiComponents';
import StatsCard from '../components/StatsCard';
import { 
  ClipboardDocumentListIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  ChartPieIcon 
} from '@heroicons/react/24/outline';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isDark = document.documentElement.classList.contains('dark');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/tasks/stats');
        setStats(data);
      } catch (err) {
        setError('Failed to load analytics data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Loader />;
  if (error) return <div className="p-6"><ErrorMessage message={error} /></div>;

  // Format data for Recharts
  const statusData = stats?.statusBreakdown?.map(item => ({
    name: item._id,
    value: item.count
  })) || [];

  const priorityData = stats?.priorityBreakdown?.map(item => ({
    name: item._id,
    value: item.count
  })) || [];

  const COLORS = {
    status: {
      'Done': '#10B981', // green-500
      'In Progress': '#F59E0B', // amber-500
      'Todo': '#6B7280', // gray-500
    },
    priority: {
      'High': '#EF4444', // red-500
      'Medium': '#F97316', // orange-500
      'Low': '#3B82F6', // blue-500
    }
  };

  const chartTextColor = isDark ? '#E5E7EB' : '#374151'; // gray-200 or gray-700
  const chartGridColor = isDark ? '#374151' : '#E5E7EB'; // gray-700 or gray-200
  const tooltipStyle = {
    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
    borderColor: isDark ? '#374151' : '#E5E7EB',
    color: isDark ? '#F9FAFB' : '#111827',
  };

  // Custom label for Pie chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    if (percent === 0) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
  
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold shadow-sm">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          A visual overview of your task progress and priorities.
        </p>
      </div>

      {/* KPI Cards */}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Chart */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Tasks by Status</h2>
          {stats?.totalTasks === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              No data available
            </div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={5}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.status[entry.name] || COLORS.status['Todo']} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: chartTextColor }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Priority Chart */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Tasks by Priority</h2>
          {stats?.totalTasks === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              No data available
            </div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={priorityData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: chartTextColor }} axisLine={{ stroke: chartGridColor }} />
                  <YAxis tick={{ fill: chartTextColor }} axisLine={{ stroke: chartGridColor }} allowDecimals={false} />
                  <Tooltip cursor={{ fill: isDark ? '#374151' : '#F3F4F6' }} contentStyle={tooltipStyle} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={60}>
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.priority[entry.name] || COLORS.priority['Low']} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
