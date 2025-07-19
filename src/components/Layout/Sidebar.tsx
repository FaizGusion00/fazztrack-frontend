import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  BriefcaseIcon,
  PaintBrushIcon,
  CubeIcon,
  QrCodeIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  XMarkIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { Department, Role } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  departments: Department[];
  roles?: Role[];
  permission?: string;
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    departments: ['superadmin', 'admin', 'sales_manager', 'designer', 'production_staff'],
    permission: 'view_dashboard',
  },
  {
    name: 'Clients',
    href: '/clients',
    icon: UsersIcon,
    departments: ['superadmin', 'admin', 'sales_manager'],
    permission: 'view_clients',
  },
  {
    name: 'Orders',
    href: '/orders',
    icon: ClipboardDocumentListIcon,
    departments: ['superadmin', 'admin', 'sales_manager', 'designer'],
    permission: 'view_orders',
  },
  {
    name: 'Delivery Tracking',
    href: '/delivery-tracking',
    icon: TruckIcon,
    departments: ['superadmin', 'admin', 'sales_manager', 'production_staff'],
    permission: 'view_delivery_tracking',
  },
  {
    name: 'Payments',
    href: '/payments',
    icon: CreditCardIcon,
    departments: ['superadmin', 'admin', 'sales_manager'],
    permission: 'view_payments',
  },
  {
    name: 'Jobs',
    href: '/jobs',
    icon: BriefcaseIcon,
    departments: ['superadmin', 'admin', 'sales_manager', 'designer', 'production_staff'],
    permission: 'view_jobs',
  },
  {
    name: 'Design',
    href: '/design',
    icon: PaintBrushIcon,
    departments: ['superadmin', 'admin', 'sales_manager', 'designer'],
    permission: 'edit_design_jobs',
  },
  {
    name: 'Designer Section',
    href: '/designer-section',
    icon: PaintBrushIcon,
    departments: ['superadmin', 'designer'],
    permission: 'upload_designs',
  },
  {
    name: 'Products',
    href: '/products',
    icon: CubeIcon,
    departments: ['superadmin', 'admin', 'sales_manager'],
    permission: 'view_products',
  },
  {
    name: 'QR Scanner',
    href: '/scanner',
    icon: QrCodeIcon,
    departments: ['production_staff', 'superadmin', 'admin', 'sales_manager'],
    permission: 'scan_qr',
  },
  {
    name: 'Due Dates',
    href: '/due-dates',
    icon: CalendarDaysIcon,
    departments: ['superadmin', 'admin', 'sales_manager', 'designer'],
    permission: 'view_due_dates',
  },
  {
    name: 'Department Management',
    href: '/department-management',
    icon: UserGroupIcon,
    departments: ['superadmin'],
    permission: 'manage_departments',
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, canAccess, hasPermission } = useAuth();

  const filteredNavigation = navigationItems.filter(item => {
    if (!user) return false;
    
    const hasAccess = canAccess(item.departments, item.roles);
    const hasRequiredPermission = item.permission ? hasPermission(item.permission) : true;
    
    return hasAccess && hasRequiredPermission;
  });

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-3"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Fazztrack</span>
            </motion.div>
          </div>
          
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {filteredNavigation.map((item, index) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <motion.li
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          to={item.href}
                          className={`sidebar-item ${
                            isActive ? 'active' : ''
                          }`}
                        >
                          <item.icon
                            className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200 ${
                              isActive
                                ? 'text-primary-600'
                                : 'text-gray-400 group-hover:text-primary-600'
                            }`}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </li>
              
              {/* User Info */}
              <li className="mt-auto">
                <div className="flex items-center gap-x-4 px-4 py-3 text-sm font-semibold leading-6 text-gray-900 bg-gray-50 rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user?.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.department.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed inset-y-0 z-50 flex w-64 flex-col lg:hidden"
          >
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
              <div className="flex h-16 shrink-0 items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">F</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">Fazztrack</span>
                </div>
                <button
                  type="button"
                  className="-m-2.5 p-2.5 text-gray-700 hover:text-gray-900"
                  onClick={onClose}
                >
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {filteredNavigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                          <li key={item.name}>
                            <Link
                              to={item.href}
                              onClick={onClose}
                              className={`sidebar-item ${
                                isActive ? 'active' : ''
                              }`}
                            >
                              <item.icon
                                className={`mr-3 h-5 w-5 flex-shrink-0 ${
                                  isActive
                                    ? 'text-primary-600'
                                    : 'text-gray-400 group-hover:text-primary-600'
                                }`}
                                aria-hidden="true"
                              />
                              {item.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                  
                  {/* User Info */}
                  <li className="mt-auto">
                    <div className="flex items-center gap-x-4 px-4 py-3 text-sm font-semibold leading-6 text-gray-900 bg-gray-50 rounded-lg">
                      <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {user?.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {user?.department.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;