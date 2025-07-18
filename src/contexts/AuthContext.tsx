import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Department, Role } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  canAccess: (departments: Department[], roles?: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Mock user data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Super Admin',
    email: 'superadmin@fazztrack.com',
    department: 'superadmin',
    role: 'superadmin',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@fazztrack.com',
    department: 'admin',
    role: 'admin',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Sales Manager',
    email: 'sales@fazztrack.com',
    department: 'sales_manager',
    role: 'sales_manager',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'Designer',
    email: 'designer@fazztrack.com',
    department: 'designer',
    role: 'designer',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    name: 'Print Staff',
    email: 'print@fazztrack.com',
    department: 'production_staff',
    role: 'print',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '6',
    name: 'Press Staff',
    email: 'press@fazztrack.com',
    department: 'production_staff',
    role: 'press',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '7',
    name: 'Cut Staff',
    email: 'cut@fazztrack.com',
    department: 'production_staff',
    role: 'cut',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '8',
    name: 'Sew Staff',
    email: 'sew@fazztrack.com',
    department: 'production_staff',
    role: 'sew',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '9',
    name: 'QC Staff',
    email: 'qc@fazztrack.com',
    department: 'production_staff',
    role: 'qc',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '10',
    name: 'Iron/Packing Staff',
    email: 'iron@fazztrack.com',
    department: 'production_staff',
    role: 'iron_packing',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// Role-based permissions
const rolePermissions: Record<Role, string[]> = {
  superadmin: ['*'], // All permissions
  admin: [
    'view_dashboard',
    'view_orders',
    'view_clients',
    'view_payments',
    'approve_payments',
    'view_jobs',
    'view_products',
    'view_due_dates',
    'view_tracking',
  ],
  sales_manager: [
    'view_dashboard',
    'view_orders',
    'create_orders',
    'edit_orders',
    'view_clients',
    'create_clients',
    'edit_clients',
    'view_jobs',
    'create_jobs',
    'edit_jobs',
    'view_products',
    'view_due_dates',
    'view_tracking',
  ],
  designer: [
    'view_dashboard',
    'view_orders',
    'view_jobs',
    'edit_design_jobs',
    'upload_designs',
    'view_due_dates',
  ],
  print: [
    'view_dashboard',
    'view_jobs',
    'scan_qr',
    'start_end_jobs',
  ],
  press: [
    'view_dashboard',
    'view_jobs',
    'scan_qr',
    'start_end_jobs',
  ],
  cut: [
    'view_dashboard',
    'view_jobs',
    'scan_qr',
    'start_end_jobs',
  ],
  sew: [
    'view_dashboard',
    'view_jobs',
    'scan_qr',
    'start_end_jobs',
  ],
  qc: [
    'view_dashboard',
    'view_jobs',
    'scan_qr',
    'start_end_jobs',
  ],
  iron_packing: [
    'view_dashboard',
    'view_jobs',
    'scan_qr',
    'start_end_jobs',
  ],
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored authentication
    const storedUser = localStorage.getItem('fazztrack_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('fazztrack_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user by email (mock authentication)
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (!foundUser) {
      setIsLoading(false);
      throw new Error('Invalid email or password');
    }
    
    // In a real app, you would validate the password here
    if (password !== 'password123') {
      setIsLoading(false);
      throw new Error('Invalid email or password');
    }
    
    setUser(foundUser);
    localStorage.setItem('fazztrack_user', JSON.stringify(foundUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fazztrack_user');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    const userPermissions = rolePermissions[user.role] || [];
    return userPermissions.includes('*') || userPermissions.includes(permission);
  };

  const canAccess = (departments: Department[], roles?: Role[]): boolean => {
    if (!user) return false;
    
    const hasDepartmentAccess = departments.includes(user.department);
    const hasRoleAccess = roles ? roles.includes(user.role) : true;
    
    return hasDepartmentAccess && hasRoleAccess;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasPermission,
    canAccess,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};