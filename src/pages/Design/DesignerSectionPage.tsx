import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  PaintBrushIcon,
  DocumentDuplicateIcon,
  PauseCircleIcon,
  ArchiveBoxIcon,
  FolderIcon,
  CalendarDaysIcon,
  UserIcon,
  TagIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Select from '../../components/UI/Select';
import Modal from '../../components/UI/Modal';
import Badge from '../../components/UI/Badge';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

// Enhanced Design Project Interface
interface DesignProject {
  id: string;
  orderId: string;
  jobId: string;
  title: string;
  clientName: string;
  status: 'new' | 'in-progress' | 'review' | 'finalized' | 'on-hold' | 'completed' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: Date;
  description?: string;
  requirements?: string;
  designFiles: DesignFile[];
  polaTemplates: PolaTemplate[];
  feedback?: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
  finalizedAt?: Date;
  completedAt?: Date;
  category: 'apparel' | 'promotional' | 'packaging' | 'branding' | 'other';
  tags: string[];
  estimatedHours?: number;
  actualHours?: number;
}

interface DesignFile {
  id: string;
  name: string;
  type: 'image' | 'vector' | 'document' | 'mockup';
  url: string;
  size: number;
  uploadedAt: Date;
  version: number;
  isActive: boolean;
  thumbnail?: string;
  description?: string;
}

interface PolaTemplate {
  id: string;
  name: string;
  category: string;
  previewUrl: string;
  fileUrl: string;
  dimensions: string;
  createdAt: Date;
  isActive: boolean;
  tags: string[];
}

type DesignerSection = 'new-design' | 'finalize-design' | 'pola-template' | 'on-hold' | 'completed';

