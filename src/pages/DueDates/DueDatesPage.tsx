import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDaysIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  BellIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Select from '../../components/UI/Select';
import Modal from '../../components/UI/Modal';
import Badge from '../../components/UI/Badge';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

interface DueDateAlert {
  id: string;
  type: 'design' | 'production';
  orderId: string;
  jobId?: string;
  clientName: string;
  jobName: string;
  dueDate: Date;
  daysRemaining: number;
  status: 'critical' | 'warning' | 'upcoming' | 'overdue';
  priority: 'high' | 'medium' | 'low';
  assignedTo?: string;
  department: string;
  progress: number;
  description?: string;
  createdAt: Date;
  acknowledgedBy?: string[];
  acknowledgedAt?: Date;
}

const DueDatesPage: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [alerts, setAlerts] = useState<DueDateAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState<DueDateAlert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockAlerts: DueDateAlert[] = [
        {
          id: 'ALERT-001',
          type: 'design',
          orderId: 'ORD-001',
          jobId: 'JOB-001',
          clientName: 'Tech Startup Inc.',
          jobName: 'Company Logo T-Shirts',
          dueDate: new Date('2024-12-20'),
          daysRemaining: 2,
          status: 'critical',
          priority: 'high',
          assignedTo: 'Sarah Wilson',
          department: 'Design',
          progress: 75,
          description: 'Logo design approval needed before production',
          createdAt: new Date('2024-12-10'),
        },
        {
          id: 'ALERT-003',
          type: 'design',
          orderId: 'ORD-003',
          jobId: 'JOB-003',
          clientName: 'Local Restaurant',
          jobName: 'Staff Uniforms',
          dueDate: new Date('2024-12-22'),
          daysRemaining: 4,
          status: 'warning',
          priority: 'medium',
          assignedTo: 'Emily Chen',
          department: 'Design',
          progress: 45,
          description: 'Uniform design concepts for review',
          createdAt: new Date('2024-12-12'),
        },
        {
          id: 'ALERT-004',
          type: 'production',
          orderId: 'ORD-004',
          jobId: 'JOB-004',
          clientName: 'School District',
          jobName: 'Graduation T-Shirts',
          dueDate: new Date('2024-12-25'),
          daysRemaining: 7,
          status: 'upcoming',
          priority: 'medium',
          assignedTo: 'David Brown',
          department: 'Production',
          progress: 30,
          description: 'Bulk order for graduation ceremony',
          createdAt: new Date('2024-12-08'),
        },
        {
          id: 'ALERT-005',
          type: 'design',
          orderId: 'ORD-005',
          jobId: 'JOB-005',
          clientName: 'Marketing Agency',
          jobName: 'Promotional Hoodies',
          dueDate: new Date('2024-12-17'),
          daysRemaining: -1,
          status: 'overdue',
          priority: 'high',
          assignedTo: 'Alex Rodriguez',
          department: 'Design',
          progress: 90,
          description: 'Final design revisions overdue',
          createdAt: new Date('2024-12-01'),
        },
        {
          id: 'ALERT-006',
          type: 'production',
          orderId: 'ORD-006',
          jobId: 'JOB-006',
          clientName: 'Fitness Center',
          jobName: 'Gym Merchandise',
          dueDate: new Date('2024-12-28'),
          daysRemaining: 10,
          status: 'upcoming',
          priority: 'low',
          assignedTo: 'Lisa Park',
          department: 'Production',
          progress: 15,
          description: 'Custom gym apparel production',
          createdAt: new Date('2024-12-15'),
        },
      ];
      
      setAlerts(mockAlerts);
      setLoading(false);
    };

    fetchAlerts();
  }, []);

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = 
      alert.jobName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || alert.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || alert.department === departmentFilter;
    
    return matchesSearch && matchesType && matchesStatus && matchesDepartment;
  });

  const handleViewAlert = (alert: DueDateAlert) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAlert(null);
  };

  const handleAcknowledge = async (alertId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId 
          ? {
              ...alert,
              acknowledgedBy: [...(alert.acknowledgedBy || []), user?.name || 'Current User'],
              acknowledgedAt: new Date(),
            }
          : alert
      ));
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simulate data refresh
    setIsRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'danger';
      case 'warning':
        return 'warning';
      case 'upcoming':
        return 'primary';
      case 'overdue':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical':
        return <ExclamationTriangleIcon className="h-5 w-5" />;
      case 'warning':
        return <ClockIcon className="h-5 w-5" />;
      case 'upcoming':
        return <CalendarDaysIcon className="h-5 w-5" />;
      case 'overdue':
        return <XCircleIcon className="h-5 w-5" />;
      default:
        return <BellIcon className="h-5 w-5" />;
    }
  };

  const formatDaysRemaining = (days: number) => {
    if (days < 0) {
      return `${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} overdue`;
    } else if (days === 0) {
      return 'Due today';
    } else {
      return `${days} day${days !== 1 ? 's' : ''} remaining`;
    }
  };

  const departments = Array.from(new Set(alerts.map(a => a.department)));
  
  const canAcknowledge = hasPermission('due_dates');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  const criticalAlerts = alerts.filter(a => a.status === 'critical').length;
  const warningAlerts = alerts.filter(a => a.status === 'warning').length;
  const overdueAlerts = alerts.filter(a => a.status === 'overdue').length;
  const upcomingAlerts = alerts.filter(a => a.status === 'upcoming').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Due Date Monitoring</h1>
          <p className="text-gray-600 mt-2">
            Track upcoming deadlines and manage alerts
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          loading={isRefreshing}
          variant="ghost"
          className="mt-4 sm:mt-0"
        >
          <ArrowPathIcon className="h-5 w-5 mr-2" />
          Refresh
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card>
          <Card.Body>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-8 w-8 text-danger-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Critical</p>
                <p className="text-2xl font-bold text-gray-900">{criticalAlerts}</p>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-8 w-8 text-warning-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Warning</p>
                <p className="text-2xl font-bold text-gray-900">{warningAlerts}</p>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-8 w-8 text-danger-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">{overdueAlerts}</p>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarDaysIcon className="h-8 w-8 text-primary-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingAlerts}</p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <Card.Body>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by job name, client, order ID, or assignee..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<MagnifyingGlassIcon />}
                />
              </div>
              <div className="w-full lg:w-48">
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Types' },
                    { value: 'design', label: 'Design' },
                    { value: 'production', label: 'Production' },
                  ]}
                />
              </div>
              <div className="w-full lg:w-48">
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Status' },
                    { value: 'critical', label: 'Critical' },
                    { value: 'warning', label: 'Warning' },
                    { value: 'upcoming', label: 'Upcoming' },
                    { value: 'overdue', label: 'Overdue' },
                  ]}
                />
              </div>
              <div className="w-full lg:w-48">
                <Select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Departments' },
                    ...departments.map(dept => ({ value: dept, label: dept }))
                  ]}
                />
              </div>
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card hover>
              <Card.Body>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Status Icon */}
                    <div className={`flex-shrink-0 p-2 rounded-full ${
                      alert.status === 'critical' ? 'bg-danger-100 text-danger-600' :
                      alert.status === 'warning' ? 'bg-warning-100 text-warning-600' :
                      alert.status === 'overdue' ? 'bg-danger-100 text-danger-600' :
                      'bg-primary-100 text-primary-600'
                    }`}>
                      {getStatusIcon(alert.status)}
                    </div>
                    
                    {/* Alert Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {alert.jobName}
                        </h3>
                        <Badge variant={getStatusColor(alert.status) as any} size="sm">
                          {alert.status}
                        </Badge>
                        <Badge variant={getPriorityColor(alert.priority) as any} size="sm">
                          {alert.priority} priority
                        </Badge>
                        <Badge variant="secondary" size="sm">
                          {alert.type}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Client:</span> {alert.clientName}
                        </div>
                        <div>
                          <span className="font-medium">Order:</span> {alert.orderId}
                        </div>
                        <div>
                          <span className="font-medium">Assigned to:</span> {alert.assignedTo || 'Unassigned'}
                        </div>
                        <div>
                          <span className="font-medium">Department:</span> {alert.department}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-4">
                          <div className="text-sm">
                            <span className="font-medium text-gray-900">
                              Due: {alert.dueDate.toLocaleDateString()}
                            </span>
                            <span className={`ml-2 ${
                              alert.daysRemaining < 0 ? 'text-danger-600' :
                              alert.daysRemaining <= 2 ? 'text-warning-600' :
                              'text-gray-600'
                            }`}>
                              ({formatDaysRemaining(alert.daysRemaining)})
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  alert.progress >= 80 ? 'bg-success-500' :
                                  alert.progress >= 50 ? 'bg-warning-500' :
                                  'bg-danger-500'
                                }`}
                                style={{ width: `${alert.progress}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600">{alert.progress}%</span>
                          </div>
                        </div>
                        
                        {alert.acknowledgedBy && alert.acknowledgedBy.length > 0 && (
                          <div className="flex items-center text-sm text-success-600">
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Acknowledged
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewAlert(alert)}
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    
                    {canAcknowledge && !alert.acknowledgedBy?.includes(user?.name || '') && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAcknowledge(alert.id)}
                      >
                        <BellIcon className="h-4 w-4 mr-1" />
                        Acknowledge
                      </Button>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No alerts found
          </h3>
          <p className="text-gray-600">
            {searchTerm ? 'Try adjusting your search criteria.' : 'All deadlines are under control!'}
          </p>
        </motion.div>
      )}

      {/* Alert Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        size="lg"
      >
        {selectedAlert && (
          <>
            <Modal.Header>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  selectedAlert.status === 'critical' ? 'bg-danger-100 text-danger-600' :
                  selectedAlert.status === 'warning' ? 'bg-warning-100 text-warning-600' :
                  selectedAlert.status === 'overdue' ? 'bg-danger-100 text-danger-600' :
                  'bg-primary-100 text-primary-600'
                }`}>
                  {getStatusIcon(selectedAlert.status)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedAlert.jobName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedAlert.clientName} • {selectedAlert.orderId}
                  </p>
                </div>
              </div>
            </Modal.Header>
            
            <Modal.Body>
              <div className="space-y-6">
                {/* Status and Priority */}
                <div className="flex items-center space-x-4">
                  <Badge variant={getStatusColor(selectedAlert.status) as any}>
                    {selectedAlert.status}
                  </Badge>
                  <Badge variant={getPriorityColor(selectedAlert.priority) as any}>
                    {selectedAlert.priority} priority
                  </Badge>
                  <Badge variant="secondary">
                    {selectedAlert.type}
                  </Badge>
                </div>
                
                {/* Due Date Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Due Date</label>
                      <p className="text-gray-900 font-semibold">
                        {selectedAlert.dueDate.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <label className="form-label">Time Remaining</label>
                      <p className={`font-semibold ${
                        selectedAlert.daysRemaining < 0 ? 'text-danger-600' :
                        selectedAlert.daysRemaining <= 2 ? 'text-warning-600' :
                        'text-success-600'
                      }`}>
                        {formatDaysRemaining(selectedAlert.daysRemaining)}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Progress */}
                <div>
                  <label className="form-label">Progress</label>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-300 ${
                          selectedAlert.progress >= 80 ? 'bg-success-500' :
                          selectedAlert.progress >= 50 ? 'bg-warning-500' :
                          'bg-danger-500'
                        }`}
                        style={{ width: `${selectedAlert.progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedAlert.progress}%
                    </span>
                  </div>
                </div>
                
                {/* Assignment Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Assigned To</label>
                    <p className="text-gray-900">{selectedAlert.assignedTo || 'Unassigned'}</p>
                  </div>
                  <div>
                    <label className="form-label">Department</label>
                    <p className="text-gray-900">{selectedAlert.department}</p>
                  </div>
                </div>
                
                {/* Description */}
                {selectedAlert.description && (
                  <div>
                    <label className="form-label">Description</label>
                    <p className="text-gray-900">{selectedAlert.description}</p>
                  </div>
                )}
                
                {/* Acknowledgment Info */}
                {selectedAlert.acknowledgedBy && selectedAlert.acknowledgedBy.length > 0 && (
                  <div className="bg-success-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircleIcon className="h-5 w-5 text-success-600" />
                      <span className="font-medium text-success-800">Acknowledged</span>
                    </div>
                    <div className="text-sm text-success-700">
                      <p>By: {selectedAlert.acknowledgedBy.join(', ')}</p>
                      {selectedAlert.acknowledgedAt && (
                        <p>On: {selectedAlert.acknowledgedAt.toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Timeline */}
                <div>
                  <label className="form-label">Timeline</label>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="text-gray-900">{selectedAlert.createdAt.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Due:</span>
                      <span className="text-gray-900">{selectedAlert.dueDate.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
            
            <Modal.Footer>
              <div className="flex space-x-3">
                <Button variant="ghost" onClick={handleCloseModal}>
                  Close
                </Button>
                {canAcknowledge && !selectedAlert.acknowledgedBy?.includes(user?.name || '') && (
                  <Button
                    variant="primary"
                    onClick={() => {
                      handleAcknowledge(selectedAlert.id);
                      handleCloseModal();
                    }}
                  >
                    <BellIcon className="h-4 w-4 mr-2" />
                    Acknowledge Alert
                  </Button>
                )}
              </div>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
};

export default DueDatesPage;