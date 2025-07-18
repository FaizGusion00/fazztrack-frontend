import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  QrCodeIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlayIcon,
  StopIcon,
  CalendarIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Select from '../../components/UI/Select';
import Modal from '../../components/UI/Modal';
import Badge from '../../components/UI/Badge';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import type { Job, Order } from '../../types';

// Fix JobRecord interface to not override types from Job
// Remove JobRecord, use Job directly or extend with only additional fields

const JobsPage: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'create' | 'edit'>('view');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedQRJob, setSelectedQRJob] = useState<Job | null>(null);

  // Form data for new/edit job
  const [formData, setFormData] = useState({
    orderId: '',
    title: '',
    type: 'design' as Job['type'],
    assignedTo: '',
    priority: 'medium' as Job['priority'],
    dueDate: '',
    description: '',
    notes: '',
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockJobs: Job[] = [
        {
          id: 'JOB-001',
          orderId: 'ORD-001',
          order: {} as Order,
          type: 'design',
          assignedTo: 'Designer John',
          status: 'in_progress',
          qrCode: 'QR-JOB-001-DESIGN',
          startTime: '2024-12-18T09:00:00.000Z',
          endTime: undefined,
          duration: undefined,
          notes: '',
          designFiles: [],
          isFinalized: false,
          createdAt: '2024-12-15T00:00:00.000Z',
          updatedAt: '2024-12-18T00:00:00.000Z',
        },
        {
          id: 'JOB-002',
          orderId: 'ORD-002',
          order: {} as Order,
          type: 'print',
          assignedTo: 'Print Operator Mike',
          status: 'pending',
          qrCode: 'QR-JOB-002-PRINT',
          isFinalized: false,
          createdAt: '2024-12-12T00:00:00.000Z',
          updatedAt: '2024-12-12T00:00:00.000Z',
        },
        {
          id: 'JOB-003',
          orderId: 'ORD-002',
          order: {} as Order,
          type: 'press',
          assignedTo: 'Press Operator Sarah',
          status: 'pending',
          qrCode: 'QR-JOB-003-PRESS',
          isFinalized: false,
          createdAt: '2024-12-12T00:00:00.000Z',
          updatedAt: '2024-12-12T00:00:00.000Z',
        },
        {
          id: 'JOB-004',
          orderId: 'ORD-001',
          order: {} as Order,
          type: 'cut',
          assignedTo: 'Cutting Team Lead',
          status: 'completed',
          qrCode: 'QR-JOB-004-CUT',
          startTime: '2024-12-19T10:00:00.000Z',
          endTime: '2024-12-19T14:30:00.000Z',
          duration: 270, // 4.5 hours
          isFinalized: false,
          createdAt: '2024-12-15T00:00:00.000Z',
          updatedAt: '2024-12-19T00:00:00.000Z',
        },
        {
          id: 'JOB-005',
          orderId: 'ORD-001',
          order: {} as Order,
          type: 'sew',
          assignedTo: 'Sewing Team',
          status: 'in_progress',
          qrCode: 'QR-JOB-005-SEW',
          isFinalized: false,
          createdAt: '2024-12-15T00:00:00.000Z',
          updatedAt: '2024-12-20T00:00:00.000Z',
        },
      ];
      
      setJobs(mockJobs);
      setLoading(false);
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      (job.title && job.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.assignedTo && job.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesType = typeFilter === 'all' || job.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleOpenModal = (mode: 'view' | 'create' | 'edit', job?: Job) => {
    setModalMode(mode);
    if (mode === 'create') {
      setFormData({
        orderId: '',
        title: '',
        type: 'design',
        assignedTo: '',
        priority: 'medium',
        dueDate: '',
        description: '',
        notes: '',
      });
    } else if (job) {
      setSelectedJob(job);
      if (mode === 'edit') {
        setFormData({
          orderId: job.orderId,
          title: job.title || '',
          type: job.type,
          assignedTo: job.assignedTo || '',
          priority: job.priority || '',
          dueDate: job.dueDate || '',
          description: job.description || '',
          notes: job.notes || '',
        });
      }
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
    setShowQRModal(false);
    setSelectedQRJob(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (modalMode === 'create') {
        const newJob: Job = {
          id: `JOB-${String(jobs.length + 1).padStart(3, '0')}`,
          orderId: formData.orderId,
          order: {} as Order,
          type: formData.type,
          assignedTo: formData.assignedTo,
          status: 'pending',
          priority: formData.priority,
          dueDate: formData.dueDate,
          description: formData.description,
          notes: formData.notes,
          qrCode: `QR-JOB-${String(jobs.length + 1).padStart(3, '0')}-${formData.type.toUpperCase()}`,
          isFinalized: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        setJobs(prev => [...prev, newJob]);
      } else if (modalMode === 'edit' && selectedJob) {
        setJobs(prev => prev.map(job => 
          job.id === selectedJob.id 
            ? {
                ...job,
                title: formData.title,
                type: formData.type,
                assignedTo: formData.assignedTo,
                priority: formData.priority,
                dueDate: formData.dueDate,
                description: formData.description,
                notes: formData.notes,
                updatedAt: new Date().toISOString(),
              }
            : job
        ));
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error saving job:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartJob = async (jobId: string) => {
    try {
      setJobs(prev => prev.map(job => 
        job.id === jobId 
          ? {
              ...job,
              status: 'in_progress' as const,
              startTime: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : job
      ));
    } catch (error) {
      console.error('Error starting job:', error);
    }
  };

  const handleEndJob = async (jobId: string) => {
    try {
      setJobs(prev => prev.map(job => {
        if (job.id === jobId && job.startTime) {
          const endTime = new Date().toISOString();
          const duration = Math.floor((new Date(endTime).getTime() - new Date(job.startTime).getTime()) / (1000 * 60));
          
          return {
            ...job,
            status: 'completed' as const,
            endTime: endTime,
            duration: duration,
            updatedAt: new Date().toISOString(),
          };
        }
        return job;
      }));
    } catch (error) {
      console.error('Error ending job:', error);
    }
  };

  const handleShowQR = (job: Job) => {
    setSelectedQRJob(job);
    setShowQRModal(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-4 w-4" />;
      case 'in_progress':
        return <PlayIcon className="h-4 w-4" />;
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'on_hold':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      default:
        return <DocumentTextIcon className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in_progress':
        return 'primary';
      case 'completed':
        return 'success';
      case 'on_hold':
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'design':
        return 'primary';
      case 'print':
        return 'secondary';
      case 'press':
        return 'warning';
      case 'cut':
        return 'success';
      case 'sew':
        return 'primary';
      case 'qc':
        return 'danger';
      case 'iron':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const canCreate = hasPermission('jobs') && (user?.department === 'superadmin' || user?.department === 'sales_manager');
  const canEdit = hasPermission('jobs') && (user?.department === 'superadmin' || user?.department === 'sales_manager');
  const canStartEnd = user?.department === 'production_staff';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  const pendingCount = jobs.filter(j => j.status === 'pending').length;
  const inProgressCount = jobs.filter(j => j.status === 'in_progress').length;
  const completedCount = jobs.filter(j => j.status === 'completed').length;
  const onHoldCount = jobs.filter(j => j.status === 'on_hold').length;

  return (
    <div className="min-h-screen font-sans bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-2xl"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl font-bold mb-3">Job Management</h1>
              <p className="text-blue-100 text-lg leading-relaxed max-w-2xl">
                Track and manage production jobs throughout the workflow with real-time updates
              </p>
              <div className="flex items-center space-x-8 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{jobs.length}</div>
                  <div className="text-blue-200 text-sm">Total Jobs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{inProgressCount}</div>
                  <div className="text-blue-200 text-sm">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{completedCount}</div>
                  <div className="text-blue-200 text-sm">Completed</div>
                </div>
              </div>
            </div>
            {canCreate && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleOpenModal('create')}
                className="bg-white text-blue-700 font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-3"
              >
                <PlusIcon className="h-6 w-6" />
                <span>Create New Job</span>
              </motion.button>
            )}
          </div>
        </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-8"
      >
        <Card>
          <Card.Body>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-8 w-8 text-warning-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <PlayIcon className="h-8 w-8 text-primary-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{inProgressCount}</p>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-8 w-8 text-success-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-8 w-8 text-danger-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">On Hold</p>
                <p className="text-2xl font-bold text-gray-900">{onHoldCount}</p>
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
        <Card className="bg-white/90 rounded-2xl shadow-lg border border-white/30">
          <Card.Body>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search jobs by title, ID, order, client, or assignee..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<MagnifyingGlassIcon />}
                />
              </div>
              <div className="w-full lg:w-48">
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Status' },
                    { value: 'pending', label: 'Pending' },
                    { value: 'in_progress', label: 'In Progress' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'on_hold', label: 'On Hold' },
                  ]}
                />
              </div>
              <div className="w-full lg:w-48">
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Types' },
                    { value: 'design', label: 'Design' },
                    { value: 'print', label: 'Print' },
                    { value: 'press', label: 'Press' },
                    { value: 'cut', label: 'Cut' },
                    { value: 'sew', label: 'Sew' },
                    { value: 'qc', label: 'Quality Check' },
                    { value: 'iron', label: 'Iron/Packing' },
                  ]}
                />
              </div>
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      {/* Jobs List */}
      <div className="space-y-6">
        {filteredJobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card hover className="transition-all duration-200 hover:shadow-2xl hover:scale-[1.015] focus-within:ring-2 focus-within:ring-blue-400">
              <Card.Body>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {job.title}
                      </h3>
                      <Badge
                        variant={getStatusColor(job.status) as any}
                        className="flex items-center space-x-1"
                      >
                        {getStatusIcon(job.status)}
                        <span className="capitalize">{job.status.replace('_', ' ')}</span>
                      </Badge>
                      <Badge
                        variant={getTypeColor(job.type) as any}
                        size="sm"
                      >
                        {job.type.toUpperCase()}
                      </Badge>
                      <Badge
                        variant={getPriorityColor(job.priority || '') as any}
                        size="sm"
                      >
                        {(job.priority || '').charAt(0).toUpperCase() + (job.priority || '').slice(1)} Priority
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-2">
                      <div>
                        <span className="font-medium">Job ID:</span> {job.id}
                      </div>
                      <div>
                        <span className="font-medium">Order:</span> {job.orderId}
                      </div>
                      <div>
                        <span className="font-medium">Client:</span> {job.order?.client?.name || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Due Date:</span> {job.dueDate}
                      </div>
                      {job.assignedTo && (
                        <div>
                          <span className="font-medium">Assigned to:</span> {job.assignedTo}
                        </div>
                      )}
                      {job.startTime && (
                        <div>
                          <span className="font-medium">Started:</span> {job.startTime}
                        </div>
                      )}
                      {job.endTime && (
                        <div>
                          <span className="font-medium">Completed:</span> {job.endTime}
                        </div>
                      )}
                      {job.duration && (
                        <div>
                          <span className="font-medium">Duration:</span> {Math.floor(job.duration / 60)}h {job.duration % 60}m
                        </div>
                      )}
                    </div>
                    
                    {job.description && (
                      <p className="text-sm text-gray-600 mt-2">{job.description}</p>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenModal('view', job)}
                      className="transition-all duration-150 hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-400"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    
                    {job.qrCode && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShowQR(job)}
                      >
                        <QrCodeIcon className="h-4 w-4 mr-1" />
                        QR Code
                      </Button>
                    )}
                    
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenModal('edit', job)}
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    )}
                    
                    {canStartEnd && job.status === 'pending' && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleStartJob(job.id)}
                      >
                        <PlayIcon className="h-4 w-4 mr-1" />
                        Start
                      </Button>
                    )}
                    
                    {canStartEnd && job.status === 'in_progress' && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleEndJob(job.id)}
                      >
                        <StopIcon className="h-4 w-4 mr-1" />
                        End
                      </Button>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No jobs found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by creating your first job.'}
          </p>
          {canCreate && !searchTerm && (
            <Button onClick={() => handleOpenModal('create')}>
              <PlusIcon className="h-5 w-5 mr-2" />
              Create New Job
            </Button>
          )}
        </motion.div>
      )}

      {/* Job Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        size="lg"
      >
        {modalMode === 'view' && selectedJob ? (
          // View Mode
          <>
            <Modal.Header>
              <h3 className="text-lg font-semibold">
                Job Details - {selectedJob.id}
              </h3>
            </Modal.Header>
            <Modal.Body>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Job Title</label>
                    <p className="text-gray-900">{selectedJob.title}</p>
                  </div>
                  <div>
                    <label className="form-label">Status</label>
                    <Badge variant={getStatusColor(selectedJob.status) as any}>
                      {selectedJob.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <label className="form-label">Type</label>
                    <Badge variant={getTypeColor(selectedJob.type) as any}>
                      {selectedJob.type.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <label className="form-label">Priority</label>
                    <Badge variant={getPriorityColor(selectedJob.priority || '') as any}>
                      {(selectedJob.priority || '').charAt(0).toUpperCase() + (selectedJob.priority || '').slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <label className="form-label">Order ID</label>
                    <p className="text-gray-900">{selectedJob.orderId}</p>
                  </div>
                  <div>
                    <label className="form-label">Client</label>
                    <p className="text-gray-900">{selectedJob.order?.client?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="form-label">Assigned To</label>
                    <p className="text-gray-900">{selectedJob.assignedTo || 'Not assigned'}</p>
                  </div>
                  <div>
                    <label className="form-label">Due Date</label>
                    <p className="text-gray-900">{selectedJob.dueDate}</p>
                  </div>
                </div>
                
                {selectedJob.description && (
                  <div>
                    <label className="form-label">Description</label>
                    <p className="text-gray-900">{selectedJob.description}</p>
                  </div>
                )}
                
                {(selectedJob.startTime || selectedJob.endTime) && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Time Tracking</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      {selectedJob.startTime && (
                        <div>
                          <span className="font-medium text-gray-600">Started:</span>
                          <p className="text-gray-900">{selectedJob.startTime}</p>
                        </div>
                      )}
                      {selectedJob.endTime && (
                        <div>
                          <span className="font-medium text-gray-600">Completed:</span>
                          <p className="text-gray-900">{selectedJob.endTime}</p>
                        </div>
                      )}
                      {selectedJob.duration && (
                        <div>
                          <span className="font-medium text-gray-600">Duration:</span>
                          <p className="text-gray-900">{Math.floor(selectedJob.duration / 60)}h {selectedJob.duration % 60}m</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {selectedJob.qrCode && (
                  <div>
                    <label className="form-label">QR Code</label>
                    <p className="text-gray-900 font-mono">{selectedJob.qrCode}</p>
                  </div>
                )}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="ghost" onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </>
        ) : (
          // Create/Edit Mode
          <form onSubmit={handleSubmit}>
            <Modal.Header>
              <h3 className="text-lg font-semibold">
                {modalMode === 'create' ? 'Create New Job' : 'Edit Job'}
              </h3>
            </Modal.Header>
            <Modal.Body>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Order ID"
                    name="orderId"
                    value={formData.orderId}
                    onChange={handleInputChange}
                    placeholder="ORD-001"
                    required
                  />
                  
                  <Input
                    label="Job Title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter job title"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select
                    label="Job Type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    options={[
                      { value: 'design', label: 'Design' },
                      { value: 'print', label: 'Print' },
                      { value: 'press', label: 'Press' },
                      { value: 'cut', label: 'Cut' },
                      { value: 'sew', label: 'Sew' },
                      { value: 'qc', label: 'Quality Check' },
                      { value: 'iron', label: 'Iron/Packing' },
                    ]}
                    required
                  />
                  
                  <Select
                    label="Priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    options={[
                      { value: 'low', label: 'Low' },
                      { value: 'medium', label: 'Medium' },
                      { value: 'high', label: 'High' },
                    ]}
                    required
                  />
                  
                  <Input
                    label="Due Date"
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <Input
                  label="Assigned To"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleInputChange}
                  placeholder="Enter assignee name"
                />
                
                <div>
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="input"
                    placeholder="Enter job description..."
                  />
                </div>
                
                <div>
                  <label className="form-label">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={2}
                    className="input"
                    placeholder="Enter additional notes..."
                  />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isSubmitting}
                >
                  {modalMode === 'create' ? 'Create Job' : 'Update Job'}
                </Button>
              </div>
            </Modal.Footer>
          </form>
        )}
      </Modal>
      {/* QR Code Modal */}
      <Modal
        isOpen={showQRModal}
        onClose={handleCloseModal}
        size="md"
      >
        {selectedQRJob && (
          <>
            <Modal.Header>
              <h3 className="text-lg font-semibold">
                QR Code - {selectedQRJob.id}
              </h3>
            </Modal.Header>
            <Modal.Body>
              <div className="text-center space-y-4">
                <div className="bg-white p-8 rounded-lg border-2 border-gray-200 inline-block">
                  {/* QR Code placeholder - replace with actual QR code generator */}
                  <div className="w-48 h-48 bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <QrCodeIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">QR Code</p>
                      <p className="text-xs text-gray-500 mt-1">{selectedQRJob.qrCode}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">{selectedQRJob.title}</h4>
                  <p className="text-sm text-gray-600">Job Type: {selectedQRJob.type.toUpperCase()}</p>
                  <p className="text-sm text-gray-600">Assigned to: {selectedQRJob.assignedTo}</p>
                  <p className="text-xs text-gray-500 font-mono">{selectedQRJob.qrCode}</p>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <div className="flex space-x-3">
                <Button variant="ghost" onClick={handleCloseModal}>
                  Close
                </Button>
                <Button>
                  Download QR Code
                </Button>
              </div>
            </Modal.Footer>
          </>
        )}
      </Modal>
      </div>
    </div>
  );
};

export default JobsPage;