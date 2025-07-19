import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  CloudArrowUpIcon,
  DocumentArrowDownIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PhotoIcon,
  DocumentTextIcon,
  ArrowUpTrayIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Select from '../../components/UI/Select';
import Modal from '../../components/UI/Modal';
import Badge from '../../components/UI/Badge';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

interface DesignProject {
  id: string;
  orderId: string;
  jobId: string;
  title: string;
  clientName: string;
  status: 'pending' | 'in-progress' | 'review' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
  description?: string;
  requirements?: string;
  designFiles: DesignFile[];
  feedback?: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
  approvedAt?: Date;
}

interface DesignFile {
  id: string;
  name: string;
  type: 'image' | 'vector' | 'document';
  url: string;
  size: number;
  uploadedAt: Date;
  version: number;
  isActive: boolean;
}

const DesignPage: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState<DesignProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<DesignProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'upload'>('view');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // Get order_id from URL params for approval flow
  const orderIdFromUrl = searchParams.get('order_id');

  // Form data for editing
  const [formData, setFormData] = useState({
    feedback: '',
    status: 'pending' as DesignProject['status'],
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockProjects: DesignProject[] = [
        {
          id: 'DESIGN-001',
          orderId: 'ORD-001',
          jobId: 'JOB-001',
          title: 'Corporate Event T-Shirts Design',
          clientName: 'ABC Corporation',
          status: 'in-progress',
          priority: 'high',
          dueDate: new Date('2024-12-25'),
          description: 'Create modern design for corporate event t-shirts with company logo',
          requirements: 'Logo must be prominently displayed, use company colors (blue and white), modern and professional look',
          assignedTo: 'Designer John',
          designFiles: [
            {
              id: 'FILE-001',
              name: 'corporate-tshirt-v1.ai',
              type: 'vector',
              url: '/designs/corporate-tshirt-v1.ai',
              size: 2048000,
              uploadedAt: new Date('2024-12-18T10:00:00'),
              version: 1,
              isActive: true,
            },
            {
              id: 'FILE-002',
              name: 'corporate-tshirt-preview.png',
              type: 'image',
              url: '/designs/corporate-tshirt-preview.png',
              size: 512000,
              uploadedAt: new Date('2024-12-18T10:30:00'),
              version: 1,
              isActive: true,
            },
          ],
          createdAt: new Date('2024-12-15'),
          updatedAt: new Date('2024-12-18'),
        },
        {
          id: 'DESIGN-002',
          orderId: 'ORD-002',
          jobId: 'JOB-002',
          title: 'Marketing Campaign Hoodies Design',
          clientName: 'XYZ Solutions',
          status: 'review',
          priority: 'medium',
          dueDate: new Date('2024-12-28'),
          description: 'Design for marketing campaign hoodies with brand elements',
          requirements: 'Include brand logo, use vibrant colors, target young audience',
          assignedTo: 'Designer Sarah',
          designFiles: [
            {
              id: 'FILE-003',
              name: 'marketing-hoodie-design.psd',
              type: 'image',
              url: '/designs/marketing-hoodie-design.psd',
              size: 15728640,
              uploadedAt: new Date('2024-12-17T14:00:00'),
              version: 2,
              isActive: true,
            },
          ],
          feedback: 'Great design! Please adjust the logo size and make it more prominent.',
          submittedAt: new Date('2024-12-17T16:00:00'),
          createdAt: new Date('2024-12-12'),
          updatedAt: new Date('2024-12-17'),
        },
        {
          id: 'DESIGN-003',
          orderId: 'ORD-003',
          jobId: 'JOB-003',
          title: 'Sports Team Jerseys',
          clientName: 'Local Sports Club',
          status: 'approved',
          priority: 'low',
          dueDate: new Date('2024-12-30'),
          description: 'Design jerseys for local sports team',
          requirements: 'Team colors, player numbers, sponsor logos',
          assignedTo: 'Designer Mike',
          designFiles: [
            {
              id: 'FILE-004',
              name: 'sports-jersey-final.ai',
              type: 'vector',
              url: '/designs/sports-jersey-final.ai',
              size: 3072000,
              uploadedAt: new Date('2024-12-16T11:00:00'),
              version: 3,
              isActive: true,
            },
          ],
          feedback: 'Perfect! Design approved for production.',
          submittedAt: new Date('2024-12-16T12:00:00'),
          approvedAt: new Date('2024-12-16T15:00:00'),
          createdAt: new Date('2024-12-10'),
          updatedAt: new Date('2024-12-16'),
        },
      ];
      
      setProjects(mockProjects);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  // Filter projects based on search term and filters
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;
    
    // If order_id is provided in URL, filter to show only that specific design
    const matchesOrderId = orderIdFromUrl ? project.orderId === orderIdFromUrl : true;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesOrderId;
  });

  const handleOpenModal = (mode: 'view' | 'edit' | 'upload', project?: DesignProject) => {
    setModalMode(mode);
    if (project) {
      setSelectedProject(project);
      if (mode === 'edit') {
        setFormData({
          feedback: project.feedback || '',
          status: project.status,
        });
      }
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
    setUploadFiles([]);
    setFormData({ feedback: '', status: 'pending' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      setUploadFiles(prev => [...prev, ...files]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setUploadFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (modalMode === 'edit' && selectedProject) {
        setProjects(prev => prev.map(project => 
          project.id === selectedProject.id 
            ? {
                ...project,
                feedback: formData.feedback,
                status: formData.status,
                updatedAt: new Date(),
                ...(formData.status === 'approved' && { approvedAt: new Date() }),
                ...(formData.status === 'review' && { submittedAt: new Date() }),
              }
            : project
        ));
      } else if (modalMode === 'upload' && selectedProject) {
        // Handle file upload
        const newFiles: DesignFile[] = uploadFiles.map((file, index) => ({
          id: `FILE-${Date.now()}-${index}`,
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'vector',
          url: URL.createObjectURL(file),
          size: file.size,
          uploadedAt: new Date(),
          version: selectedProject.designFiles.length + index + 1,
          isActive: true,
        }));
        
        setProjects(prev => prev.map(project => 
          project.id === selectedProject.id 
            ? {
                ...project,
                designFiles: [...project.designFiles, ...newFiles],
                updatedAt: new Date(),
              }
            : project
        ));
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error saving design:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (projectId: string, newStatus: DesignProject['status']) => {
    try {
      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? {
              ...project,
              status: newStatus,
              updatedAt: new Date(),
              ...(newStatus === 'approved' && { approvedAt: new Date() }),
              ...(newStatus === 'review' && { submittedAt: new Date() }),
            }
          : project
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-4 w-4" />;
      case 'in-progress':
        return <PencilIcon className="h-4 w-4" />;
      case 'review':
        return <EyeIcon className="h-4 w-4" />;
      case 'approved':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'rejected':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      default:
        return <DocumentTextIcon className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in-progress':
        return 'primary';
      case 'review':
        return 'secondary';
      case 'approved':
        return 'success';
      case 'rejected':
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Access control - admin, sales_manager, superadmin, and designer can access this page
  const hasDesignApprovalAccess = user?.role === 'superadmin' || user?.role === 'admin' || user?.role === 'sales_manager' || user?.role === 'designer';
  const canApprove = user?.role === 'superadmin' || user?.role === 'admin' || user?.role === 'sales_manager';
  const canProvideFeedback = user?.role === 'superadmin' || user?.role === 'admin' || user?.role === 'sales_manager';
  const canDesign = user?.role === 'designer' || user?.role === 'superadmin';
  const canEdit = user?.role === 'superadmin' || user?.role === 'admin' || user?.role === 'sales_manager';

  // Redirect if user doesn't have access
  useEffect(() => {
    if (!hasDesignApprovalAccess) {
      // Redirect to dashboard or show access denied
      window.location.href = '/dashboard';
    }
  }, [hasDesignApprovalAccess]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  const pendingCount = projects.filter(p => p.status === 'pending').length;
  const inProgressCount = projects.filter(p => p.status === 'in-progress').length;
  const reviewCount = projects.filter(p => p.status === 'review').length;
  const approvedCount = projects.filter(p => p.status === 'approved').length;

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
          <h1 className="text-3xl font-bold text-gray-900">
            {orderIdFromUrl ? `Design Approval - Order ${orderIdFromUrl}` : 'Design Approval & Feedback'}
          </h1>
          <p className="text-gray-600 mt-2">
            {orderIdFromUrl 
              ? `Review and approve design for order ${orderIdFromUrl}`
              : 'Review, provide feedback, and approve designs before production'
            }
          </p>
          {orderIdFromUrl && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Design Approval Request:</strong> This design has been completed and is ready for your review and approval.
              </p>
            </div>
          )}
        </div>
        {orderIdFromUrl && (
          <div className="mt-4 sm:mt-0">
            <Button
              variant="secondary"
              onClick={() => window.location.href = '/designer-section'}
              className="flex items-center gap-2"
            >
              <ArrowUpTrayIcon className="h-4 w-4 rotate-90" />
              Back to Designer Section
            </Button>
          </div>
        )}
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
                <PencilIcon className="h-8 w-8 text-primary-500" />
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
                <EyeIcon className="h-8 w-8 text-secondary-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Review</p>
                <p className="text-2xl font-bold text-gray-900">{reviewCount}</p>
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
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{approvedCount}</p>
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
                  placeholder="Search designs by title, ID, order, or client..."
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
                    { value: 'in-progress', label: 'In Progress' },
                    { value: 'review', label: 'In Review' },
                    { value: 'approved', label: 'Approved' },
                    { value: 'rejected', label: 'Rejected' },
                  ]}
                />
              </div>
              <div className="w-full lg:w-48">
                <Select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Priority' },
                    { value: 'high', label: 'High Priority' },
                    { value: 'medium', label: 'Medium Priority' },
                    { value: 'low', label: 'Low Priority' },
                  ]}
                />
              </div>
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card hover>
              <Card.Body>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {project.title}
                      </h3>
                      <Badge
                        variant={getStatusColor(project.status) as any}
                        className="flex items-center space-x-1"
                      >
                        {getStatusIcon(project.status)}
                        <span className="capitalize">{project.status.replace('-', ' ')}</span>
                      </Badge>
                      <Badge
                        variant={getPriorityColor(project.priority) as any}
                        size="sm"
                      >
                        {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)} Priority
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-2">
                      <div>
                        <span className="font-medium text-primary-600">Order ID:</span> 
                        <span className="font-bold text-primary-700">{project.orderId}</span>
                      </div>
                      <div>
                        <span className="font-medium">Design ID:</span> {project.id}
                      </div>
                      <div>
                        <span className="font-medium">Client:</span> {project.clientName}
                      </div>
                      <div>
                        <span className="font-medium">Due Date:</span> {project.dueDate.toLocaleDateString()}
                      </div>
                      {project.assignedTo && (
                        <div>
                          <span className="font-medium">Designer:</span> {project.assignedTo}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Files:</span> {project.designFiles.length}
                      </div>
                      {project.submittedAt && (
                        <div>
                          <span className="font-medium">Submitted:</span> {project.submittedAt.toLocaleDateString()}
                        </div>
                      )}
                      {project.approvedAt && (
                        <div>
                          <span className="font-medium">Approved:</span> {project.approvedAt.toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    
                    {project.description && (
                      <p className="text-sm text-gray-600 mt-2">{project.description}</p>
                    )}
                    
                    {project.feedback && (
                      <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <span className="font-medium">Feedback:</span> {project.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenModal('view', project)}
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    
                    {canDesign && project.status !== 'approved' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenModal('upload', project)}
                      >
                        <CloudArrowUpIcon className="h-4 w-4 mr-1" />
                        Upload
                      </Button>
                    )}
                    
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenModal('edit', project)}
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    )}
                    
                    {canDesign && project.status === 'in-progress' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleStatusUpdate(project.id, 'review')}
                      >
                        Submit for Review
                      </Button>
                    )}
                    
                    {canApprove && project.status === 'review' && (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleStatusUpdate(project.id, 'approved')}
                        >
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleStatusUpdate(project.id, 'rejected')}
                        >
                          <XMarkIcon className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No design projects found
          </h3>
          <p className="text-gray-600">
            {searchTerm ? 'Try adjusting your search criteria.' : 'No design projects available at the moment.'}
          </p>
        </motion.div>
      )}

      {/* Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        size="xl"
      >
        {modalMode === 'view' && selectedProject ? (
          // View Mode
          <>
            <Modal.Header>
              <h3 className="text-lg font-semibold">
                Design Project - {selectedProject.id}
              </h3>
            </Modal.Header>
            <Modal.Body>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Project Title</label>
                    <p className="text-gray-900">{selectedProject.title}</p>
                  </div>
                  <div>
                    <label className="form-label">Status</label>
                    <Badge variant={getStatusColor(selectedProject.status) as any}>
                      {selectedProject.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <label className="form-label">Priority</label>
                    <Badge variant={getPriorityColor(selectedProject.priority) as any}>
                      {selectedProject.priority.charAt(0).toUpperCase() + selectedProject.priority.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <label className="form-label">Due Date</label>
                    <p className="text-gray-900">{selectedProject.dueDate.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="form-label">Order ID</label>
                    <p className="text-gray-900">{selectedProject.orderId}</p>
                  </div>
                  <div>
                    <label className="form-label">Client</label>
                    <p className="text-gray-900">{selectedProject.clientName}</p>
                  </div>
                  <div>
                    <label className="form-label">Designer</label>
                    <p className="text-gray-900">{selectedProject.assignedTo || 'Not assigned'}</p>
                  </div>
                </div>
                
                {selectedProject.description && (
                  <div>
                    <label className="form-label">Description</label>
                    <p className="text-gray-900">{selectedProject.description}</p>
                  </div>
                )}
                
                {selectedProject.requirements && (
                  <div>
                    <label className="form-label">Requirements</label>
                    <p className="text-gray-900">{selectedProject.requirements}</p>
                  </div>
                )}
                
                {selectedProject.feedback && (
                  <div>
                    <label className="form-label">Feedback</label>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-blue-800">{selectedProject.feedback}</p>
                    </div>
                  </div>
                )}
                
                {/* Design Files */}
                <div>
                  <label className="form-label">Design Files ({selectedProject.designFiles.length})</label>
                  <div className="space-y-2">
                    {selectedProject.designFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <PhotoIcon className="h-8 w-8 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <p className="text-sm text-gray-600">
                              {formatFileSize(file.size)} • v{file.version} • {file.uploadedAt.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="ghost" onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </>
        ) : modalMode === 'upload' && selectedProject ? (
          // Upload Mode
          <form onSubmit={handleSubmit}>
            <Modal.Header>
              <h3 className="text-lg font-semibold">
                Upload Design Files - {selectedProject.title}
              </h3>
            </Modal.Header>
            
            <Modal.Body>
              <div className="space-y-4">
                {/* File Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <ArrowUpTrayIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Drag and drop your design files here
                  </p>
                  <p className="text-gray-600 mb-4">
                    or click to browse files
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".ai,.psd,.png,.jpg,.jpeg,.svg,.pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button type="button">
                      Browse Files
                    </Button>
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Supported formats: AI, PSD, PNG, JPG, SVG, PDF
                  </p>
                </div>
                
                {/* Selected Files */}
                {uploadFiles.length > 0 && (
                  <div>
                    <label className="form-label">Selected Files ({uploadFiles.length})</label>
                    <div className="space-y-2">
                      {uploadFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <PhotoIcon className="h-8 w-8 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">{file.name}</p>
                              <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                  disabled={uploadFiles.length === 0}
                >
                  Upload Files
                </Button>
              </div>
            </Modal.Footer>
          </form>
        ) : (
          // Edit Mode
          <form onSubmit={handleSubmit}>
            <Modal.Header>
              <h3 className="text-lg font-semibold">
                Edit Design Project - {selectedProject?.title}
              </h3>
            </Modal.Header>
            
            <Modal.Body>
              <div className="space-y-4">
                <Select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  options={[
                    { value: 'pending', label: 'Pending' },
                    { value: 'in-progress', label: 'In Progress' },
                    { value: 'review', label: 'In Review' },
                    { value: 'approved', label: 'Approved' },
                    { value: 'rejected', label: 'Rejected' },
                  ]}
                  required
                />
                
                <div>
                  <label className="form-label">Feedback</label>
                  <textarea
                    name="feedback"
                    value={formData.feedback}
                    onChange={handleInputChange}
                    rows={4}
                    className="input"
                    placeholder="Enter feedback for the designer..."
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
                  Update Project
                </Button>
              </div>
            </Modal.Footer>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default DesignPage;