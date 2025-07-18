import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bars3Icon,
  BellIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Mock notifications
  const notifications = [
    {
      id: '1',
      title: 'New Order Created',
      message: 'Order #FZ-001 has been created and needs approval',
      time: '5 minutes ago',
      unread: true,
    },
    {
      id: '2',
      title: 'Design Due Soon',
      message: 'Design for Order #FZ-002 is due in 2 days',
      time: '1 hour ago',
      unread: true,
    },
    {
      id: '3',
      title: 'Payment Approved',
      message: 'Design deposit for Order #FZ-003 has been approved',
      time: '3 hours ago',
      unread: false,
    },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-100 bg-white px-4 sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-200"
        onClick={onMenuClick}
        aria-label="Open sidebar"
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-5 w-5" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        {/* Search bar placeholder */}
        <div className="flex flex-1 items-center">
          <div className="w-full max-w-lg">
            {/* You can add a search bar here if needed */}
          </div>
        </div>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-400 hover:text-primary-500 relative rounded-md focus:outline-none focus:ring-2 focus:ring-primary-200"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              aria-label="View notifications"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-5 w-5" aria-hidden="true" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary-500 text-[10px] text-white flex items-center justify-center font-semibold">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 z-10 mt-2 w-72 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-gray-100 focus:outline-none border border-gray-100"
                >
                  <div className="px-4 py-2 border-b border-gray-50">
                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-56 overflow-y-auto divide-y divide-gray-50">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors duration-100 ${notification.unread ? 'bg-primary-50' : ''}`}
                      >
                        <div className="flex items-start space-x-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {notification.message}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

          {/* Profile dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              className="-m-1.5 flex items-center p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-200"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              aria-label="Open user menu"
            >
              <span className="sr-only">Open user menu</span>
              <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-base font-semibold">
                <span className="text-white">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-3 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                  {user?.name}
                </span>
                <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-400" aria-hidden="true" />
              </span>
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-gray-100 focus:outline-none border border-gray-100"
                >
                  <div className="px-4 py-3 border-b border-gray-50">
                    <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <button
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-100 rounded-md"
                      onClick={handleLogout}
                    >
                      <ArrowRightOnRectangleIcon className="mr-2 h-4 w-4 text-gray-400" />
                      Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;