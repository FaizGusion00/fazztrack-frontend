import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  UsersIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/UI/Card';
import Badge from '../../components/UI/Badge';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import type { DashboardStats, ChartData, OrderTrend } from '../../types';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalOrders: 156,
        pendingOrders: 23,
        completedOrders: 133,
        totalRevenue: 45670.50,
        activeJobs: 18,
        overdueJobs: 3,
        totalClients: 89,
        newClients: 12,
        pendingPayments: 5,
        completedJobs: 120,
      });
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  // Chart data
  const orderTrends: OrderTrend[] = [
    { date: '2024-01-01', orders: 45, revenue: 12500 },
    { date: '2024-02-01', orders: 52, revenue: 15200 },
    { date: '2024-03-01', orders: 48, revenue: 14100 },
    { date: '2024-04-01', orders: 61, revenue: 18300 },
    { date: '2024-05-01', orders: 55, revenue: 16800 },
    { date: '2024-06-01', orders: 67, revenue: 21200 },
  ];

  const jobStatusData: ChartData[] = [
    { name: 'Completed', value: 45, color: '#10B981' },
    { name: 'In Progress', value: 28, color: '#3B82F6' },
    { name: 'Pending', value: 15, color: '#F59E0B' },
    { name: 'Overdue', value: 8, color: '#EF4444' },
  ];

  const productionData: ChartData[] = [
    { name: 'PRINT', value: 12, color: '#8B5CF6' },
    { name: 'PRESS', value: 8, color: '#06B6D4' },
    { name: 'CUT', value: 15, color: '#84CC16' },
    { name: 'SEW', value: 10, color: '#F97316' },
    { name: 'QC', value: 6, color: '#EC4899' },
    { name: 'IRON/PACK', value: 4, color: '#6366F1' },
  ];

  const recentActivities = [
    { id: 1, action: 'New order created', client: 'ABC Company', time: '2 minutes ago', type: 'order' },
    { id: 2, action: 'Design approved', client: 'XYZ Corp', time: '15 minutes ago', type: 'design' },
    { id: 3, action: 'Job completed', client: 'Tech Solutions', time: '1 hour ago', type: 'completion' },
    { id: 4, action: 'Payment received', client: 'StartupCo', time: '2 hours ago', type: 'payment' },
    { id: 5, action: 'Order shipped', client: 'Global Inc', time: '3 hours ago', type: 'shipping' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingBagIcon,
      color: 'primary',
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Revenue',
      value: `RM ${(stats?.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: CurrencyDollarIcon,
      color: 'success',
      change: '+8.2%',
      changeType: 'positive' as const,
    },
    {
      title: 'Active Jobs',
      value: stats?.activeJobs || 0,
      icon: ClockIcon,
      color: 'warning',
      change: '+5',
      changeType: 'positive' as const,
    },
    {
      title: 'Total Clients',
      value: stats?.totalClients || 0,
      icon: UsersIcon,
      color: 'secondary',
      change: '+3',
      changeType: 'positive' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your business today.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="min-w-0 flex-1"
            >
              <Card hover className="h-full flex flex-col justify-between min-h-[140px] rounded-2xl shadow-sm">
                <Card.Body className="flex flex-col justify-between h-full p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {stat.value}
                      </p>
                      <div className="flex items-center mt-2">
                        <Badge
                          variant={stat.changeType === 'positive' ? 'success' : 'danger'}
                          size="sm"
                        >
                          {stat.change}
                        </Badge>
                        <span className="text-xs text-gray-500 ml-2">
                          vs last month
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-xl bg-${stat.color}-100 flex items-center justify-center`}>
                      <IconComponent className={`h-6 w-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900">
                Order Trends
              </h3>
              <p className="text-sm text-gray-600">
                Monthly order volume and revenue
              </p>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={orderTrends}>
                  <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#colorOrders)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </motion.div>

        {/* Job Status Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900">
                Job Status Distribution
              </h3>
              <p className="text-sm text-gray-600">
                Current job status breakdown
              </p>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={jobStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {jobStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </motion.div>
      </div>

      {/* Production Pipeline & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Production Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900">
                Production Pipeline
              </h3>
              <p className="text-sm text-gray-600">
                Current jobs in each production stage
              </p>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {productionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Activities
              </h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => {
                  const getIcon = (type: string) => {
                    switch (type) {
                      case 'order':
                        return <ShoppingBagIcon className="h-4 w-4" />;
                      case 'design':
                        return <CheckCircleIcon className="h-4 w-4" />;
                      case 'completion':
                        return <CheckCircleIcon className="h-4 w-4" />;
                      case 'payment':
                        return <CurrencyDollarIcon className="h-4 w-4" />;
                      case 'shipping':
                        return <TruckIcon className="h-4 w-4" />;
                      default:
                        return <ChartBarIcon className="h-4 w-4" />;
                    }
                  };

                  const getColor = (type: string) => {
                    switch (type) {
                      case 'order':
                        return 'text-primary-600 bg-primary-100';
                      case 'design':
                        return 'text-success-600 bg-success-100';
                      case 'completion':
                        return 'text-success-600 bg-success-100';
                      case 'payment':
                        return 'text-warning-600 bg-warning-100';
                      case 'shipping':
                        return 'text-secondary-600 bg-secondary-100';
                      default:
                        return 'text-gray-600 bg-gray-100';
                    }
                  };

                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <div className={`p-2 rounded-lg ${getColor(activity.type)}`}>
                        {getIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-600">
                          {activity.client}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.time}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;