const DesignerSectionPage: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [activeSection, setActiveSection] = useState<DesignerSection>('new-design');
  const [projects, setProjects] = useState<DesignProject[]>([]);
  const [polaTemplates, setPolaTemplates] = useState<PolaTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<DesignProject | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<PolaTemplate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'upload' | 'create' | 'template'>('view');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // Form data for creating/editing
  const [formData, setFormData] = useState({
    orderId: '',
    jobId: '',
    title: '',
    description: '',
    requirements: '',
    priority: 'medium' as DesignProject['priority'],
    category: 'apparel' as DesignProject['category'],
    estimatedHours: 0,
    tags: [] as string[],
    feedback: '',
    status: 'new' as DesignProject['status'],
  });

  // Template form data
  const [templateFormData, setTemplateFormData] = useState({
    name: '',
    category: '',
    dimensions: '',
    tags: [] as string[],
  });

  // Check if user has access to designer section
  const hasDesignerAccess = () => {
    return user?.role === 'designer' || user?.role === 'superadmin' || user?.role === 'admin' || user?.role === 'sales_manager' || user?.role === 'print' || user?.role === 'press' || user?.role === 'cut' || user?.role === 'sew' || user?.role === 'qc' || user?.role === 'iron_packing';
  };

  // Check if user can access specific sections
  const canAccessSection = (section: DesignerSection) => {
    const role = user?.role;
    
    // Designers and superadmins can access all sections
    if (role === 'designer' || role === 'superadmin') {
      return true;
    }
    
    // Sales managers, admins, and production staff can only access completed designs
    if (role === 'admin' || role === 'sales_manager' || role === 'print' || role === 'press' || role === 'cut' || role === 'sew' || role === 'qc' || role === 'iron_packing') {
      return section === 'completed';
    }
    
    return false;
  };

  // Set default active section for non-designer roles
  useEffect(() => {
    const role = user?.role;
    if (role && (role === 'admin' || role === 'sales_manager' || role === 'print' || role === 'press' || role === 'cut' || role === 'sew' || role === 'qc' || role === 'iron_packing')) {
      setActiveSection('completed');
    }
  }, [user?.role]);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchData = async () => {
      if (!hasDesignerAccess()) {
        setLoading(false);
        return;
      }

      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockProjects: DesignProject[] = [
        {
          id: 'DESIGN-001',
          orderId: 'ORD-001',
          jobId: 'JOB-001',
          title: 'Corporate Event T-Shirts Design',
          clientName: 'ABC Corporation',
          status: 'new',
          priority: 'high',
          dueDate: new Date('2024-12-25'),
          description: 'Create modern design for corporate event t-shirts with company logo',
          requirements: 'Logo must be prominently displayed, use company colors (blue and white), modern and professional look',
          assignedTo: 'Designer John',
          category: 'apparel',
          tags: ['corporate', 't-shirt', 'logo', 'event'],
          estimatedHours: 8,
          designFiles: [],
          polaTemplates: [],
          createdAt: new Date('2024-12-15'),
          updatedAt: new Date('2024-12-18'),
        },
        {
          id: 'DESIGN-002',
          orderId: 'ORD-002',
          jobId: 'JOB-002',
          title: 'Marketing Campaign Hoodies Design',
          clientName: 'XYZ Solutions',
          status: 'in-progress',
          priority: 'medium',
          dueDate: new Date('2024-12-28'),
          description: 'Design for marketing campaign hoodies with brand elements',
          requirements: 'Include brand logo, use vibrant colors, target young audience',
          assignedTo: 'Designer Sarah',
          category: 'apparel',
          tags: ['hoodie', 'marketing', 'brand', 'youth'],
          estimatedHours: 12,
          actualHours: 6,
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
              thumbnail: '/designs/thumbnails/marketing-hoodie-thumb.jpg',
              description: 'Initial design concept with brand elements',
            },
          ],
          polaTemplates: [],
          feedback: 'Great start! Please adjust the logo size and make it more prominent.',
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
          status: 'finalized',
          priority: 'low',
          dueDate: new Date('2024-12-30'),
          description: 'Design jerseys for local sports team',
          requirements: 'Team colors, player numbers, sponsor logos',
          assignedTo: 'Designer Mike',
          category: 'apparel',
          tags: ['jersey', 'sports', 'team', 'numbers'],
          estimatedHours: 10,
          actualHours: 9,
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
              thumbnail: '/designs/thumbnails/sports-jersey-thumb.jpg',
              description: 'Final approved design ready for production',
            },
          ],
          polaTemplates: [],
          feedback: 'Perfect! Design approved for production.',
          submittedAt: new Date('2024-12-16T12:00:00'),
          finalizedAt: new Date('2024-12-16T15:00:00'),
          createdAt: new Date('2024-12-10'),
          updatedAt: new Date('2024-12-16'),
        },
        {
          id: 'DESIGN-004',
          orderId: 'ORD-004',
          jobId: 'JOB-004',
          title: 'Promotional Tote Bags',
          clientName: 'Green Earth Initiative',
          status: 'on-hold',
          priority: 'medium',
          dueDate: new Date('2025-01-15'),
          description: 'Eco-friendly promotional tote bag design',
          requirements: 'Environmental theme, green colors, sustainability message',
          assignedTo: 'Designer Anna',
          category: 'promotional',
          tags: ['tote-bag', 'eco-friendly', 'promotional', 'green'],
          estimatedHours: 6,
          actualHours: 3,
          designFiles: [],
          polaTemplates: [],
          feedback: 'On hold pending client approval for budget increase.',
          createdAt: new Date('2024-12-08'),
          updatedAt: new Date('2024-12-20'),
        },
        {
          id: 'DESIGN-005',
          orderId: 'ORD-005',
          jobId: 'JOB-005',
          title: 'Wedding Invitation Cards',
          clientName: 'Happy Couple Events',
          status: 'completed',
          priority: 'high',
          dueDate: new Date('2024-12-20'),
          description: 'Elegant wedding invitation card design',
          requirements: 'Elegant, romantic, gold accents, custom typography',
          assignedTo: 'Designer Lisa',
          category: 'branding',
          tags: ['wedding', 'invitation', 'elegant', 'gold'],
          estimatedHours: 15,
          actualHours: 14,
          designFiles: [
            {
              id: 'FILE-005',
              name: 'wedding-invitation-final.pdf',
              type: 'document',
              url: '/designs/wedding-invitation-final.pdf',
              size: 2048000,
              uploadedAt: new Date('2024-12-19T10:00:00'),
              version: 4,
              isActive: true,
              thumbnail: '/designs/thumbnails/wedding-invitation-thumb.jpg',
              description: 'Final print-ready invitation design',
            },
          ],
          polaTemplates: [],
          feedback: 'Beautiful work! Client is extremely happy.',
          submittedAt: new Date('2024-12-19T11:00:00'),
          finalizedAt: new Date('2024-12-19T14:00:00'),
          completedAt: new Date('2024-12-20T09:00:00'),
          createdAt: new Date('2024-12-05'),
          updatedAt: new Date('2024-12-20'),
        },
      ];

      const mockTemplates: PolaTemplate[] = [
        {
          id: 'TEMPLATE-001',
          name: 'Basic T-Shirt Template',
          category: 'Apparel',
          previewUrl: '/templates/previews/basic-tshirt.jpg',
          fileUrl: '/templates/files/basic-tshirt.ai',
          dimensions: '12" x 16"',
          tags: ['t-shirt', 'basic', 'apparel'],
          createdAt: new Date('2024-11-01'),
          isActive: true,
        },
        {
          id: 'TEMPLATE-002',
          name: 'Hoodie Front & Back',
          category: 'Apparel',
          previewUrl: '/templates/previews/hoodie-template.jpg',
          fileUrl: '/templates/files/hoodie-template.ai',
          dimensions: '14" x 18"',
          tags: ['hoodie', 'front', 'back', 'apparel'],
          createdAt: new Date('2024-11-05'),
          isActive: true,
        },
        {
          id: 'TEMPLATE-003',
          name: 'Business Card Standard',
          category: 'Branding',
          previewUrl: '/templates/previews/business-card.jpg',
          fileUrl: '/templates/files/business-card.ai',
          dimensions: '3.5" x 2"',
          tags: ['business-card', 'standard', 'branding'],
          createdAt: new Date('2024-11-10'),
          isActive: true,
        },
        {
          id: 'TEMPLATE-004',
          name: 'Tote Bag Template',
          category: 'Promotional',
          previewUrl: '/templates/previews/tote-bag.jpg',
          fileUrl: '/templates/files/tote-bag.ai',
          dimensions: '15" x 16"',
          tags: ['tote-bag', 'promotional', 'eco'],
          createdAt: new Date('2024-11-15'),
          isActive: true,
        },
      ];
      
      setProjects(mockProjects);
      setPolaTemplates(mockTemplates);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  // Filter projects based on active section and filters
  const getFilteredProjects = () => {
    let filtered = projects;

    // Filter by section
    switch (activeSection) {
      case 'new-design':
        filtered = projects.filter(p => p.status === 'new');
        break;
      case 'finalize-design':
        filtered = projects.filter(p => ['in-progress', 'review'].includes(p.status));
        break;
      case 'on-hold':
        filtered = projects.filter(p => p.status === 'on-hold');
        break;
      case 'completed':
        filtered = projects.filter(p => ['finalized', 'completed'].includes(p.status));
        break;
      default:
        break;
    }

    // Apply other filters
    return filtered.filter(project => {
      const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;
      const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
      
      return matchesPriority && matchesCategory;
    });
  };

  // Filter templates
  const getFilteredTemplates = () => {
    return polaTemplates;
  };

  const handleOpenModal = (mode: 'view' | 'edit' | 'upload' | 'create' | 'template', project?: DesignProject, template?: PolaTemplate) => {
    setModalMode(mode);
    if (project) {
      setSelectedProject(project);
      setFormData({
        orderId: project.orderId,
        jobId: project.jobId || '',
        title: project.title,
        description: project.description || '',
        requirements: project.requirements || '',
        priority: project.priority,
        category: project.category,
        estimatedHours: project.estimatedHours || 0,
        tags: project.tags,
        feedback: project.feedback || '',
        status: project.status,
      });
    } else if (template) {
      setSelectedTemplate(template);
      setTemplateFormData({
        name: template.name,
        category: template.category,
        dimensions: template.dimensions,
        tags: template.tags,
      });
    } else {
      // Reset form for new creation
      setSelectedProject(null);
      setSelectedTemplate(null);
      setFormData({
        orderId: '',
        jobId: '',
        title: '',
        description: '',
        requirements: '',
        priority: 'medium',
        category: 'apparel',
        estimatedHours: 0,
        tags: [],
        feedback: '',
        status: 'new',
      });
      setTemplateFormData({
        name: '',
        category: '',
        dimensions: '',
        tags: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
    setSelectedTemplate(null);
    setUploadFiles([]);
    setDragActive(false);
  };

  // File upload handlers
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

  // Handle sending completed design for approval
  const handleSendForApproval = (project: DesignProject) => {
    // Navigate to DesignPage with order_id parameter
    window.location.href = `/design?order_id=${project.orderId}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (modalMode === 'create') {
        // Create new project logic
        console.log('Creating new project:', formData);
      } else if (modalMode === 'edit') {
        // Update project logic
        console.log('Updating project:', selectedProject?.id, formData);
      } else if (modalMode === 'upload') {
        // Upload files logic
        console.log('Uploading files:', uploadFiles);
      } else if (modalMode === 'template') {
        // Create/update template logic
        console.log('Template operation:', templateFormData);
      }
      
      handleCloseModal();
      // Refresh data
      // fetchData();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadgeColor = (status: DesignProject['status']) => {
    switch (status) {
      case 'new': return 'blue';
      case 'in-progress': return 'yellow';
      case 'review': return 'purple';
      case 'finalized': return 'green';
      case 'completed': return 'emerald';
      case 'on-hold': return 'orange';
      case 'rejected': return 'red';
      default: return 'gray';
    }
  };

  const getPriorityBadgeColor = (priority: DesignProject['priority']) => {
    switch (priority) {
      case 'urgent': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Check access permission
  if (!hasDesignerAccess()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <Card.Body>
            <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">
              You don't have permission to access the Designer Section. This area is restricted to Designers and Super Admins only.
            </p>
          </Card.Body>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const allSectionTabs = [
    { id: 'new-design', label: 'New Design', icon: PlusIcon, count: projects.filter(p => p.status === 'new').length },
    { id: 'finalize-design', label: 'Finalize Design', icon: CheckCircleIcon, count: projects.filter(p => ['in-progress', 'review'].includes(p.status)).length },
    { id: 'pola-template', label: 'Pola Template', icon: DocumentDuplicateIcon, count: polaTemplates.length },
    { id: 'on-hold', label: 'On Hold Case', icon: PauseCircleIcon, count: projects.filter(p => p.status === 'on-hold').length },
    { id: 'completed', label: 'Design Completed', icon: ArchiveBoxIcon, count: projects.filter(p => ['finalized', 'completed'].includes(p.status)).length },
  ];

  // Filter tabs based on user permissions
  const sectionTabs = allSectionTabs.filter(tab => canAccessSection(tab.id as DesignerSection));

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <PaintBrushIcon className="h-7 w-7 text-blue-600" />
                Designer Section
              </h1>
              <p className="text-gray-600 mt-1 text-sm">
                Manage design projects, templates, and workflow efficiently
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge size="lg" className="bg-blue-50 text-blue-700 border-blue-200">
                {user?.name} - {user?.role}
              </Badge>
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-6">
              {sectionTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeSection === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id as DesignerSection)}
                    className={`
                      flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-all duration-200
                      ${
                        isActive
                          ? 'border-blue-500 text-blue-600 bg-blue-50'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                    {tab.count > 0 && (
                      <Badge size="sm" className={isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}>
                        {tab.count}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Enhanced Filters and Search */}
        <div className="mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                {activeSection !== 'pola-template' && (
                  <>
                    <Select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      options={[
                        { value: 'all', label: 'All Priorities' },
                        { value: 'urgent', label: 'Urgent' },
                        { value: 'high', label: 'High' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'low', label: 'Low' },
                      ]}
                      className="h-11 min-w-[140px] border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      options={[
                        { value: 'all', label: 'All Categories' },
                        { value: 'apparel', label: 'Apparel' },
                        { value: 'promotional', label: 'Promotional' },
                        { value: 'packaging', label: 'Packaging' },
                        { value: 'branding', label: 'Branding' },
                        { value: 'other', label: 'Other' },
                      ]}
                      className="h-11 min-w-[140px] border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </>
                )}
              </div>
              
              <div className="flex gap-2">
                {activeSection === 'new-design' && (
                  <Button
                    onClick={() => handleOpenModal('create')}
                    className="flex items-center gap-2 h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  >
                    <PlusIcon className="h-4 w-4" />
                    New Project
                  </Button>
                )}
                {activeSection === 'pola-template' && (
                  <Button
                    onClick={() => handleOpenModal('template')}
                    className="flex items-center gap-2 h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  >
                    <PlusIcon className="h-4 w-4" />
                    New Template
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {activeSection === 'pola-template' ? (
          /* Pola Templates Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {getFilteredTemplates().map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group"
              >
                <Card hover className="h-full border border-gray-200 hover:border-blue-300 transition-all duration-200">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-50 rounded-t-lg overflow-hidden">
                    <img
                      src={template.previewUrl}
                      alt={template.name}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIFByZXZpZXc8L3RleHQ+PC9zdmc+';
                      }}
                    />
                  </div>
                  <Card.Body className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                        {template.name}
                      </h3>
                    </div>
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <FolderIcon className="h-3 w-3" />
                        {template.category}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <AdjustmentsHorizontalIcon className="h-3 w-3" />
                        {template.dimensions}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} size="sm" className="text-xs px-2 py-0.5">
                          {tag}
                        </Badge>
                      ))}
                      {template.tags.length > 2 && (
                        <Badge size="sm" className="text-xs px-2 py-0.5">
                          +{template.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleOpenModal('view', undefined, template)}
                        className="flex-1 h-8 text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300"
                      >
                        <EyeIcon className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => window.open(template.fileUrl, '_blank')}
                        className="flex-1 h-8 text-xs bg-green-600 hover:bg-green-700 text-white border-green-600"
                      >
                        <DocumentArrowDownIcon className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Projects Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {getFilteredProjects().map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group"
              >
                <Card hover className="h-full border border-gray-200 hover:border-blue-300 transition-all duration-200">
                  <Card.Body className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="mb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                              {project.orderId}
                            </span>
                            {project.jobId && (
                              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                                {project.jobId}
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                            {project.title}
                          </h3>
                          <p className="text-xs text-gray-500">ID: {project.id}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge size="sm" className="text-xs">
                          {project.status.replace('-', ' ')}
                        </Badge>
                        <Badge size="sm" className="text-xs">
                          {project.priority}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <UserIcon className="h-3 w-3" />
                        {project.clientName}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <CalendarDaysIcon className="h-3 w-3" />
                        Due: {project.dueDate.toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <TagIcon className="h-3 w-3" />
                        {project.category}
                      </div>
                    </div>
                    
                    {project.description && (
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} size="sm" className="text-xs px-2 py-0.5">
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > 2 && (
                        <Badge size="sm" className="text-xs px-2 py-0.5">
                          +{project.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                    
                    {project.designFiles.length > 0 && (
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                        <PhotoIcon className="h-3 w-3" />
                        {project.designFiles.length} file{project.designFiles.length !== 1 ? 's' : ''}
                      </div>
                    )}
                    
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleOpenModal('view', project)}
                        className="flex-1 h-8 text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300"
                      >
                        <EyeIcon className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      {project.status === 'completed' && (
                        <Button
                          size="sm"
                          onClick={() => handleSendForApproval(project)}
                          className="flex-1 h-8 text-xs bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
                        >
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          Send for Approval
                        </Button>
                      )}
                      {project.status !== 'completed' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleOpenModal('edit', project)}
                            className="flex-1 h-8 text-xs bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 hover:border-yellow-300"
                          >
                            <PencilIcon className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleOpenModal('upload', project)}
                            className="flex-1 h-8 text-xs bg-green-600 hover:bg-green-700 text-white border-green-600"
                          >
                            <CloudArrowUpIcon className="h-3 w-3 mr-1" />
                            Upload
                          </Button>
                        </>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {((activeSection === 'pola-template' && getFilteredTemplates().length === 0) ||
          (activeSection !== 'pola-template' && getFilteredProjects().length === 0)) && (
          <div className="text-center py-8">
            <div className="mx-auto h-16 w-16 text-gray-300 mb-3">
              {activeSection === 'pola-template' ? (
                <DocumentDuplicateIcon className="h-full w-full" />
              ) : (
                <PaintBrushIcon className="h-full w-full" />
              )}
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-1">
              {activeSection === 'pola-template' ? 'No templates found' : 'No projects found'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {activeSection === 'pola-template'
                ? 'Create your first template to get started.'
                : 'No projects match your current filters.'}
            </p>
            {activeSection === 'new-design' && (
              <Button onClick={() => handleOpenModal('create')} className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white border-blue-600">
                <PlusIcon className="h-4 w-4 mr-2" />
                Create New Project
              </Button>
            )}
            {activeSection === 'pola-template' && (
              <Button onClick={() => handleOpenModal('template')} className="h-9 px-4 bg-purple-600 hover:bg-purple-700 text-white border-purple-600">
                <PlusIcon className="h-4 w-4 mr-2" />
                Create New Template
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          modalMode === 'view'
            ? selectedProject
              ? `View Project: ${selectedProject.title}`
              : selectedTemplate
              ? `View Template: ${selectedTemplate.name}`
              : 'View'
            : modalMode === 'edit'
            ? `Edit Project: ${selectedProject?.title}`
            : modalMode === 'upload'
            ? `Upload Files: ${selectedProject?.title}`
            : modalMode === 'create'
            ? 'Create New Project'
            : modalMode === 'template'
            ? selectedTemplate
              ? `Edit Template: ${selectedTemplate.name}`
              : 'Create New Template'
            : 'Modal'
        }
        size={modalMode === 'view' ? 'xl' : 'lg'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {modalMode === 'view' && selectedProject && (
            <div className="space-y-4">
              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3 text-sm">Project Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-600">Project ID:</span>
                      <span className="text-xs text-gray-900">{selectedProject.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-600">Order ID:</span>
                      <span className="text-xs font-semibold text-blue-600">{selectedProject.orderId}</span>
                    </div>
                    {selectedProject.jobId && (
                      <div className="flex justify-between">
                        <span className="text-xs font-medium text-gray-600">Job ID:</span>
                        <span className="text-xs font-semibold text-green-600">{selectedProject.jobId}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-600">Client:</span>
                      <span className="text-xs text-gray-900">{selectedProject.clientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-600">Category:</span>
                      <span className="text-xs text-gray-900 capitalize">{selectedProject.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-600">Due Date:</span>
                      <span className="text-xs text-gray-900">{selectedProject.dueDate.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3 text-sm">Status & Progress</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-600">Status:</span>
                      <Badge size="sm" className="text-xs">
                        {selectedProject.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-600">Priority:</span>
                      <Badge size="sm" className="text-xs">
                        {selectedProject.priority}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-600">Assigned To:</span>
                      <span className="text-xs text-gray-900">{selectedProject.assignedTo || 'Unassigned'}</span>
                    </div>
                    {selectedProject.estimatedHours && (
                      <div className="flex justify-between">
                        <span className="text-xs font-medium text-gray-600">Estimated Hours:</span>
                        <span className="text-xs text-gray-900">{selectedProject.estimatedHours}h</span>
                      </div>
                    )}
                    {selectedProject.actualHours && (
                      <div className="flex justify-between">
                        <span className="text-xs font-medium text-gray-600">Actual Hours:</span>
                        <span className="text-xs text-gray-900">{selectedProject.actualHours}h</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {selectedProject.description && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2 text-sm">Description</h4>
                  <p className="text-xs text-gray-700">{selectedProject.description}</p>
                </div>
              )}
              
              {selectedProject.requirements && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2 text-sm">Requirements</h4>
                  <p className="text-xs text-gray-700">{selectedProject.requirements}</p>
                </div>
              )}
              
              {selectedProject.tags.length > 0 && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2 text-sm">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedProject.tags.map((tag, index) => (
                      <Badge key={index} size="sm" className="text-xs px-2 py-0.5">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedProject.designFiles.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 text-sm">Design Files</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedProject.designFiles.map((file) => (
                      <div key={file.id} className="border border-gray-200 rounded-lg p-3 bg-white">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {file.type === 'image' ? (
                              <PhotoIcon className="h-4 w-4 text-blue-500" />
                            ) : file.type === 'vector' ? (
                              <DocumentTextIcon className="h-4 w-4 text-green-500" />
                            ) : (
                              <DocumentTextIcon className="h-4 w-4 text-gray-500" />
                            )}
                            <span className="text-xs font-medium text-gray-900">{file.name}</span>
                          </div>
                          <Badge size="sm" className="text-xs">
                            v{file.version}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1 mb-2">
                          <p>Size: {formatFileSize(file.size)}</p>
                          <p>Uploaded: {file.uploadedAt.toLocaleDateString()}</p>
                          {file.description && <p>Description: {file.description}</p>}
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="secondary" className="flex-1 h-7 text-xs">
                            <EyeIcon className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                          <Button size="sm" className="flex-1 h-7 text-xs">
                            <DocumentArrowDownIcon className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedProject.feedback && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <h4 className="font-medium text-gray-900 mb-2 text-sm">Feedback</h4>
                  <p className="text-xs text-yellow-800">{selectedProject.feedback}</p>
                </div>
              )}
            </div>
          )}
          
          {modalMode === 'view' && selectedTemplate && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3 text-sm">Template Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-600">Template ID:</span>
                      <span className="text-xs text-gray-900">{selectedTemplate.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-600">Category:</span>
                      <span className="text-xs text-gray-900">{selectedTemplate.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-600">Dimensions:</span>
                      <span className="text-xs text-gray-900">{selectedTemplate.dimensions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-600">Created:</span>
                      <span className="text-xs text-gray-900">{selectedTemplate.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 text-sm">Preview</h4>
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={selectedTemplate.previewUrl}
                      alt={selectedTemplate.name}
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIFByZXZpZXc8L3RleHQ+PC9zdmc+';
                      }}
                    />
                  </div>
                </div>
              </div>
              
              {selectedTemplate.tags.length > 0 && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2 text-sm">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedTemplate.tags.map((tag, index) => (
                      <Badge key={index} size="sm" className="text-xs px-2 py-0.5">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => window.open(selectedTemplate.fileUrl, '_blank')}
                  className="flex-1 h-9 bg-green-600 hover:bg-green-700 text-white border-green-600"
                >
                  <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setModalMode('template');
                  }}
                  className="flex-1 h-9 bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 hover:border-yellow-300"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit Template
                </Button>
              </div>
            </div>
          )}
          
          {(modalMode === 'create' || modalMode === 'edit') && (
            <div className="space-y-4">
              {/* Project Information Section */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <DocumentTextIcon className="h-4 w-4" />
                  Project Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    label="Order ID"
                    value={formData.orderId}
                    onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                    placeholder="e.g., ORD-001"
                    required
                    className="h-9 text-sm"
                  />
                  <Input
                    label="Job ID (Optional)"
                    value={formData.jobId}
                    onChange={(e) => setFormData({ ...formData, jobId: e.target.value })}
                    placeholder="e.g., JOB-001"
                    className="h-9 text-sm"
                  />
                  <Input
                    label="Project Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="h-9 text-sm md:col-span-2"
                  />
                </div>
              </div>

              {/* Project Details Section */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <AdjustmentsHorizontalIcon className="h-4 w-4" />
                  Project Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Select
                    label="Category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as DesignProject['category'] })}
                    options={[
                      { value: 'apparel', label: 'Apparel' },
                      { value: 'promotional', label: 'Promotional' },
                      { value: 'packaging', label: 'Packaging' },
                      { value: 'branding', label: 'Branding' },
                      { value: 'other', label: 'Other' },
                    ]}
                    required
                    className="h-9 text-sm"
                  />
                  <Select
                    label="Priority"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as DesignProject['priority'] })}
                    options={[
                      { value: 'low', label: 'Low' },
                      { value: 'medium', label: 'Medium' },
                      { value: 'high', label: 'High' },
                      { value: 'urgent', label: 'Urgent' },
                    ]}
                    required
                    className="h-9 text-sm"
                  />
                  <Input
                    label="Estimated Hours"
                    type="number"
                    value={formData.estimatedHours}
                    onChange={(e) => setFormData({ ...formData, estimatedHours: parseInt(e.target.value) || 0 })}
                    min="0"
                    className="h-9 text-sm"
                  />
                  <div className="flex items-end">
                    <Input
                      label="Tags (comma-separated)"
                      value={formData.tags.join(', ')}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean) })}
                      placeholder="e.g., t-shirt, logo, corporate, blue"
                      className="h-9 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Description & Requirements Section */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <DocumentTextIcon className="h-4 w-4" />
                  Description & Requirements
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                      placeholder="Describe the project..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Requirements
                    </label>
                    <textarea
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                      placeholder="Specify design requirements..."
                    />
                  </div>
                </div>
              </div>
              
              {/* Edit Mode Specific Fields */}
              {modalMode === 'edit' && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <PencilIcon className="h-4 w-4" />
                    Project Status & Feedback
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Select
                      label="Status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as DesignProject['status'] })}
                      options={[
                        { value: 'new', label: 'New' },
                        { value: 'in-progress', label: 'In Progress' },
                        { value: 'review', label: 'Review' },
                        { value: 'finalized', label: 'Finalized' },
                        { value: 'on-hold', label: 'On Hold' },
                        { value: 'completed', label: 'Completed' },
                        { value: 'rejected', label: 'Rejected' },
                      ]}
                      required
                      className="h-9 text-sm"
                    />
                    <div className="flex items-end">
                      <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Feedback
                        </label>
                        <textarea
                          value={formData.feedback}
                          onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                          placeholder="Add feedback or notes..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {modalMode === 'template' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Template Name"
                  value={templateFormData.name}
                  onChange={(e) => setTemplateFormData({ ...templateFormData, name: e.target.value })}
                  required
                />
                <Input
                  label="Category"
                  value={templateFormData.category}
                  onChange={(e) => setTemplateFormData({ ...templateFormData, category: e.target.value })}
                  required
                />
              </div>
              
              <Input
                label="Dimensions"
                value={templateFormData.dimensions}
                onChange={(e) => setTemplateFormData({ ...templateFormData, dimensions: e.target.value })}
                placeholder="e.g., 12 x 16 inches"
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <Input
                  value={templateFormData.tags.join(', ')}
                  onChange={(e) => setTemplateFormData({ ...templateFormData, tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean) })}
                  placeholder="e.g., t-shirt, basic, apparel"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Files
                </label>
                <div
                  className={`
                    border-2 border-dashed rounded-lg p-6 text-center transition-colors
                    ${
                      dragActive
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }
                  `}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="template-file-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Drop template files here, or{' '}
                        <span className="text-blue-600 hover:text-blue-500">browse</span>
                      </span>
                      <input
                        id="template-file-upload"
                        name="template-file-upload"
                        type="file"
                        className="sr-only"
                        multiple
                        accept=".ai,.psd,.pdf,.png,.jpg,.jpeg,.svg"
                        onChange={handleFileSelect}
                      />
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      AI, PSD, PDF, PNG, JPG, SVG up to 50MB each
                    </p>
                  </div>
                </div>
                
                {uploadFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {uploadFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {modalMode === 'upload' && (
            <div className="space-y-4">
              {/* Project Info Header */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-200 rounded-lg">
                    <CloudArrowUpIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      Upload Design Files
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">
                      Project: <span className="font-medium">{selectedProject?.title}</span>
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Order: {selectedProject?.orderId}</span>
                      <span>Status: {selectedProject?.status}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* File Upload Area */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <ArrowUpTrayIcon className="h-4 w-4 text-gray-600" />
                  <label className="text-sm font-medium text-gray-700">
                    Design Files
                  </label>
                </div>
                <div
                  className={`
                    border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
                    ${
                      dragActive
                        ? 'border-gray-400 bg-gray-100 scale-105'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-100'
                    }
                  `}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className={`mx-auto h-12 w-12 mb-3 transition-colors ${
                    dragActive ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    <ArrowUpTrayIcon className="h-full w-full" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="design-file-upload" className="cursor-pointer">
                      <span className="block text-sm font-medium text-gray-900">
                        Drop design files here, or{' '}
                        <span className="text-gray-600 hover:text-gray-700 font-semibold">browse files</span>
                      </span>
                      <input
                        id="design-file-upload"
                        name="design-file-upload"
                        type="file"
                        className="sr-only"
                        multiple
                        accept=".ai,.psd,.pdf,.png,.jpg,.jpeg,.svg,.sketch,.fig"
                        onChange={handleFileSelect}
                      />
                    </label>
                    <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                      <span>AI, PSD, PDF</span>
                      <span>•</span>
                      <span>PNG, JPG, SVG</span>
                      <span>•</span>
                      <span>Up to 100MB each</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* File List */}
              {uploadFiles.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <DocumentTextIcon className="h-4 w-4" />
                      Files to Upload ({uploadFiles.length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => setUploadFiles([])}
                      className="text-xs text-red-600 hover:text-red-700 font-medium"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {uploadFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gray-200">
                            {file.type.startsWith('image/') ? (
                              <PhotoIcon className="h-4 w-4 text-gray-600" />
                            ) : (
                              <DocumentTextIcon className="h-4 w-4 text-gray-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="bg-gray-200 px-2 py-0.5 rounded">{formatFileSize(file.size)}</span>
                              <span>{file.type || 'Unknown type'}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                          title="Remove file"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Upload Notes */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <DocumentTextIcon className="h-4 w-4 text-gray-600" />
                  <label className="text-sm font-medium text-gray-700">
                    Upload Notes (Optional)
                  </label>
                </div>
                <textarea
                  value={formData.feedback}
                  onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none bg-white"
                  placeholder="Add notes about these files, version changes, or specific instructions..."
                />
              </div>
            </div>
          )}
          
          {/* Modal Footer */}
          {modalMode !== 'view' && (
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="h-9 px-4 bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || (modalMode === 'upload' && uploadFiles.length === 0)}
                className={`min-w-[120px] h-9 px-4 ${
                  modalMode === 'create' || modalMode === 'edit'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                    : modalMode === 'upload'
                    ? 'bg-green-600 hover:bg-green-700 text-white border-green-600'
                    : 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    {modalMode === 'create' ? 'Creating...' : modalMode === 'edit' ? 'Updating...' : modalMode === 'upload' ? 'Uploading...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    {modalMode === 'create' ? 'Create Project' : modalMode === 'edit' ? 'Update Project' : modalMode === 'upload' ? 'Upload Files' : 'Save Template'}
                  </>
                )}
              </Button>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
};

export default DesignerSectionPage;