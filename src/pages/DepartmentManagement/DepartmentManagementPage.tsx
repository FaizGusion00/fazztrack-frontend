import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  XMarkIcon,
  KeyIcon,
  CogIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Select from '../../components/UI/Select';
import Modal from '../../components/UI/Modal';
import Badge from '../../components/UI/Badge';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Department {
  id: string;
  name: string;
  description: string;
  department: string;
  permissions: string[];
  userCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

const DepartmentManagementPage: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'departments' | 'users'>('departments');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'create' | 'edit'>('view');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Department | User | null>(null);

  // Form data for new/edit department
  const [departmentFormData, setDepartmentFormData] = useState({
    name: '',
    description: '',
    department: '',
    permissions: [] as string[],
    isActive: true,
  });

  // Form data for new/edit user
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    department: '',
    role: '',
    isActive: true,
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPermissions: Permission[] = [
        { id: 'clients_read', name: 'View Clients', description: 'Can view client information', category: 'Clients' },
        { id: 'clients_write', name: 'Manage Clients', description: 'Can create and edit clients', category: 'Clients' },
        { id: 'clients_delete', name: 'Delete Clients', description: 'Can delete client records', category: 'Clients' },
        { id: 'orders_read', name: 'View Orders', description: 'Can view order information', category: 'Orders' },
        { id: 'orders_write', name: 'Manage Orders', description: 'Can create and edit orders', category: 'Orders' },
        { id: 'orders_delete', name: 'Delete Orders', description: 'Can delete orders', category: 'Orders' },
        { id: 'payments_read', name: 'View Payments', description: 'Can view payment information', category: 'Payments' },
        { id: 'payments_approve', name: 'Approve Payments', description: 'Can approve payment transactions', category: 'Payments' },
        { id: 'jobs_read', name: 'View Jobs', description: 'Can view job information', category: 'Jobs' },
        { id: 'jobs_write', name: 'Manage Jobs', description: 'Can create and edit jobs', category: 'Jobs' },
        { id: 'jobs_execute', name: 'Execute Jobs', description: 'Can start/end job phases', category: 'Jobs' },
        { id: 'design_read', name: 'View Designs', description: 'Can view design projects', category: 'Design' },
        { id: 'design_write', name: 'Manage Designs', description: 'Can create and edit designs', category: 'Design' },
        { id: 'design_upload', name: 'Upload Designs', description: 'Can upload design files', category: 'Design' },
        { id: 'products_read', name: 'View Products', description: 'Can view product catalog', category: 'Products' },
        { id: 'products_write', name: 'Manage Products', description: 'Can create and edit products', category: 'Products' },
        { id: 'products_delete', name: 'Delete Products', description: 'Can delete products', category: 'Products' },
        { id: 'qr_scan', name: 'QR Scanning', description: 'Can scan QR codes for jobs', category: 'QR Scanner' },
        { id: 'due_dates_read', name: 'View Due Dates', description: 'Can view due date alerts', category: 'Due Dates' },
        { id: 'due_dates_write', name: 'Manage Due Dates', description: 'Can acknowledge alerts', category: 'Due Dates' },
        { id: 'departments_read', name: 'View Departments', description: 'Can view department information', category: 'Department Management' },
        { id: 'departments_write', name: 'Manage Departments', description: 'Can create and edit departments', category: 'Department Management' },
        { id: 'users_read', name: 'View Users', description: 'Can view user information', category: 'User Management' },
        { id: 'users_write', name: 'Manage Users', description: 'Can create and edit users', category: 'User Management' },
      ];
      
      const mockDepartments: Department[] = [
        {
          id: 'dept-001',
          name: 'Super Administrator',
          description: 'Full system access with all permissions',
          department: 'Administration',
          permissions: mockPermissions.map(p => p.id),
          userCount: 2,
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-12-18'),
        },
        {
          id: 'dept-002',
          name: 'Administrator',
          description: 'Administrative access with payment approval rights',
          department: 'Administration',
          permissions: [
            'clients_read', 'clients_write', 'orders_read', 'payments_read', 'payments_approve',
            'jobs_read', 'products_read', 'due_dates_read', 'due_dates_write', 'users_read'
          ],
          userCount: 3,
          isActive: true,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-12-15'),
        },
        {
          id: 'dept-003',
          name: 'Sales Manager',
          description: 'Sales operations and order management',
          department: 'Sales',
          permissions: [
            'clients_read', 'clients_write', 'orders_read', 'orders_write', 'orders_delete',
            'jobs_read', 'jobs_write', 'products_read', 'due_dates_read'
          ],
          userCount: 4,
          isActive: true,
          createdAt: new Date('2024-02-01'),
          updatedAt: new Date('2024-12-10'),
        },
        {
          id: 'dept-004',
          name: 'Designer',
          description: 'Design creation and management',
          department: 'Design',
          permissions: [
            'orders_read', 'jobs_read', 'design_read', 'design_write', 'design_upload',
            'products_read', 'due_dates_read'
          ],
          userCount: 5,
          isActive: true,
          createdAt: new Date('2024-02-15'),
          updatedAt: new Date('2024-12-05'),
        },
        {
          id: 'dept-005',
          name: 'Production Staff',
          description: 'Production job execution',
          department: 'Production',
          permissions: [
            'jobs_read', 'jobs_execute', 'qr_scan', 'due_dates_read'
          ],
          userCount: 8,
          isActive: true,
          createdAt: new Date('2024-03-01'),
          updatedAt: new Date('2024-11-30'),
        },
        {
          id: 'dept-006',
          name: 'Quality Control',
          description: 'Quality assurance and final inspection',
          department: 'Production',
          permissions: [
            'jobs_read', 'jobs_execute', 'qr_scan', 'products_read'
          ],
          userCount: 2,
          isActive: true,
          createdAt: new Date('2024-03-15'),
          updatedAt: new Date('2024-11-20'),
        },
      ];
      
      const mockUsers: User[] = [
        {
          id: 'user-001',
          name: 'John Admin',
          email: 'john.admin@fazzprint.com',
          department: 'Administration',
          role: 'Super Administrator',
          isActive: true,
          lastLogin: new Date('2024-12-18T10:30:00'),
          createdAt: new Date('2024-01-01'),
        },
        {
          id: 'user-002',
          name: 'Sarah Manager',
          email: 'sarah.manager@fazzprint.com',
          department: 'Sales',
          role: 'Sales Manager',
          isActive: true,
          lastLogin: new Date('2024-12-17T15:45:00'),
          createdAt: new Date('2024-02-01'),
        },
        {
          id: 'user-003',
          name: 'Mike Designer',
          email: 'mike.designer@fazzprint.com',
          department: 'Design',
          role: 'Designer',
          isActive: true,
          lastLogin: new Date('2024-12-18T09:15:00'),
          createdAt: new Date('2024-02-15'),
        },
        {
          id: 'user-004',
          name: 'Lisa Production',
          email: 'lisa.production@fazzprint.com',
          department: 'Production',
          role: 'Production Staff',
          isActive: true,
          lastLogin: new Date('2024-12-18T08:00:00'),
          createdAt: new Date('2024-03-01'),
        },
        {
          id: 'user-005',
          name: 'Tom QC',
          email: 'tom.qc@fazzprint.com',
          department: 'Production',
          role: 'Quality Control',
          isActive: false,
          lastLogin: new Date('2024-12-10T14:20:00'),
          createdAt: new Date('2024-03-15'),
        },
      ];
      
      setPermissions(mockPermissions);
      setDepartments(mockDepartments);
      setUsers(mockUsers);
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredDepartments = departments.filter(department => {
    const matchesSearch = 
      department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === 'all' || department.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === 'all' || user.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

  const handleOpenDepartmentModal = (mode: 'view' | 'create' | 'edit', department?: Department) => {
    setModalMode(mode);
    if (mode === 'create') {
      setDepartmentFormData({
        name: '',
        description: '',
        department: '',
        permissions: [],
        isActive: true,
      });
    } else if (department) {
      setSelectedDepartment(department);
      if (mode === 'edit') {
        setDepartmentFormData({
          name: department.name,
          description: department.description,
          department: department.department,
          permissions: department.permissions,
          isActive: department.isActive,
        });
      }
    }
    setIsDepartmentModalOpen(true);
  };

  const handleOpenUserModal = (mode: 'view' | 'create' | 'edit', user?: User) => {
    setModalMode(mode);
    if (mode === 'create') {
      setUserFormData({
        name: '',
        email: '',
        department: '',
        role: '',
        isActive: true,
      });
    } else if (user) {
      setSelectedUser(user);
      if (mode === 'edit') {
        setUserFormData({
          name: user.name,
          email: user.email,
          department: user.department,
          role: user.role,
          isActive: user.isActive,
        });
      }
    }
    setIsUserModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDepartmentModalOpen(false);
    setIsUserModalOpen(false);
    setSelectedDepartment(null);
    setSelectedUser(null);
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleDepartmentInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDepartmentFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePermissionToggle = (permissionId: string) => {
    setDepartmentFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const handleDepartmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (modalMode === 'create') {
        const newDepartment: Department = {
          id: `dept-${String(departments.length + 1).padStart(3, '0')}`,
          name: departmentFormData.name,
          description: departmentFormData.description,
          department: departmentFormData.department,
          permissions: departmentFormData.permissions,
          userCount: 0,
          isActive: departmentFormData.isActive,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        setDepartments(prev => [...prev, newDepartment]);
      } else if (selectedDepartment) {
        setDepartments(prev => prev.map(department => 
          department.id === selectedDepartment.id 
            ? {
                ...department,
                name: departmentFormData.name,
                description: departmentFormData.description,
                department: departmentFormData.department,
                permissions: departmentFormData.permissions,
                isActive: departmentFormData.isActive,
                updatedAt: new Date(),
              }
            : department
        ));
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error saving department:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (modalMode === 'create') {
        const newUser: User = {
          id: `user-${String(users.length + 1).padStart(3, '0')}`,
          name: userFormData.name,
          email: userFormData.email,
          department: userFormData.department,
          role: userFormData.role,
          isActive: userFormData.isActive,
          createdAt: new Date(),
        };
        
        setUsers(prev => [...prev, newUser]);
      } else if (selectedUser) {
        setUsers(prev => prev.map(user => 
          user.id === selectedUser.id 
            ? {
                ...user,
                name: userFormData.name,
                email: userFormData.email,
                department: userFormData.department,
                role: userFormData.role,
                isActive: userFormData.isActive,
              }
            : user
        ));
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if ('permissions' in itemToDelete) {
        // It's a department
        setDepartments(prev => prev.filter(dept => dept.id !== itemToDelete.id));
      } else {
        // It's a user
        setUsers(prev => prev.filter(user => user.id !== itemToDelete.id));
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'success' : 'danger';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Active' : 'Inactive';
  };

  const departmentsList = Array.from(new Set(departments.map(d => d.department)));
  
  const canManageDepartments = hasPermission('manage_departments');
  const canManageUsers = hasPermission('manage_users');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Department Management</h1>
          <p className="text-gray-600 mt-2">
            Manage departments, roles, and user permissions
          </p>
        </div>
        {canManageDepartments && (
          <Button
            onClick={() => handleOpenDepartmentModal('create')}
            className="mt-4 sm:mt-0"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Department
          </Button>
        )}
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <Card.Body>
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('departments')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === 'departments'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Departments ({departments.length})
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === 'users'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-900'
                }`}
              >
                Users ({users.length})
              </button>
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
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<MagnifyingGlassIcon />}
                />
              </div>
              <div className="w-full lg:w-48">
                <Select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Departments' },
                    ...departmentsList.map(dept => ({ value: dept, label: dept }))
                  ]}
                />
              </div>
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      {/* Content */}
      {activeTab === 'departments' ? (
        <div className="space-y-4">
          {filteredDepartments.map((department, index) => (
            <motion.div
              key={department.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card hover>
                <Card.Body>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <UserGroupIcon className="h-6 w-6 text-primary-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {department.name}
                          </h3>
                          <Badge variant={getStatusColor(department.isActive) as any} size="sm">
                            {getStatusText(department.isActive)}
                          </Badge>
                        </div>
                        <p className="text-gray-600">{department.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>Department: {department.department}</span>
                          <span>Users: {department.userCount}</span>
                          <span>Permissions: {department.permissions.length}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDepartmentModal('view', department)}
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      
                      {canManageDepartments && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDepartmentModal('edit', department)}
                          >
                            <PencilIcon className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setItemToDelete(department);
                              setShowDeleteModal(true);
                            }}
                          >
                            <TrashIcon className="h-4 w-4 text-danger-500" />
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
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card hover>
                <Card.Body>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {user.name}
                          </h3>
                          <Badge variant={getStatusColor(user.isActive) as any} size="sm">
                            {getStatusText(user.isActive)}
                          </Badge>
                        </div>
                        <p className="text-gray-600">{user.email}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>Department: {user.department}</span>
                          <span>Role: {user.role}</span>
                          {user.lastLogin && (
                            <span>Last Login: {user.lastLogin.toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenUserModal('view', user)}
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      
                      {canManageUsers && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenUserModal('edit', user)}
                          >
                            <PencilIcon className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setItemToDelete(user);
                              setShowDeleteModal(true);
                            }}
                          >
                            <TrashIcon className="h-4 w-4 text-danger-500" />
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
      )}

      {/* Department Modal */}
      <Modal
        isOpen={isDepartmentModalOpen}
        onClose={handleCloseModal}
        size="xl"
      >
        {modalMode === 'view' && selectedDepartment ? (
          <>
            <Modal.Header>
              <h3 className="text-lg font-semibold">
                Department Details - {selectedDepartment.name}
              </h3>
            </Modal.Header>
            <Modal.Body>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Name</label>
                    <p className="text-gray-900">{selectedDepartment.name}</p>
                  </div>
                  <div>
                    <label className="form-label">Department</label>
                    <p className="text-gray-900">{selectedDepartment.department}</p>
                  </div>
                  <div>
                    <label className="form-label">Status</label>
                    <Badge variant={getStatusColor(selectedDepartment.isActive) as any}>
                      {getStatusText(selectedDepartment.isActive)}
                    </Badge>
                  </div>
                  <div>
                    <label className="form-label">Users</label>
                    <p className="text-gray-900">{selectedDepartment.userCount}</p>
                  </div>
                </div>
                
                <div>
                  <label className="form-label">Description</label>
                  <p className="text-gray-900">{selectedDepartment.description}</p>
                </div>
                
                <div>
                  <label className="form-label">Permissions ({selectedDepartment.permissions.length})</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    {selectedDepartment.permissions.map(permissionId => {
                      const permission = permissions.find(p => p.id === permissionId);
                      return permission ? (
                        <div key={permissionId} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                          <CheckIcon className="h-4 w-4 text-success-500" />
                          <span className="text-sm text-gray-700">{permission.name}</span>
                        </div>
                      ) : null;
                    })}
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
        ) : (
          <form onSubmit={handleDepartmentSubmit}>
            <Modal.Header>
              <h3 className="text-lg font-semibold">
                {modalMode === 'create' ? 'Add New Department' : 'Edit Department'}
              </h3>
            </Modal.Header>
            
            <Modal.Body>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Name"
                    name="name"
                    value={departmentFormData.name}
                    onChange={handleDepartmentInputChange}
                    placeholder="Enter department name"
                    required
                  />
                  
                  <Input
                    label="Department"
                    name="department"
                    value={departmentFormData.department}
                    onChange={handleDepartmentInputChange}
                    placeholder="Enter department"
                    required
                  />
                </div>
                
                <div>
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    value={departmentFormData.description}
                    onChange={handleDepartmentInputChange}
                    rows={3}
                    className="input"
                    placeholder="Enter department description..."
                    required
                  />
                </div>
                
                <div>
                  <label className="form-label">Permissions</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 max-h-60 overflow-y-auto">
                    {permissions.map(permission => (
                      <label key={permission.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={departmentFormData.permissions.includes(permission.id)}
                          onChange={() => handlePermissionToggle(permission.id)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">{permission.name}</span>
                          <p className="text-xs text-gray-500">{permission.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={departmentFormData.isActive}
                      onChange={(e) => setDepartmentFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
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
                  {modalMode === 'create' ? 'Add Department' : 'Update Department'}
                </Button>
              </div>
            </Modal.Footer>
          </form>
        )}
      </Modal>

      {/* User Modal */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={handleCloseModal}
        size="lg"
      >
        {modalMode === 'view' && selectedUser ? (
          <>
            <Modal.Header>
              <h3 className="text-lg font-semibold">
                User Details - {selectedUser.name}
              </h3>
            </Modal.Header>
            <Modal.Body>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Name</label>
                    <p className="text-gray-900">{selectedUser.name}</p>
                  </div>
                  <div>
                    <label className="form-label">Email</label>
                    <p className="text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="form-label">Department</label>
                    <p className="text-gray-900">{selectedUser.department}</p>
                  </div>
                  <div>
                    <label className="form-label">Role</label>
                    <p className="text-gray-900">{selectedUser.role}</p>
                  </div>
                  <div>
                    <label className="form-label">Status</label>
                    <Badge variant={getStatusColor(selectedUser.isActive) as any}>
                      {getStatusText(selectedUser.isActive)}
                    </Badge>
                  </div>
                  {selectedUser.lastLogin && (
                    <div>
                      <label className="form-label">Last Login</label>
                      <p className="text-gray-900">{selectedUser.lastLogin.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="ghost" onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </>
        ) : (
          <form onSubmit={handleUserSubmit}>
            <Modal.Header>
              <h3 className="text-lg font-semibold">
                {modalMode === 'create' ? 'Add New User' : 'Edit User'}
              </h3>
            </Modal.Header>
            
            <Modal.Body>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Name"
                    name="name"
                    value={userFormData.name}
                    onChange={handleUserInputChange}
                    placeholder="Enter user name"
                    required
                  />
                  
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={userFormData.email}
                    onChange={handleUserInputChange}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Department"
                    name="department"
                    value={userFormData.department}
                    onChange={handleUserInputChange}
                    options={[
                      { value: '', label: 'Select Department' },
                      ...departmentsList.map(dept => ({ value: dept, label: dept }))
                    ]}
                    required
                  />
                  
                  <Select
                    label="Role"
                    name="role"
                    value={userFormData.role}
                    onChange={handleUserInputChange}
                    options={[
                      { value: '', label: 'Select Role' },
                      ...departments.map(dept => ({ value: dept.name, label: dept.name }))
                    ]}
                    required
                  />
                </div>
                
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={userFormData.isActive}
                      onChange={(e) => setUserFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
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
                  {modalMode === 'create' ? 'Add User' : 'Update User'}
                </Button>
              </div>
            </Modal.Footer>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={handleCloseModal}
        size="md"
      >
        <Modal.Header>
          <h3 className="text-lg font-semibold text-danger-600">
            Delete {itemToDelete && 'permissions' in itemToDelete ? 'Department' : 'User'}
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <ExclamationTriangleIcon className="h-12 w-12 text-danger-500" />
              <div>
                <p className="text-gray-900">
                  Are you sure you want to delete{' '}
                  <strong>
                    {itemToDelete && 'permissions' in itemToDelete 
                      ? itemToDelete.name 
                      : itemToDelete?.name}
                  </strong>?
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex space-x-3">
            <Button
              variant="ghost"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={isSubmitting}
            >
              Delete {itemToDelete && 'permissions' in itemToDelete ? 'Department' : 'User'}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DepartmentManagementPage; 