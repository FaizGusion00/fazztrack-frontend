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

interface Role {
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

const RoleManagementPage: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'roles' | 'users'>('roles');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'create' | 'edit'>('view');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Role | User | null>(null);

  // Form data for new/edit role
  const [roleFormData, setRoleFormData] = useState({
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
        { id: 'roles_read', name: 'View Roles', description: 'Can view role information', category: 'Role Management' },
        { id: 'roles_write', name: 'Manage Roles', description: 'Can create and edit roles', category: 'Role Management' },
        { id: 'users_read', name: 'View Users', description: 'Can view user information', category: 'User Management' },
        { id: 'users_write', name: 'Manage Users', description: 'Can create and edit users', category: 'User Management' },
      ];
      
      const mockRoles: Role[] = [
        {
          id: 'role-001',
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
          id: 'role-002',
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
          id: 'role-003',
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
          id: 'role-004',
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
          id: 'role-005',
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
          id: 'role-006',
          name: 'Quality Control',
          description: 'Quality assurance and final inspection',
          department: 'Production',
          permissions: [
            'jobs_read', 'jobs_execute', 'qr_scan', 'products_read'
          ],
          userCount: 2,
          isActive: true,
          createdAt: new Date('2024-03-15'),
          updatedAt: new Date('2024-11-25'),
        },
      ];
      
      const mockUsers: User[] = [
        {
          id: 'user-001',
          name: 'John Smith',
          email: 'john.smith@fazztrack.com',
          department: 'Administration',
          role: 'Super Administrator',
          isActive: true,
          lastLogin: new Date('2024-12-18'),
          createdAt: new Date('2024-01-01'),
        },
        {
          id: 'user-002',
          name: 'Sarah Wilson',
          email: 'sarah.wilson@fazztrack.com',
          department: 'Design',
          role: 'Designer',
          isActive: true,
          lastLogin: new Date('2024-12-17'),
          createdAt: new Date('2024-02-15'),
        },
        {
          id: 'user-003',
          name: 'Mike Johnson',
          email: 'mike.johnson@fazztrack.com',
          department: 'Production',
          role: 'Production Staff',
          isActive: true,
          lastLogin: new Date('2024-12-18'),
          createdAt: new Date('2024-03-01'),
        },
        {
          id: 'user-004',
          name: 'Emily Chen',
          email: 'emily.chen@fazztrack.com',
          department: 'Sales',
          role: 'Sales Manager',
          isActive: true,
          lastLogin: new Date('2024-12-16'),
          createdAt: new Date('2024-02-01'),
        },
        {
          id: 'user-005',
          name: 'David Brown',
          email: 'david.brown@fazztrack.com',
          department: 'Administration',
          role: 'Administrator',
          isActive: true,
          lastLogin: new Date('2024-12-15'),
          createdAt: new Date('2024-01-15'),
        },
        {
          id: 'user-006',
          name: 'Lisa Park',
          email: 'lisa.park@fazztrack.com',
          department: 'Production',
          role: 'Quality Control',
          isActive: false,
          lastLogin: new Date('2024-12-10'),
          createdAt: new Date('2024-03-15'),
        },
      ];
      
      setPermissions(mockPermissions);
      setRoles(mockRoles);
      setUsers(mockUsers);
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredRoles = roles.filter(role => {
    const matchesSearch = 
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === 'all' || role.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === 'all' || user.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

  const handleOpenRoleModal = (mode: 'view' | 'create' | 'edit', role?: Role) => {
    setModalMode(mode);
    if (mode === 'create') {
      setRoleFormData({
        name: '',
        description: '',
        department: '',
        permissions: [],
        isActive: true,
      });
    } else if (role) {
      setSelectedRole(role);
      if (mode === 'edit') {
        setRoleFormData({
          name: role.name,
          description: role.description,
          department: role.department,
          permissions: [...role.permissions],
          isActive: role.isActive,
        });
      }
    }
    setIsRoleModalOpen(true);
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
    setIsRoleModalOpen(false);
    setIsUserModalOpen(false);
    setSelectedRole(null);
    setSelectedUser(null);
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleRoleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setRoleFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setRoleFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setUserFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setUserFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePermissionToggle = (permissionId: string) => {
    setRoleFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const handleRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (modalMode === 'create') {
        const newRole: Role = {
          id: `role-${String(roles.length + 1).padStart(3, '0')}`,
          name: roleFormData.name,
          description: roleFormData.description,
          department: roleFormData.department,
          permissions: roleFormData.permissions,
          userCount: 0,
          isActive: roleFormData.isActive,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        setRoles(prev => [...prev, newRole]);
      } else if (modalMode === 'edit' && selectedRole) {
        setRoles(prev => prev.map(role => 
          role.id === selectedRole.id 
            ? {
                ...role,
                name: roleFormData.name,
                description: roleFormData.description,
                department: roleFormData.department,
                permissions: roleFormData.permissions,
                isActive: roleFormData.isActive,
                updatedAt: new Date(),
              }
            : role
        ));
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error saving role:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
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
        
        // Update role user count
        setRoles(prev => prev.map(role => 
          role.name === userFormData.role 
            ? { ...role, userCount: role.userCount + 1 }
            : role
        ));
      } else if (modalMode === 'edit' && selectedUser) {
        const oldRole = selectedUser.role;
        const newRole = userFormData.role;
        
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
        
        // Update role user counts if role changed
        if (oldRole !== newRole) {
          setRoles(prev => prev.map(role => {
            if (role.name === oldRole) {
              return { ...role, userCount: role.userCount - 1 };
            } else if (role.name === newRole) {
              return { ...role, userCount: role.userCount + 1 };
            }
            return role;
          }));
        }
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if ('permissions' in itemToDelete) {
        // Deleting a role
        setRoles(prev => prev.filter(role => role.id !== itemToDelete.id));
      } else {
        // Deleting a user
        setUsers(prev => prev.filter(user => user.id !== itemToDelete.id));
        // Update role user count
        setRoles(prev => prev.map(role => 
          role.name === (itemToDelete as User).role 
            ? { ...role, userCount: role.userCount - 1 }
            : role
        ));
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const departments = Array.from(new Set([...roles.map(r => r.department), ...users.map(u => u.department)]));
  const permissionCategories = Array.from(new Set(permissions.map(p => p.category)));
  
  const canCreateRole = hasPermission('create_roles');
  const canEditRole = hasPermission('edit_roles');
  const canDeleteRole = hasPermission('delete_roles');
  const canCreateUser = hasPermission('create_users');
  const canEditUser = hasPermission('edit_users');
  const canDeleteUser = hasPermission('delete_users');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  const totalRoles = roles.length;
  const activeRoles = roles.filter(r => r.isActive).length;
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.isActive).length;

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
          <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
          <p className="text-gray-600 mt-2">
            Manage user roles, permissions, and access control
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          {canCreateUser && (
            <Button
              onClick={() => handleOpenUserModal('create')}
              variant="ghost"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add User
            </Button>
          )}
          {canCreateRole && (
            <Button
              onClick={() => handleOpenRoleModal('create')}
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Role
            </Button>
          )}
        </div>
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
                <ShieldCheckIcon className="h-8 w-8 text-primary-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Roles</p>
                <p className="text-2xl font-bold text-gray-900">{totalRoles}</p>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckIcon className="h-8 w-8 text-success-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Roles</p>
                <p className="text-2xl font-bold text-gray-900">{activeRoles}</p>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-8 w-8 text-primary-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckIcon className="h-8 w-8 text-success-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('roles')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'roles'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ShieldCheckIcon className="h-5 w-5 inline mr-2" />
              Roles
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <UserGroupIcon className="h-5 w-5 inline mr-2" />
              Users
            </button>
          </nav>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
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
                    ...departments.map(dept => ({ value: dept, label: dept }))
                  ]}
                />
              </div>
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      {/* Content */}
      {activeTab === 'roles' ? (
        // Roles Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card hover className="h-full">
                <Card.Body>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {role.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {role.description}
                        </p>
                      </div>
                      <Badge
                        variant={role.isActive ? 'success' : 'secondary'}
                        size="sm"
                      >
                        {role.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Department:</span>
                        <span className="font-medium text-gray-900">{role.department}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Users:</span>
                        <span className="font-medium text-gray-900">{role.userCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Permissions:</span>
                        <span className="font-medium text-gray-900">{role.permissions.length}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenRoleModal('view', role)}
                        className="flex-1"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      
                      {canEditRole && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenRoleModal('edit', role)}
                          className="flex-1"
                        >
                          <PencilIcon className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      )}
                      
                      {canDeleteRole && role.userCount === 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setItemToDelete(role);
                            setShowDeleteModal(true);
                          }}
                        >
                          <TrashIcon className="h-4 w-4 text-danger-500" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        // Users Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card hover className="h-full">
                <Card.Body>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {user.email}
                        </p>
                      </div>
                      <Badge
                        variant={user.isActive ? 'success' : 'secondary'}
                        size="sm"
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Department:</span>
                        <span className="font-medium text-gray-900">{user.department}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Role:</span>
                        <span className="font-medium text-gray-900">{user.role}</span>
                      </div>
                      {user.lastLogin && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Last Login:</span>
                          <span className="font-medium text-gray-900">
                            {user.lastLogin.toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenUserModal('view', user)}
                        className="flex-1"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      
                      {canEditUser && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenUserModal('edit', user)}
                          className="flex-1"
                        >
                          <PencilIcon className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      )}
                      
                      {canDeleteUser && (
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
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {((activeTab === 'roles' && filteredRoles.length === 0) || 
        (activeTab === 'users' && filteredUsers.length === 0)) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          {activeTab === 'roles' ? (
            <ShieldCheckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          ) : (
            <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          )}
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {activeTab} found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search criteria.' : `Get started by adding your first ${activeTab.slice(0, -1)}.`}
          </p>
          {!searchTerm && (
            <Button
              onClick={() => activeTab === 'roles' ? handleOpenRoleModal('create') : handleOpenUserModal('create')}
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add {activeTab === 'roles' ? 'Role' : 'User'}
            </Button>
          )}
        </motion.div>
      )}

      {/* Role Modal */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={handleCloseModal}
        size="xl"
      >
        {modalMode === 'view' && selectedRole ? (
          // View Role Mode
          <>
            <Modal.Header>
              <div className="flex items-center space-x-3">
                <ShieldCheckIcon className="h-6 w-6 text-primary-500" />
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedRole.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedRole.department} Department
                  </p>
                </div>
              </div>
            </Modal.Header>
            <Modal.Body>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Status</label>
                    <Badge variant={selectedRole.isActive ? 'success' : 'secondary'}>
                      {selectedRole.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div>
                    <label className="form-label">Users Assigned</label>
                    <p className="text-gray-900 font-semibold">{selectedRole.userCount}</p>
                  </div>
                </div>
                
                <div>
                  <label className="form-label">Description</label>
                  <p className="text-gray-900">{selectedRole.description}</p>
                </div>
                
                <div>
                  <label className="form-label">Permissions ({selectedRole.permissions.length})</label>
                  <div className="space-y-4">
                    {permissionCategories.map(category => {
                      const categoryPermissions = permissions.filter(p => 
                        p.category === category && selectedRole.permissions.includes(p.id)
                      );
                      
                      if (categoryPermissions.length === 0) return null;
                      
                      return (
                        <div key={category} className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-3">{category}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {categoryPermissions.map(permission => (
                              <div key={permission.id} className="flex items-center space-x-2">
                                <CheckIcon className="h-4 w-4 text-success-500" />
                                <span className="text-sm text-gray-700">{permission.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
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
          // Create/Edit Role Mode
          <form onSubmit={handleRoleSubmit}>
            <Modal.Header>
              <h3 className="text-lg font-semibold">
                {modalMode === 'create' ? 'Create New Role' : 'Edit Role'}
              </h3>
            </Modal.Header>
            
            <Modal.Body>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Role Name"
                    name="name"
                    value={roleFormData.name}
                    onChange={handleRoleInputChange}
                    placeholder="Enter role name"
                    required
                  />
                  
                  <Select
                    label="Department"
                    name="department"
                    value={roleFormData.department}
                    onChange={handleRoleInputChange}
                    options={[
                      { value: '', label: 'Select Department' },
                      ...departments.map(dept => ({ value: dept, label: dept }))
                    ]}
                    required
                  />
                </div>
                
                <div>
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    value={roleFormData.description}
                    onChange={handleRoleInputChange}
                    rows={3}
                    className="input"
                    placeholder="Enter role description..."
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={roleFormData.isActive}
                    onChange={handleRoleInputChange}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Active Role
                  </label>
                </div>
                
                <div>
                  <label className="form-label">Permissions</label>
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {permissionCategories.map(category => {
                      const categoryPermissions = permissions.filter(p => p.category === category);
                      
                      return (
                        <div key={category} className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-3">{category}</h4>
                          <div className="space-y-2">
                            {categoryPermissions.map(permission => (
                              <div key={permission.id} className="flex items-start space-x-3">
                                <input
                                  type="checkbox"
                                  id={permission.id}
                                  checked={roleFormData.permissions.includes(permission.id)}
                                  onChange={() => handlePermissionToggle(permission.id)}
                                  className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                <div className="flex-1">
                                  <label htmlFor={permission.id} className="text-sm font-medium text-gray-700">
                                    {permission.name}
                                  </label>
                                  <p className="text-xs text-gray-500">{permission.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
                  {modalMode === 'create' ? 'Create Role' : 'Update Role'}
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
          // View User Mode
          <>
            <Modal.Header>
              <div className="flex items-center space-x-3">
                <UserGroupIcon className="h-6 w-6 text-primary-500" />
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedUser.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedUser.email}
                  </p>
                </div>
              </div>
            </Modal.Header>
            <Modal.Body>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Status</label>
                    <Badge variant={selectedUser.isActive ? 'success' : 'secondary'}>
                      {selectedUser.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div>
                    <label className="form-label">Department</label>
                    <p className="text-gray-900">{selectedUser.department}</p>
                  </div>
                  <div>
                    <label className="form-label">Role</label>
                    <p className="text-gray-900">{selectedUser.role}</p>
                  </div>
                  {selectedUser.lastLogin && (
                    <div>
                      <label className="form-label">Last Login</label>
                      <p className="text-gray-900">{selectedUser.lastLogin.toLocaleString()}</p>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Created</label>
                    <p className="text-gray-900">{selectedUser.createdAt.toLocaleDateString()}</p>
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
          // Create/Edit User Mode
          <form onSubmit={handleUserSubmit}>
            <Modal.Header>
              <h3 className="text-lg font-semibold">
                {modalMode === 'create' ? 'Create New User' : 'Edit User'}
              </h3>
            </Modal.Header>
            
            <Modal.Body>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    name="name"
                    value={userFormData.name}
                    onChange={handleUserInputChange}
                    placeholder="Enter full name"
                    required
                  />
                  
                  <Input
                    label="Email Address"
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
                      ...departments.map(dept => ({ value: dept, label: dept }))
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
                      ...roles
                        .filter(role => role.isActive && (userFormData.department === '' || role.department === userFormData.department))
                        .map(role => ({ value: role.name, label: role.name }))
                    ]}
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="userIsActive"
                    name="isActive"
                    checked={userFormData.isActive}
                    onChange={handleUserInputChange}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="userIsActive" className="text-sm font-medium text-gray-700">
                    Active User
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
                  {modalMode === 'create' ? 'Create User' : 'Update User'}
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
            Delete {itemToDelete && 'permissions' in itemToDelete ? 'Role' : 'User'}
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <ExclamationTriangleIcon className="h-12 w-12 text-danger-500" />
              <div>
                <p className="text-gray-900">
                  Are you sure you want to delete <strong>{itemToDelete?.name}</strong>?
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
              Delete {itemToDelete && 'permissions' in itemToDelete ? 'Role' : 'User'}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RoleManagementPage;