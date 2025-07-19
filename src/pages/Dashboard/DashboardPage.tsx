import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  UsersIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  ChartBarSquareIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  PaintBrushIcon,
  CalendarDaysIcon,
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
  ComposedChart,
} from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/UI/Card';
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

  // Enhanced chart data with more realistic values
  const orderTrends: OrderTrend[] = [
    { date: 'Jan', orders: 45, revenue: 12500 },
    { date: 'Feb', orders: 52, revenue: 15200 },
    { date: 'Mar', orders: 48, revenue: 14100 },
    { date: 'Apr', orders: 61, revenue: 18300 },
    { date: 'May', orders: 55, revenue: 16800 },
    { date: 'Jun', orders: 67, revenue: 21200 },
    { date: 'Jul', orders: 73, revenue: 23400 },
    { date: 'Aug', orders: 69, revenue: 21800 },
    { date: 'Sep', orders: 81, revenue: 25600 },
    { date: 'Oct', orders: 78, revenue: 24800 },
    { date: 'Nov', orders: 85, revenue: 27200 },
    { date: 'Dec', orders: 92, revenue: 29800 },
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

  const todayProductionData: ChartData[] = [
    { name: 'PRINT', value: 3, color: '#8B5CF6' },
    { name: 'PRESS', value: 2, color: '#06B6D4' },
    { name: 'CUT', value: 4, color: '#84CC16' },
    { name: 'SEW', value: 3, color: '#F97316' },
    { name: 'QC', value: 2, color: '#EC4899' },
    { name: 'IRON/PACK', value: 1, color: '#6366F1' },
  ];

  const productionEfficiencyData = [
    { phase: 'PRINT', efficiency: 85, target: 90 },
    { phase: 'PRESS', efficiency: 92, target: 90 },
    { phase: 'CUT', efficiency: 88, target: 90 },
    { phase: 'SEW', efficiency: 95, target: 90 },
    { phase: 'QC', efficiency: 87, target: 90 },
    { phase: 'IRON/PACK', efficiency: 91, target: 90 },
  ];

  const paymentStatusData: ChartData[] = [
    { name: 'Paid', value: 65, color: '#10B981' },
    { name: 'Pending', value: 18, color: '#F59E0B' },
    { name: 'Overdue', value: 12, color: '#EF4444' },
    { name: 'Partial', value: 5, color: '#8B5CF6' },
  ];

  const designStatusData: ChartData[] = [
    { name: 'Approved', value: 35, color: '#10B981' },
    { name: 'In Review', value: 22, color: '#3B82F6' },
    { name: 'Pending', value: 18, color: '#F59E0B' },
    { name: 'Rejected', value: 5, color: '#EF4444' },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 12500, orders: 45 },
    { month: 'Feb', revenue: 15200, orders: 52 },
    { month: 'Mar', revenue: 14100, orders: 48 },
    { month: 'Apr', revenue: 18300, orders: 61 },
    { month: 'May', revenue: 16800, orders: 55 },
    { month: 'Jun', revenue: 21200, orders: 67 },
    { month: 'Jul', revenue: 23400, orders: 73 },
    { month: 'Aug', revenue: 21800, orders: 69 },
    { month: 'Sep', revenue: 25600, orders: 81 },
    { month: 'Oct', revenue: 24800, orders: 78 },
    { month: 'Nov', revenue: 27200, orders: 85 },
    { month: 'Dec', revenue: 29800, orders: 92 },
  ];

  const recentActivities = [
    { id: 1, action: 'New order created', client: 'ABC Company', time: '2m ago', type: 'order', amount: 'RM 2,450' },
    { id: 2, action: 'Design approved', client: 'XYZ Corp', time: '15m ago', type: 'design', amount: 'RM 1,200' },
    { id: 3, action: 'Job completed', client: 'Tech Solutions', time: '1h ago', type: 'completion', amount: 'RM 3,800' },
    { id: 4, action: 'Payment received', client: 'StartupCo', time: '2h ago', type: 'payment', amount: 'RM 5,600' },
    { id: 5, action: 'Order shipped', client: 'Global Inc', time: '3h ago', type: 'shipping', amount: 'RM 4,200' },
  ];

  // Role-based dashboard configuration
  const getDashboardConfig = () => {
    if (!user) return { showAll: false, sections: [] };

    switch (user.role) {
      case 'superadmin':
        return {
          showAll: true,
          sections: ['overview', 'orders', 'revenue', 'production', 'payments', 'design', 'activities']
        };
      
      case 'admin':
        return {
          showAll: false,
          sections: ['overview', 'payments', 'design', 'production', 'activities']
        };
      
      case 'sales_manager':
        return {
          showAll: false,
          sections: ['overview', 'orders', 'revenue', 'production', 'payments']
        };
      
      case 'designer':
        return {
          showAll: false,
          sections: ['overview', 'design', 'orders']
        };
      
      case 'print':
      case 'press':
      case 'cut':
      case 'sew':
      case 'qc':
      case 'iron_packing':
        return {
          showAll: false,
          sections: ['overview', 'production', 'job_status']
        };
      
      default:
        return {
          showAll: false,
          sections: ['overview']
        };
    }
  };

  const dashboardConfig = getDashboardConfig();

  // Role-based stat cards
  const getStatCards = () => {
    if (!stats) return [];

    const baseCards = [
      {
        title: 'Total Orders',
        value: stats.totalOrders,
        icon: ShoppingBagIcon,
        color: 'primary',
        change: '+12%',
        changeType: 'positive' as const,
        gradient: 'from-blue-500 to-blue-600',
        roles: ['superadmin', 'sales_manager', 'designer']
      },
      {
        title: 'Revenue',
        value: `RM ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        icon: CurrencyDollarIcon,
        color: 'success',
        change: '+8.2%',
        changeType: 'positive' as const,
        gradient: 'from-green-500 to-green-600',
        roles: ['superadmin', 'sales_manager']
      },
      {
        title: 'Active Jobs',
        value: stats.activeJobs,
        icon: ClockIcon,
        color: 'warning',
        change: '+5',
        changeType: 'positive' as const,
        gradient: 'from-orange-500 to-orange-600',
        roles: ['superadmin', 'admin', 'sales_manager', 'designer', 'print', 'press', 'cut', 'sew', 'qc', 'iron_packing']
      },
      {
        title: 'Today\'s Jobs',
        value: 6, // Mock data - replace with actual API call
        icon: CalendarDaysIcon,
        color: 'info',
        change: '+2',
        changeType: 'positive' as const,
        gradient: 'from-cyan-500 to-cyan-600',
        roles: ['print', 'press', 'cut', 'sew', 'qc', 'iron_packing']
      },
      {
        title: 'Completed Today',
        value: 4, // Mock data - replace with actual API call
        icon: CheckCircleIcon,
        color: 'success',
        change: '+1',
        changeType: 'positive' as const,
        gradient: 'from-green-500 to-green-600',
        roles: ['print', 'press', 'cut', 'sew', 'qc', 'iron_packing']
      },
      {
        title: 'Pending QC',
        value: 3, // Mock data - replace with actual API call
        icon: ExclamationTriangleIcon,
        color: 'warning',
        change: '+1',
        changeType: 'negative' as const,
        gradient: 'from-yellow-500 to-yellow-600',
        roles: ['print', 'press', 'cut', 'sew', 'qc', 'iron_packing']
      },
      {
        title: 'Total Clients',
        value: stats.totalClients,
        icon: UsersIcon,
        color: 'secondary',
        change: '+3',
        changeType: 'positive' as const,
        gradient: 'from-purple-500 to-purple-600',
        roles: ['superadmin', 'sales_manager']
      },
      {
        title: 'Pending Deliveries',
        value: 8, // Mock data - replace with actual API call
        icon: TruckIcon,
        color: 'warning',
        change: '+2',
        changeType: 'negative' as const,
        gradient: 'from-amber-500 to-amber-600',
        roles: ['sales_manager']
      },
      {
        title: 'Completed Jobs',
        value: stats.completedJobs,
        icon: CheckCircleIcon,
        color: 'success',
        change: '+8',
        changeType: 'positive' as const,
        gradient: 'from-emerald-500 to-emerald-600',
        roles: ['admin', 'sales_manager']
      },
      {
        title: 'Pending Payments',
        value: stats.pendingPayments,
        icon: CreditCardIcon,
        color: 'warning',
        change: '-2',
        changeType: 'negative' as const,
        gradient: 'from-yellow-500 to-yellow-600',
        roles: ['superadmin', 'admin']
      },
      {
        title: 'Pending Designs',
        value: 15, // Mock data - replace with actual API call
        icon: PaintBrushIcon,
        color: 'warning',
        change: '+3',
        changeType: 'negative' as const,
        gradient: 'from-pink-500 to-pink-600',
        roles: ['superadmin', 'admin']
      },
      {
        title: 'Overdue Jobs',
        value: stats.overdueJobs,
        icon: ExclamationTriangleIcon,
        color: 'danger',
        change: '+1',
        changeType: 'negative' as const,
        gradient: 'from-red-500 to-red-600',
        roles: ['superadmin', 'sales_manager', 'print', 'press', 'cut', 'sew', 'qc', 'iron_packing']
      },
      {
        title: 'Completed Jobs',
        value: stats.completedJobs,
        icon: CheckCircleIcon,
        color: 'success',
        change: '+8',
        changeType: 'positive' as const,
        gradient: 'from-emerald-500 to-emerald-600',
        roles: ['admin']
      },
      {
        title: 'Active Staff',
        value: 12, // Mock data - replace with actual API call
        icon: UsersIcon,
        color: 'info',
        change: '+1',
        changeType: 'positive' as const,
        gradient: 'from-indigo-500 to-indigo-600',
        roles: ['admin']
      }
    ];

    return baseCards.filter(card => card.roles.includes(user?.role || ''));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  const statCards = getStatCards();

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100 backdrop-blur-sm text-sm">
          <p className="font-semibold text-gray-900 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'revenue' ? `RM ${entry.value.toLocaleString()}` : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4 p-4">
      {/* Compact Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center lg:text-left"
      >
        <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-1 text-sm lg:text-base">
          Here's what's happening with your business today.
        </p>
      </motion.div>

      {/* Compact Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -2, scale: 1.01 }}
              className="min-w-0"
            >
              <Card className="h-full overflow-hidden bg-gradient-to-br from-white to-gray-50 border-0 shadow-md hover:shadow-lg transition-all duration-200">
                <Card.Body className="p-3 lg:p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 lg:p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-md`}>
                      <IconComponent className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        {stat.changeType === 'positive' ? (
                          <ArrowUpIcon className="h-3 w-3 text-green-500" />
                        ) : (
                          <ArrowDownIcon className="h-3 w-3 text-red-500" />
                        )}
                        <span className={`text-xs font-semibold ${
                          stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">vs last month</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-lg lg:text-xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Role-based Charts */}
      {dashboardConfig.sections.includes('orders') && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-white to-blue-50/30 border-0 shadow-lg">
            <Card.Header className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Order Trends
                  </h3>
                  <p className="text-gray-600 text-xs">
                    Monthly order volume and revenue growth
                  </p>
                </div>
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <ChartBarSquareIcon className="h-4 w-4 text-white" />
                </div>
              </div>
            </Card.Header>
            <Card.Body className="pt-0">
              <ResponsiveContainer width="100%" height={250}>
                <ComposedChart data={orderTrends}>
                  <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.2} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6B7280" 
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    yAxisId="left"
                    stroke="#6B7280" 
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="#6B7280" 
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `RM ${(value/1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                    iconType="circle"
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="orders"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorOrders)"
                    name="Orders"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ fill: '#10B981', strokeWidth: 1, r: 3 }}
                    activeDot={{ r: 4, stroke: '#10B981', strokeWidth: 1 }}
                    name="Revenue"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </motion.div>
      )}

      {/* Charts Grid - Role-based */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Job Status Distribution - for production staff only */}
        {dashboardConfig.sections.includes('production') && !dashboardConfig.sections.includes('orders') && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-white to-purple-50/30 border-0 shadow-lg">
              <Card.Header className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Job Status
                    </h3>
                    <p className="text-gray-600 text-xs">
                      Current job status breakdown
                    </p>
                  </div>
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                    <ChartBarIcon className="h-4 w-4 text-white" />
                  </div>
                </div>
              </Card.Header>
              <Card.Body className="pt-0">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={jobStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {jobStatusData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          stroke="#fff"
                          strokeWidth={1}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={<CustomTooltip />}
                      cursor={false}
                    />
                    <Legend 
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                      wrapperStyle={{ paddingLeft: '10px', fontSize: '11px' }}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </motion.div>
        )}

        {/* Order Status Distribution - for sales manager and superadmin */}
        {dashboardConfig.sections.includes('orders') && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-white to-blue-50/30 border-0 shadow-lg">
              <Card.Header className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Order Status
                    </h3>
                    <p className="text-gray-600 text-xs">
                      Current order status breakdown
                    </p>
                  </div>
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                    <ShoppingBagIcon className="h-4 w-4 text-white" />
                  </div>
                </div>
              </Card.Header>
              <Card.Body className="pt-0">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={jobStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {jobStatusData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          stroke="#fff"
                          strokeWidth={1}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={<CustomTooltip />}
                      cursor={false}
                    />
                    <Legend 
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                      wrapperStyle={{ paddingLeft: '10px', fontSize: '11px' }}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </motion.div>
        )}

        {/* Payment Status - for admin, superadmin, and sales manager */}
        {dashboardConfig.sections.includes('payments') && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-white to-yellow-50/30 border-0 shadow-lg">
              <Card.Header className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Payment Status
                    </h3>
                    <p className="text-gray-600 text-xs">
                      Payment status distribution
                    </p>
                  </div>
                  <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg">
                    <CreditCardIcon className="h-4 w-4 text-white" />
                  </div>
                </div>
              </Card.Header>
              <Card.Body className="pt-0">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={paymentStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {paymentStatusData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          stroke="#fff"
                          strokeWidth={1}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={<CustomTooltip />}
                      cursor={false}
                    />
                    <Legend 
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                      wrapperStyle={{ paddingLeft: '10px', fontSize: '11px' }}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </motion.div>
        )}

        {/* Design Status - for designers */}
        {dashboardConfig.sections.includes('design') && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-white to-pink-50/30 border-0 shadow-lg">
              <Card.Header className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Design Status
                    </h3>
                    <p className="text-gray-600 text-xs">
                      Design approval status breakdown
                    </p>
                  </div>
                  <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg">
                    <PaintBrushIcon className="h-4 w-4 text-white" />
                  </div>
                </div>
              </Card.Header>
              <Card.Body className="pt-0">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={designStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {designStatusData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          stroke="#fff"
                          strokeWidth={1}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={<CustomTooltip />}
                      cursor={false}
                    />
                    <Legend 
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                      wrapperStyle={{ paddingLeft: '10px', fontSize: '11px' }}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Production Pipeline - for production staff and relevant roles */}
      {dashboardConfig.sections.includes('production') && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-white to-green-50/30 border-0 shadow-lg">
              <Card.Header className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Production Pipeline
                    </h3>
                    <p className="text-gray-600 text-xs">
                      Current jobs in each production stage
                    </p>
                  </div>
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                    <TruckIcon className="h-4 w-4 text-white" />
                  </div>
                </div>
              </Card.Header>
              <Card.Body className="pt-0">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={productionData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="barGradient1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.8}/>
                      </linearGradient>
                      <linearGradient id="barGradient2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06B6D4" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#0891B2" stopOpacity={0.8}/>
                      </linearGradient>
                      <linearGradient id="barGradient3" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#84CC16" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#65A30D" stopOpacity={0.8}/>
                      </linearGradient>
                      <linearGradient id="barGradient4" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F97316" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#EA580C" stopOpacity={0.8}/>
                      </linearGradient>
                      <linearGradient id="barGradient5" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#EC4899" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#DB2777" stopOpacity={0.8}/>
                      </linearGradient>
                      <linearGradient id="barGradient6" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366F1" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#4F46E5" stopOpacity={0.8}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.2} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#6B7280" 
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#6B7280" 
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      content={<CustomTooltip />}
                      cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                    />
                    <Bar 
                      dataKey="value" 
                      radius={[4, 4, 0, 0]}
                      barSize={25}
                    >
                      {productionData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`url(#barGradient${index + 1})`}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </motion.div>

          {/* Production Efficiency - for production staff only */}
          {dashboardConfig.sections.includes('job_status') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-gradient-to-br from-white to-blue-50/30 border-0 shadow-lg">
                <Card.Header className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Production Efficiency
                      </h3>
                      <p className="text-gray-600 text-xs">
                        Efficiency vs target by production phase
                      </p>
                    </div>
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                      <ChartBarIcon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </Card.Header>
                <Card.Body className="pt-0">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={productionEfficiencyData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                      <defs>
                        <linearGradient id="efficiencyGradient1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10B981" stopOpacity={1}/>
                          <stop offset="100%" stopColor="#059669" stopOpacity={0.8}/>
                        </linearGradient>
                        <linearGradient id="efficiencyGradient2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#F59E0B" stopOpacity={1}/>
                          <stop offset="100%" stopColor="#D97706" stopOpacity={0.8}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.2} />
                      <XAxis 
                        dataKey="phase" 
                        stroke="#6B7280" 
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#6B7280" 
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        content={<CustomTooltip />}
                        cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                      />
                      <Bar 
                        dataKey="efficiency" 
                        radius={[4, 4, 0, 0]}
                        barSize={20}
                        fill="url(#efficiencyGradient1)"
                      />
                      <Line
                        type="monotone"
                        dataKey="target"
                        stroke="#EF4444"
                        strokeWidth={2}
                        dot={{ fill: '#EF4444', strokeWidth: 1, r: 3 }}
                        name="Target"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </motion.div>
          )}
        </div>
      )}

      {/* Today's Production - for production staff only */}
      {dashboardConfig.sections.includes('job_status') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-white to-purple-50/30 border-0 shadow-lg">
            <Card.Header className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Today's Production
                  </h3>
                  <p className="text-gray-600 text-xs">
                    Jobs completed today by production phase
                  </p>
                </div>
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                  <CalendarDaysIcon className="h-4 w-4 text-white" />
                </div>
              </div>
            </Card.Header>
            <Card.Body className="pt-0">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={todayProductionData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="todayGradient1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.8}/>
                    </linearGradient>
                    <linearGradient id="todayGradient2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06B6D4" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#0891B2" stopOpacity={0.8}/>
                    </linearGradient>
                    <linearGradient id="todayGradient3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#84CC16" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#65A30D" stopOpacity={0.8}/>
                    </linearGradient>
                    <linearGradient id="todayGradient4" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F97316" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#EA580C" stopOpacity={0.8}/>
                    </linearGradient>
                    <linearGradient id="todayGradient5" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EC4899" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#DB2777" stopOpacity={0.8}/>
                    </linearGradient>
                    <linearGradient id="todayGradient6" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366F1" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#4F46E5" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.2} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#6B7280" 
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#6B7280" 
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    content={<CustomTooltip />}
                    cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                  />
                  <Bar 
                    dataKey="value" 
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  >
                    {todayProductionData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`url(#todayGradient${index + 1})`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </motion.div>
      )}

      {/* Revenue Chart - for admin, superadmin, and sales manager */}
      {dashboardConfig.sections.includes('revenue') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-white to-indigo-50/30 border-0 shadow-lg">
            <Card.Header className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Revenue Overview
                  </h3>
                  <p className="text-gray-600 text-xs">
                    Monthly revenue performance
                  </p>
                </div>
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg">
                  <CurrencyDollarIcon className="h-4 w-4 text-white" />
                </div>
              </div>
            </Card.Header>
            <Card.Body className="pt-0">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.2} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6B7280" 
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#6B7280" 
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `RM ${(value/1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366F1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#revenueGradient)"
                    name="Revenue"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </motion.div>
      )}

      {/* Recent Activities - for all roles */}
      {dashboardConfig.sections.includes('activities') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-white to-orange-50/30 border-0 shadow-lg">
            <Card.Header className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Recent Activities
                  </h3>
                  <p className="text-gray-600 text-xs">
                    Latest system updates
                  </p>
                </div>
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
                  <ClockIcon className="h-4 w-4 text-white" />
                </div>
              </div>
            </Card.Header>
            <Card.Body className="pt-0">
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
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

                  const getGradient = (type: string) => {
                    switch (type) {
                      case 'order':
                        return 'from-blue-500 to-blue-600';
                      case 'design':
                        return 'from-green-500 to-green-600';
                      case 'completion':
                        return 'from-emerald-500 to-emerald-600';
                      case 'payment':
                        return 'from-yellow-500 to-orange-600';
                      case 'shipping':
                        return 'from-purple-500 to-purple-600';
                      default:
                        return 'from-gray-500 to-gray-600';
                    }
                  };

                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex items-start space-x-3 p-2 rounded-lg hover:bg-white/50 transition-all duration-150 group"
                    >
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${getGradient(activity.type)} shadow-md group-hover:scale-105 transition-transform duration-150`}>
                        {getIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {activity.client}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-500">
                            {activity.time}
                          </p>
                          <span className="text-xs font-semibold text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">
                            {activity.amount}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardPage;