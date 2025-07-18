import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Modal from '../../components/UI/Modal';
import Badge from '../../components/UI/Badge';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import type { Client } from '../../types';

const ClientsPage: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'create' | 'edit'>('view');
  const [formData, setFormData] = useState<Partial<Client>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockClients: Client[] = [
        {
          id: '1',
          name: 'ABC Corporation',
          email: 'contact@abc-corp.com',
          phone: '+60123456789',
          address: 'Lot 123, Jalan Teknologi, Cyberjaya, Selangor',
          totalOrders: 15,
          totalSpent: 25670.50,
          status: 'active',
          isActive: true,
          createdAt: '2024-01-15T00:00:00.000Z',
          updatedAt: '2024-01-20T00:00:00.000Z',
        },
        {
          id: '2',
          name: 'XYZ Solutions',
          email: 'info@xyz-solutions.com',
          phone: '+60198765432',
          address: 'Unit 45, Plaza Business, Kuala Lumpur',
          totalOrders: 8,
          totalSpent: 12340.00,
          status: 'active',
          isActive: true,
          createdAt: '2024-02-01T00:00:00.000Z',
          updatedAt: '2024-02-15T00:00:00.000Z',
        },
        {
          id: '3',
          name: 'Tech Startup Inc',
          email: 'hello@techstartup.com',
          phone: '+60187654321',
          address: '2nd Floor, Innovation Hub, Petaling Jaya',
          totalOrders: 3,
          totalSpent: 5670.25,
          status: 'inactive',
          isActive: true,
          createdAt: '2024-03-10T00:00:00.000Z',
          updatedAt: '2024-03-10T00:00:00.000Z',
        },
      ];
      
      setClients(mockClients);
      setLoading(false);
    };

    fetchClients();
  }, []);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    client.phone.includes(searchTerm)
  );

  const handleOpenModal = (mode: 'view' | 'create' | 'edit', client?: Client) => {
    setModalMode(mode);
    if (mode === 'create') {
      setFormData({});
    } else if (client) {
      setSelectedClient(client);
      setFormData(client);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
    setFormData({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (modalMode === 'create') {
        const newClient: Client = {
          id: Date.now().toString(),
          name: formData.name || '',
          email: formData.email || '',
          phone: formData.phone || '',
          address: formData.address || '',
          totalOrders: 0,
          totalSpent: 0,
          status: 'active',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setClients(prev => [...prev, newClient]);
      } else if (modalMode === 'edit' && selectedClient) {
        setClients(prev => prev.map(client => 
          client.id === selectedClient.id 
            ? { ...client, ...formData, updatedAt: new Date().toISOString() }
            : client
        ));
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error saving client:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (clientId: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setClients(prev => prev.filter(client => client.id !== clientId));
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  };

  const canEdit = hasPermission('edit_clients');
  const canDelete = hasPermission('delete_clients');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 p-8 shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-800/90"></div>
            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10 blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-white/5 blur-xl"></div>
            
            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2 tracking-tight">Clients</h1>
                <p className="text-blue-100 text-lg font-medium">
                  Manage your client database and relationships
                </p>
                <div className="mt-4 flex items-center space-x-6 text-sm text-blue-200">
                  <div className="flex items-center">
                    <UserIcon className="h-5 w-5 mr-2" />
                    <span>{clients.length} Total Clients</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    <span>{clients.filter(c => c.status === 'active').length} Active</span>
                  </div>
                </div>
              </div>
              {canEdit && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 sm:mt-0"
                >
                  <Button
                    onClick={() => handleOpenModal('create')}
                    className="bg-white text-blue-700 hover:bg-blue-50 border-0 shadow-lg px-6 py-3 font-semibold"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Client
          </Button>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/30"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search clients by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <span className="font-medium">{filteredClients.length} results</span>
              </div>
            </div>
          </motion.div>

          {/* Clients Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredClients.map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 h-full">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                          <UserIcon className="h-7 w-7 text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1">
                          <div className={`w-4 h-4 rounded-full border-2 border-white ${
                            client.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                          }`}></div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-700 transition-colors">
                          {client.name}
                        </h3>
                        <Badge
                          variant={client.status === 'active' ? 'success' : 'secondary'}
                          size="sm"
                          className="mt-1"
                        >
                          {client.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                        <EnvelopeIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="truncate font-medium">{client.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors">
                      <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center mr-3">
                        <PhoneIcon className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="font-medium">{client.phone}</span>
                    </div>
                    <div className="flex items-start text-sm text-gray-600 hover:text-gray-800 transition-colors">
                      <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center mr-3 mt-0.5">
                        <MapPinIcon className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="line-clamp-2 font-medium">{client.address}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-700">
                        {client.totalOrders}
                      </p>
                      <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Orders</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-700">
                        RM {(client.totalSpent ?? 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Total Spent</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOpenModal('view', client)}
                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <EyeIcon className="h-4 w-4" />
                      <span>View</span>
                    </motion.button>
                    {canEdit && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleOpenModal('edit', client)}
                        className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 font-medium py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <PencilIcon className="h-4 w-4" />
                        <span>Edit</span>
                      </motion.button>
                    )}
                    {canDelete && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleDelete(client.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-700 font-medium py-2.5 px-3 rounded-xl transition-all duration-200 flex items-center justify-center"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredClients.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/20 max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UserIcon className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  No clients found
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by adding your first client.'}
                </p>
                {canEdit && !searchTerm && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOpenModal('create')}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 mx-auto"
                  >
                    <PlusIcon className="h-5 w-5" />
                    <span>Add Client</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Client Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        size="lg"
      >
        <div className="bg-gradient-to-br from-blue-50/80 to-white p-8 rounded-2xl">
          <form onSubmit={handleSubmit}>
            <Modal.Header>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {modalMode === 'create' && 'Add New Client'}
                {modalMode === 'edit' && 'Edit Client'}
                {modalMode === 'view' && 'Client Details'}
              </h3>
            </Modal.Header>
            
            <Modal.Body>
              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Client Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      placeholder="Enter client name"
                      required
                      disabled={modalMode === 'view'}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm disabled:bg-gray-50"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                      required
                      disabled={modalMode === 'view'}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm disabled:bg-gray-50"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      required
                      disabled={modalMode === 'view'}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm disabled:bg-gray-50"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Address
                    {modalMode !== 'view' && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <textarea
                      name="address"
                      value={formData.address || ''}
                      onChange={handleInputChange}
                      placeholder="Enter full address"
                      rows={3}
                      required
                      disabled={modalMode === 'view'}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm disabled:bg-gray-50 resize-none"
                    />
                  </div>
                </div>
                
                {modalMode === 'view' && selectedClient && (
                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <label className="block text-sm font-medium text-blue-600 mb-1">Total Orders</label>
                      <p className="text-2xl font-bold text-blue-700">
                        {selectedClient.totalOrders}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl">
                      <label className="block text-sm font-medium text-green-600 mb-1">Total Spent</label>
                      <p className="text-2xl font-bold text-green-700">
                        RM {(selectedClient.totalSpent ?? 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl">
                      <label className="block text-sm font-medium text-purple-600 mb-1">Status</label>
                      <Badge
                        variant={selectedClient.status === 'active' ? 'success' : 'secondary'}
                        className="mt-1"
                      >
                        {selectedClient.status}
                      </Badge>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-xl">
                      <label className="block text-sm font-medium text-orange-600 mb-1">Member Since</label>
                      <p className="text-sm font-semibold text-orange-700">
                        {selectedClient.createdAt && (new Date(selectedClient.createdAt)).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Modal.Body>
            
            <Modal.Footer>
              <div className="flex space-x-4 pt-6">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCloseModal}
                  className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  {modalMode === 'view' ? 'Close' : 'Cancel'}
                </motion.button>
                {modalMode !== 'view' && (
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    {isSubmitting ? 'Processing...' : (modalMode === 'create' ? 'Create Client' : 'Save Changes')}
                  </motion.button>
                )}
              </div>
            </Modal.Footer>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default ClientsPage;