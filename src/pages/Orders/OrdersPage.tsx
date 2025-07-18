import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Select from '../../components/UI/Select';
import Modal from '../../components/UI/Modal';
import Badge from '../../components/UI/Badge';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import type { Order, Client, Product, PaymentMethod, OrderStatus } from '../../types';
import ReceiptPage from './ReceiptPage';

interface FileAttachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

const OrdersPage: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'create' | 'edit'>('view');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  // Add state for showing receipt modal
  const [showReceipt, setShowReceipt] = useState(false);
  // Add state for active tab
  const [activeTab, setActiveTab] = useState<'all' | 'completed'>('all');

  // Form data for new/edit order
  const [formData, setFormData] = useState({
    jobName: '',
    clientId: '',
    newClient: {
      name: '',
      phone: '',
      email: '',
      billingAddress: '',
      shippingAddress: '',
      useDifferentShipping: false,
    },
    deliveryMethod: 'self-collect',
    receipts: [] as File[],
    jobSheets: [] as File[],
    downloadLink: '',
    products: [{ name: '', quantity: 0, price: 0 }],
    remarks: '',
    designDeposit: 0,
    designPaymentDate: '',
    designDueDate: '',
    productionDeposit: 0,
    productionPaymentDate: '',
    productionDueDate: '',
    balancePayment: 0,
    balancePaymentDate: '',
    paymentMethod: '',
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock clients
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
      ];

      // Mock products
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'T-Shirt',
          category: 'Apparel',
          price: 25.00,
          basePrice: 25.00,
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
          stock: 100,
          description: '',
          tags: [],
        },
        {
          id: '2',
          name: 'Polo Shirt',
          category: 'Apparel',
          price: 35.00,
          basePrice: 35.00,
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
          stock: 50,
          description: '',
          tags: [],
        },
        {
          id: '3',
          name: 'Hoodie',
          category: 'Apparel',
          price: 55.00,
          basePrice: 55.00,
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
          stock: 30,
          description: '',
          tags: [],
        },
        {
          id: '4',
          name: 'Cap',
          category: 'Accessories',
          price: 15.00,
          basePrice: 15.00,
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
          stock: 75,
          description: '',
          tags: [],
        },
        {
          id: '5',
          name: 'Socks',
          category: 'Accessories',
          price: 8.00,
          basePrice: 8.00,
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
          stock: 200,
          description: '',
          tags: [],
        },
      ];
      
      // Mock orders
      const mockOrders: Order[] = [
        {
          id: 'ORD-001',
          jobName: 'Corporate Event T-Shirts',
          clientId: '1',
          client: mockClients[0],
          products: [
            {
              id: 'OP-001',
              productId: '1',
              product: mockProducts[0],
              quantity: 50,
              unitPrice: 25.00,
              totalPrice: 1250.00,
            },
          ],
          status: 'pending' as OrderStatus,
          deliveryMethod: 'shipping' as 'shipping',
          designDeposit: 200.00,
          productionDeposit: 500.00,
          balancePayment: 550.00,
          designDueDate: '2024-12-25T00:00:00.000Z',
          productionDueDate: '2024-12-31T00:00:00.000Z',
          createdAt: '2024-12-15T00:00:00.000Z',
          updatedAt: '2024-12-15T00:00:00.000Z',
          paymentMethod: 'deposit_design' as PaymentMethod,
          subtotal: 1250.00,
          totalPaid: 0,
          balanceToPay: 0,
          designDepositApproved: false,
          productionDepositApproved: false,
          balancePaymentApproved: false,
          receipts: [],
          jobSheets: [],
          createdBy: 'admin',
        },
        {
          id: 'ORD-002',
          jobName: 'Marketing Campaign Hoodies',
          clientId: '2',
          client: mockClients[1],
          products: [
            {
              id: 'OP-002',
              productId: '3',
              product: mockProducts[2],
              quantity: 25,
              unitPrice: 55.00,
              totalPrice: 1375.00,
            },
          ],
          status: 'approved' as OrderStatus,
          deliveryMethod: 'self_collect' as 'self_collect',
          designDeposit: 275.00,
          productionDeposit: 550.00,
          balancePayment: 550.00,
          designDueDate: '2024-12-20T00:00:00.000Z',
          productionDueDate: '2024-12-28T00:00:00.000Z',
          createdAt: '2024-12-10T00:00:00.000Z',
          updatedAt: '2024-12-12T00:00:00.000Z',
          paymentMethod: 'deposit_production' as PaymentMethod,
          subtotal: 1375.00,
          totalPaid: 0,
          balanceToPay: 0,
          designDepositApproved: false,
          productionDepositApproved: false,
          balancePaymentApproved: false,
          receipts: [],
          jobSheets: [],
          createdBy: 'admin',
        },
        {
          id: 'ORD-003',
          jobName: 'Annual Company Polo Shirts',
          clientId: '2',
          client: mockClients[1],
          products: [
            {
              id: 'OP-003',
              productId: '2',
              product: mockProducts[1],
              quantity: 30,
              unitPrice: 40.00,
              totalPrice: 1200.00,
            },
          ],
          status: 'delivered' as OrderStatus,
          deliveryMethod: 'shipping',
          designDeposit: 300.00,
          productionDeposit: 400.00,
          balancePayment: 500.00,
          designDueDate: '2024-12-10T00:00:00.000Z',
          productionDueDate: '2024-12-20T00:00:00.000Z',
          createdAt: '2024-12-01T00:00:00.000Z',
          updatedAt: '2024-12-21T00:00:00.000Z',
          paymentMethod: 'deposit_design',
          subtotal: 1200.00,
          totalPaid: 1200.00,
          balanceToPay: 0,
          designDepositApproved: true,
          productionDepositApproved: true,
          balancePaymentApproved: true,
          receipts: [
            {
              id: 'receipt-001',
              filename: 'receipt-ord-003.pdf',
              originalName: 'receipt-ord-003.pdf',
              mimeType: 'application/pdf',
              size: 123456,
              url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
              uploadedAt: '2024-12-21T10:00:00.000Z',
              uploadedBy: 'admin',
            }
          ],
          jobSheets: [],
          createdBy: 'admin',
        },
      ];
      
      setClients(mockClients);
      setProducts(mockProducts);
      setOrders(mockOrders);
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.jobName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Filtered orders based on tab
  const displayedOrders = activeTab === 'all'
    ? filteredOrders
    : filteredOrders.filter(order => (order.status as string) === 'completed' || (order.status as string) === 'delivered');

  const handleOpenModal = (mode: 'view' | 'create' | 'edit', order?: Order) => {
    setModalMode(mode);
    setCurrentStep(1);
    if (mode === 'create') {
      setFormData({
        jobName: '',
        clientId: '',
        newClient: {
          name: '',
          phone: '',
          email: '',
          billingAddress: '',
          shippingAddress: '',
          useDifferentShipping: false,
        },
        deliveryMethod: 'self-collect',
        receipts: [],
        jobSheets: [],
        downloadLink: '',
        products: [{ name: '', quantity: 0, price: 0 }],
        remarks: '',
        designDeposit: 0,
        designPaymentDate: '',
        designDueDate: '',
        productionDeposit: 0,
        productionPaymentDate: '',
        productionDueDate: '',
        balancePayment: 0,
        balancePaymentDate: '',
        paymentMethod: '',
      });
    } else if (order) {
      setSelectedOrder(order);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setCurrentStep(1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name.startsWith('newClient.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        newClient: {
          ...prev.newClient,
          [field]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleProductChange = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.map((product, i) => 
        i === index ? { ...product, [field]: value } : product
      ),
    }));
  };

  const addProduct = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, { name: '', quantity: 0, price: 0 }],
    }));
  };

  const removeProduct = (index: number) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };

  const calculateTotals = () => {
    const subtotal = formData.products.reduce((sum, product) => 
      sum + (product.quantity * product.price), 0
    );
    const totalPaid = formData.designDeposit + formData.productionDeposit;
    const balance = subtotal - totalPaid;
    
    return { subtotal, totalPaid, balance };
  };

  // Helper to convert File[] to FileAttachment[]
  function filesToAttachments(files: File[]): FileAttachment[] {
    return files.map((file, idx) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${idx}`,
      filename: file.name,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
      uploadedBy: user?.id || 'unknown',
    }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (modalMode === 'create') {
        const newOrder: Order = {
          id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
          jobName: formData.jobName,
          clientId: formData.clientId || 'new',
          client: formData.clientId ? 
            (clients.find(c => c.id === formData.clientId) || {
              id: 'unknown',
              name: 'Unknown',
              phone: '',
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }) : 
            {
              id: 'new',
              name: formData.newClient?.name || '',
              phone: formData.newClient?.phone || '',
              email: formData.newClient?.email || '',
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          products: formData.products.map((p, idx) => ({
            id: `OP-TEMP-${idx}`,
            productId: 'temp',
            product: { id: 'temp', name: p.name, category: 'Custom', price: p.price, stock: 0, basePrice: p.price, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            quantity: p.quantity,
            unitPrice: p.price,
            totalPrice: p.price * p.quantity,
          })),
          status: 'pending',
          deliveryMethod: (formData.deliveryMethod === 'self-collect' ? 'self_collect' : formData.deliveryMethod) as 'self_collect' | 'shipping',
          designDeposit: formData.designDeposit,
          productionDeposit: formData.productionDeposit,
          balancePayment: calculateTotals().balance,
          designDueDate: formData.designDueDate ? new Date(formData.designDueDate).toISOString() : '',
          productionDueDate: formData.productionDueDate ? new Date(formData.productionDueDate).toISOString() : '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          receipts: filesToAttachments(formData.receipts),
          jobSheets: [],
          createdBy: user?.id || 'placeholder',
          paymentMethod: formData.paymentMethod as PaymentMethod,
          subtotal: calculateTotals().subtotal,
          totalPaid: 0,
          balanceToPay: calculateTotals().balance,
          designDepositApproved: false,
          productionDepositApproved: false,
          balancePaymentApproved: false,
        };
        
        setOrders(prev => [...prev, newOrder]);
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error saving order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-4 w-4" />;
      case 'approved':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'in-progress':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4" />;
      default:
        return <DocumentIcon className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'primary';
      case 'in-progress':
        return 'secondary';
      case 'completed':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'approved':
        return 'Approved';
      case 'in-progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const canEdit = hasPermission('orders');
  const canDelete = hasPermission('orders');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  const { subtotal, totalPaid, balance } = calculateTotals();

  return (
    <div className="min-h-screen font-sans bg-white">
      {/* Orders Page Header - blue gradient box like ClientsPage */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-700 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 shadow-2xl">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Orders</h1>
          <p className="text-white/90 text-base mb-4">Manage your orders, production, and delivery</p>
          {/* Example stats row, optional: */}
          {/* <div className="flex items-center gap-6 text-white/80 text-sm font-medium">
            <span><UserIcon className="inline h-5 w-5 mr-1" /> 12 Total Orders</span>
            <span><CheckCircleIcon className="inline h-5 w-5 mr-1" /> 5 In Progress</span>
          </div> */}
        </div>
        <button
          onClick={() => handleOpenModal('create')}
          className="mt-4 sm:mt-0 bg-white text-blue-700 font-semibold px-8 py-4 rounded-xl shadow hover:bg-blue-50 border-0 flex flex-col items-center justify-center text-base transition-all duration-150"
        >
          <span className="text-xl leading-none mb-1">+</span>
          Add Order
        </button>
      </div>
      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border-0 p-6">
          <Card.Body className="p-0">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search orders by job name, order ID, or client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<MagnifyingGlassIcon />}
                  className="text-base px-5 py-3 rounded-xl shadow-sm border-0 bg-white/80 focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="w-full sm:w-48">
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Status' },
                    { value: 'pending', label: 'Pending' },
                    { value: 'approved', label: 'Approved' },
                    { value: 'in-progress', label: 'In Progress' },
                    { value: 'completed', label: 'Completed' },
                  ]}
                  className="text-base px-5 py-3 rounded-xl shadow-sm border-0 bg-white/80 focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          </Card.Body>
        </Card>
      </motion.div>
      {/* Tabs above orders list */}
      <div className="flex gap-2 mb-6">
        <button
          className={`px-5 py-2 rounded-t-xl font-semibold text-base transition-all duration-150 ${activeTab === 'all' ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-600'}`}
          onClick={() => setActiveTab('all')}
        >
          All Orders
        </button>
        <button
          className={`px-5 py-2 rounded-t-xl font-semibold text-base transition-all duration-150 ${activeTab === 'completed' ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-600'}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed Orders
        </button>
      </div>
      <div className="h-4 sm:h-8" />
      {/* Orders List: modern, minimalist, list-style like ClientsPage but not boxes */}
      <div className="bg-white rounded-2xl shadow border border-blue-100 divide-y divide-blue-50 overflow-hidden">
        <div className="px-6 py-4 font-semibold text-gray-700 text-sm flex items-center justify-between bg-blue-50">
          <span>Job Name / Client</span>
          <span>Status</span>
          <span>Total</span>
          <span>Due Dates</span>
          <span className="text-right">Actions</span>
        </div>
        {displayedOrders.map((order) => (
          <div
            key={order.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 hover:bg-blue-50 transition-all duration-100 group border-l-4 border-transparent hover:border-blue-400 focus-within:bg-blue-50"
          >
            {/* Left: Job Name, Client */}
            <div className="flex-1 min-w-0">
              <div className="font-bold text-gray-900 truncate">{order.jobName}</div>
              <div className="text-sm text-gray-500 truncate">{order.client?.name}</div>
            </div>
            {/* Status */}
            <div className="w-32 flex-shrink-0 flex items-center justify-center my-2 sm:my-0">
              <Badge variant={getStatusColor(order.status) as any} className="px-3 py-1 text-xs rounded-xl">
                {getStatusLabel(order.status)}
              </Badge>
            </div>
            {/* Total */}
            <div className="w-28 flex-shrink-0 text-gray-700 text-sm text-center">RM {order.subtotal.toLocaleString()}</div>
            {/* Due Dates */}
            <div className="w-40 flex-shrink-0 text-xs text-gray-500 text-center">
              <div>Design: {order.designDueDate ? new Date(order.designDueDate).toLocaleDateString() : '-'}</div>
              <div>Production: {order.productionDueDate ? new Date(order.productionDueDate).toLocaleDateString() : '-'}</div>
            </div>
            {/* Actions */}
            <div className="flex space-x-2 ml-auto mt-2 sm:mt-0">
              <Button variant="ghost" size="sm" onClick={() => handleOpenModal('view', order)} className="hover:bg-blue-100 text-blue-700 p-2 rounded-xl">
                <EyeIcon className="h-4 w-4" />
              </Button>
              {(order.status as string) === 'delivered' && (
                <Button variant="ghost" size="sm" onClick={() => { setSelectedOrder(order); setShowReceipt(true); }} className="hover:bg-blue-100 text-blue-700 p-2 rounded-xl">
                  <DocumentIcon className="h-4 w-4" />
                </Button>
              )}
              {canEdit && (order.status as string) !== 'order_completed' && (order.status as string) !== 'delivered' && (
                <Button variant="ghost" size="sm" onClick={() => handleOpenModal('edit', order)} className="hover:bg-green-100 text-green-700 p-2 rounded-xl">
                  <PencilIcon className="h-4 w-4" />
                </Button>
              )}
              {canDelete && (
                <Button variant="ghost" size="sm" onClick={() => handleDeleteOrder(order.id)} className="hover:bg-red-100 text-red-700 p-2 rounded-xl">
                  <TrashIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* No orders found - compact, modern */}
      {displayedOrders.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <DocumentIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No orders found</h3>
          <p className="text-base text-gray-500 mb-6">{searchTerm ? 'Try adjusting your search criteria.' : 'Get started by creating your first order.'}</p>
          {canEdit && !searchTerm && (
            <Button onClick={() => handleOpenModal('create')} className="px-6 py-3 rounded-xl shadow bg-white text-blue-700 hover:bg-blue-50 border-0 font-semibold flex items-center">
              <PlusIcon className="h-5 w-5 mr-2" /> Add New Order
            </Button>
          )}
        </motion.div>
      )}
      {/* Order Modal - keep as is for now */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="xl">
        {modalMode === 'view' && selectedOrder ? (
          // View Mode
          <>
            <Modal.Header>
              <h3 className="text-lg font-semibold">
                Order Details - {selectedOrder.id}
              </h3>
            </Modal.Header>
            <Modal.Body>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Job Name</label>
                    <p className="text-gray-900">{selectedOrder.jobName}</p>
                  </div>
                  <div>
                    <label className="form-label">Status</label>
                    <Badge variant={getStatusColor(selectedOrder.status) as any}>
                      {selectedOrder.status}
                    </Badge>
                  </div>
                  <div>
                    <label className="form-label">Client</label>
                    <p className="text-gray-900">{selectedOrder.client?.name}</p>
                  </div>
                  <div>
                    <label className="form-label">Delivery Method</label>
                    <p className="text-gray-900 capitalize">{selectedOrder.deliveryMethod}</p>
                  </div>
                </div>
                
                <div>
                  <label className="form-label">Products</label>
                  <div className="space-y-2">
                    {selectedOrder.products.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span>{item.product.name}</span>
                        <span>{item.quantity} × RM {(item.price ?? 0).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">Design Deposit</label>
                    <p className="text-gray-900">RM {selectedOrder.designDeposit.toFixed(2)}</p>
                  </div>
                  <div>
                    <label className="form-label">Production Deposit</label>
                    <p className="text-gray-900">RM {selectedOrder.productionDeposit.toFixed(2)}</p>
                  </div>
                  <div>
                    <label className="form-label">Balance Payment</label>
                    <p className="text-gray-900">RM {selectedOrder.balancePayment.toFixed(2)}</p>
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
          // Create/Edit Mode
          <form onSubmit={handleSubmit}>
            <Modal.Header>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {modalMode === 'create' ? 'Add New Order' : 'Edit Order'}
                </h3>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <div
                      key={step}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step === currentStep
                          ? 'bg-primary-500 text-white'
                          : step < currentStep
                          ? 'bg-success-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </Modal.Header>
            
            <Modal.Body>
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Job Information</h4>
                  <Input
                    label="Job Name"
                    name="jobName"
                    value={formData.jobName}
                    onChange={handleInputChange}
                    placeholder="Enter job name"
                    required
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Choose Client"
                      name="clientId"
                      value={formData.clientId}
                      onChange={handleInputChange}
                      options={[
                        { value: '', label: 'Select existing client or create new' },
                        ...clients.map(client => ({ value: client.id, label: client.name })),
                        { value: 'new', label: 'Create New Customer' },
                      ]}
                    />
                    
                    <Select
                      label="Delivery Method"
                      name="deliveryMethod"
                      value={formData.deliveryMethod}
                      onChange={handleInputChange}
                      options={[
                        { value: 'self-collect', label: 'Self Collect' },
                        { value: 'shipping', label: 'Shipping' },
                      ]}
                    />
                  </div>
                  
                  {formData.clientId === 'new' && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <h5 className="font-medium text-gray-900">New Customer Details</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Customer Name"
                          name="newClient.name"
                          value={formData.newClient.name}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          required
                        />
                        <Input
                          label="Customer Phone"
                          name="newClient.phone"
                          value={formData.newClient.phone}
                          onChange={handleInputChange}
                          placeholder="60123456789"
                          required
                        />
                      </div>
                      <Input
                        label="Customer Email"
                        type="email"
                        name="newClient.email"
                        value={formData.newClient.email}
                        onChange={handleInputChange}
                        placeholder="customer@mail.com"
                      />
                      <div>
                        <label className="form-label">Billing Address</label>
                        <textarea
                          name="newClient.billingAddress"
                          value={formData.newClient.billingAddress}
                          onChange={handleInputChange}
                          placeholder="Lot 1112 Kampung..."
                          rows={3}
                          className="input"
                          required
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="useDifferentShipping"
                          name="newClient.useDifferentShipping"
                          checked={formData.newClient.useDifferentShipping}
                          onChange={handleInputChange}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="useDifferentShipping" className="text-sm text-gray-700">
                          Use different customer information for shipping?
                        </label>
                      </div>
                      
                      {formData.newClient.useDifferentShipping && (
                        <div>
                          <label className="form-label">Delivery Address</label>
                          <textarea
                            name="newClient.shippingAddress"
                            value={formData.newClient.shippingAddress}
                            onChange={handleInputChange}
                            placeholder="Lot 1112 Kampung..."
                            rows={3}
                            className="input"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">File Attachments</h4>
                  {/* Receipts Upload */}
                  <div>
                    <label className="form-label">Receipts</label>
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition"
                      onClick={() => document.getElementById('receipts-upload')?.click()}
                      onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                      onDrop={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        const files = Array.from(e.dataTransfer.files);
                        setFormData(prev => ({ ...prev, receipts: [...prev.receipts, ...files] }));
                      }}
                    >
                      <DocumentIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Drag or click to upload your files (image/pdf)</p>
                      <input
                        id="receipts-upload"
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={e => {
                          setFormData(prev => ({ ...prev, receipts: [...prev.receipts, ...Array.from(e.target.files || [])] }));
                        }}
                      />
                      {/* Uploaded files list */}
                      {formData.receipts.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {formData.receipts.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2 text-sm">
                              <span className="truncate max-w-xs">{file.name}</span>
                              <button
                                type="button"
                                className="text-red-500 hover:text-red-700 ml-2"
                                onClick={e => {
                                  e.stopPropagation();
                                  setFormData(prev => ({ ...prev, receipts: prev.receipts.filter((_, i) => i !== idx) }));
                                }}
                              >Remove</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="form-label">Job Sheet & Link Download</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
                      <DocumentIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">DRAG OR UPLOAD YOUR FILES</p>
                      <input type="file" multiple accept=".pdf,.doc,.docx" className="hidden" />
                    </div>
                    
                    <Input
                      label="Link Download"
                      name="downloadLink"
                      value={formData.downloadLink}
                      onChange={handleInputChange}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              )}
              
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Products</h4>
                    <Button type="button" variant="ghost" size="sm" onClick={addProduct}>
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add Product
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.products.map((product, index) => (
                      <div key={index} className="grid grid-cols-12 gap-3 items-end">
                        <div className="col-span-5">
                          <Select
                            label={index === 0 ? 'Product Name' : ''}
                            value={product.name}
                            onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                            options={[
                              { value: '', label: 'Select product' },
                              ...products.map(p => ({ value: p.name, label: p.name })),
                            ]}
                          />
                        </div>
                        <div className="col-span-3">
                          <Input
                            label={index === 0 ? 'Quantity' : ''}
                            type="number"
                            value={product.quantity}
                            onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                        <div className="col-span-3">
                          <Input
                            label={index === 0 ? 'Price' : ''}
                            type="number"
                            step="0.01"
                            value={product.price}
                            onChange={(e) => handleProductChange(index, 'price', parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                          />
                        </div>
                        <div className="col-span-1">
                          {formData.products.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeProduct(index)}
                              className="text-danger-600 hover:text-danger-700"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {currentStep === 4 && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Remarks</h4>
                  <div>
                    <label className="form-label">Remarks</label>
                    <textarea
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleInputChange}
                      rows={4}
                      className="input"
                      placeholder="Enter any additional notes or requirements..."
                    />
                  </div>
                </div>
              )}
              
              {currentStep === 5 && (
                <div className="space-y-6">
                  <h4 className="font-medium text-gray-900">Payment & Order Details</h4>
                  
                  {/* Design Section */}
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-3">--- Design ---</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        label="Deposit Design"
                        type="number"
                        step="0.01"
                        name="designDeposit"
                        value={formData.designDeposit}
                        onChange={handleInputChange}
                        placeholder="0.00"
                      />
                      <Input
                        label="Tarikh Payment"
                        type="date"
                        name="designPaymentDate"
                        value={formData.designPaymentDate}
                        onChange={handleInputChange}
                      />
                      <Input
                        label="Due Date Design"
                        type="date"
                        name="designDueDate"
                        value={formData.designDueDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  {/* Production Section */}
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h5 className="font-medium text-green-900 mb-3">--- Production ---</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        label="Deposit Production"
                        type="number"
                        step="0.01"
                        name="productionDeposit"
                        value={formData.productionDeposit}
                        onChange={handleInputChange}
                        placeholder="0.00"
                      />
                      <Input
                        label="Tarikh Payment"
                        type="date"
                        name="productionPaymentDate"
                        value={formData.productionPaymentDate}
                        onChange={handleInputChange}
                      />
                      <Input
                        label="Due Date Production"
                        type="date"
                        name="productionDueDate"
                        value={formData.productionDueDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  {/* Balance Payment Section */}
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h5 className="font-medium text-yellow-900 mb-3">--- Balance Payment ---</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        label="Balance Payment"
                        type="number"
                        step="0.01"
                        name="balancePayment"
                        value={formData.balancePayment}
                        onChange={handleInputChange}
                        placeholder="0.00"
                      />
                      <Input
                        label="Tarikh Payment"
                        type="date"
                        name="balancePaymentDate"
                        value={formData.balancePaymentDate}
                        onChange={handleInputChange}
                      />
                      <Select
                        label="Payment Method?"
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleInputChange}
                        options={[
                          { value: '', label: 'Please select one' },
                          { value: 'skip_vip_agent', label: '1. Skip Payment (VIP/Agent)' },
                          { value: 'skip_vip_end_user', label: '2. Skip Payment (VIP/End User)' },
                          { value: 'deposit_design', label: '3. Deposit Design' },
                          { value: 'deposit_production', label: '4. Deposit production' },
                        ]}
                      />
                    </div>
                  </div>
                  
                  {/* Summary */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal ({formData.products.length} Items)</span>
                        <span>RM {subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Deposit Design</span>
                        <span>RM {formData.designDeposit.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Deposit Production</span>
                        <span>RM {formData.productionDeposit.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Total paid by customer</span>
                        <span>RM {totalPaid.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Balance to paid</span>
                        <span>RM {balance.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Modal.Body>
            
            <Modal.Footer>
              <div className="flex justify-between w-full">
                <div>
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setCurrentStep(currentStep - 1)}
                    >
                      Previous
                    </Button>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </Button>
                  
                  {currentStep < 5 ? (
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(currentStep + 1)}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      loading={isSubmitting}
                    >
                      Create Order
                    </Button>
                  )}
                </div>
              </div>
            </Modal.Footer>
          </form>
        )}
      </Modal>
      {/* Show ReceiptPage in a modal when showReceipt is true */}
      <Modal isOpen={showReceipt} onClose={() => setShowReceipt(false)} size="xl">
        {selectedOrder && <ReceiptPage order={selectedOrder} />}
      </Modal>
    </div>
  );
};

export default OrdersPage;

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    jobName: 'Corporate Event T-Shirts',
    clientId: '1',
    client: {
      id: '1',
      name: 'ABC Corporation',
      email: 'contact@abc-corp.com',
      phone: '+60123456789',
      address: 'Lot 123, Jalan Teknologi, Cyberjaya, Selangor',
      totalOrders: 15,
      totalSpent: 25670.50,
      isActive: true,
      createdAt: '2024-01-15T00:00:00.000Z',
      updatedAt: '2024-01-20T00:00:00.000Z',
    },
    products: [
      {
        id: 'OP-001',
        productId: '1',
        product: {
          id: '1',
          name: 'T-Shirt',
          category: 'Apparel',
          price: 25.00,
          basePrice: 25.00,
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
          stock: 100,
          description: '',
          tags: [],
        },
        quantity: 50,
        unitPrice: 25.00,
        totalPrice: 1250.00,
      },
    ],
    status: 'pending',
    deliveryMethod: 'shipping' as 'shipping',
    designDeposit: 200.00,
    productionDeposit: 500.00,
    balancePayment: 550.00,
    designDueDate: '2024-12-25T00:00:00.000Z',
    productionDueDate: '2024-12-31T00:00:00.000Z',
    createdAt: '2024-12-15T00:00:00.000Z',
    updatedAt: '2024-12-15T00:00:00.000Z',
    paymentMethod: 'deposit_design' as PaymentMethod,
    subtotal: 1250.00,
    totalPaid: 0,
    balanceToPay: 0,
    designDepositApproved: false,
    productionDepositApproved: false,
    balancePaymentApproved: false,
    receipts: [],
    jobSheets: [],
    createdBy: 'admin',
  },
  {
    id: 'ORD-002',
    jobName: 'Marketing Campaign Hoodies',
    clientId: '2',
    client: {
      id: '2',
      name: 'XYZ Solutions',
      email: 'info@xyz-solutions.com',
      phone: '+60198765432',
      address: 'Unit 45, Plaza Business, Kuala Lumpur',
      totalOrders: 8,
      totalSpent: 12340.00,
      isActive: true,
      createdAt: '2024-02-01T00:00:00.000Z',
      updatedAt: '2024-02-15T00:00:00.000Z',
    },
    products: [
      {
        id: 'OP-002',
        productId: '3',
        product: {
          id: '3',
          name: 'Hoodie',
          category: 'Apparel',
          price: 55.00,
          basePrice: 55.00,
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
          stock: 30,
          description: '',
          tags: [],
        },
        quantity: 25,
        unitPrice: 55.00,
        totalPrice: 1375.00,
      },
    ],
    status: 'approved',
    deliveryMethod: 'self_collect' as 'self_collect',
    designDeposit: 275.00,
    productionDeposit: 550.00,
    balancePayment: 550.00,
    designDueDate: '2024-12-20T00:00:00.000Z',
    productionDueDate: '2024-12-28T00:00:00.000Z',
    createdAt: '2024-12-10T00:00:00.000Z',
    updatedAt: '2024-12-12T00:00:00.000Z',
    paymentMethod: 'deposit_production' as PaymentMethod,
    subtotal: 1375.00,
    totalPaid: 0,
    balanceToPay: 0,
    designDepositApproved: false,
    productionDepositApproved: false,
    balancePaymentApproved: false,
    receipts: [],
    jobSheets: [],
    createdBy: 'admin',
  },
  {
    id: 'ORD-003',
    jobName: 'Annual Company Polo Shirts',
    clientId: '2',
    client: {
      id: '2',
      name: 'XYZ Solutions',
      email: 'info@xyzsolutions.com',
      phone: '+60129876543',
      address: 'Lot 456, Jalan Inovasi, Cyberjaya, Selangor',
      totalOrders: 8,
      totalSpent: 11200.00,
      isActive: true,
      createdAt: '2024-02-10T00:00:00.000Z',
      updatedAt: '2024-02-15T00:00:00.000Z',
    },
    products: [
      {
        id: 'OP-003',
        productId: '2',
        product: {
          id: '2',
          name: 'Polo Shirt',
          category: 'Apparel',
          price: 40.00,
          basePrice: 40.00,
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
          stock: 50,
          description: '',
          tags: [],
        },
        quantity: 30,
        unitPrice: 40.00,
        totalPrice: 1200.00,
      },
    ],
    status: 'delivered' as OrderStatus,
    deliveryMethod: 'shipping',
    designDeposit: 300.00,
    productionDeposit: 400.00,
    balancePayment: 500.00,
    designDueDate: '2024-12-10T00:00:00.000Z',
    productionDueDate: '2024-12-20T00:00:00.000Z',
    createdAt: '2024-12-01T00:00:00.000Z',
    updatedAt: '2024-12-21T00:00:00.000Z',
    paymentMethod: 'deposit_design',
    subtotal: 1200.00,
    totalPaid: 1200.00,
    balanceToPay: 0,
    designDepositApproved: true,
    productionDepositApproved: true,
    balancePaymentApproved: true,
    receipts: [
      {
        id: 'receipt-001',
        filename: 'receipt-ord-003.pdf',
        originalName: 'receipt-ord-003.pdf',
        mimeType: 'application/pdf',
        size: 123456,
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        uploadedAt: '2024-12-21T10:00:00.000Z',
        uploadedBy: 'admin',
      }
    ],
    jobSheets: [],
    createdBy: 'admin',
  },
  {
    id: 'ORD-004',
    jobName: 'VIP Client Custom Jackets',
    clientId: '3',
    client: {
      id: '3',
      name: 'VIP Holdings',
      email: 'vip@holdings.com',
      phone: '+60123400000',
      address: '88, Jalan Elite, Kuala Lumpur',
      totalOrders: 3,
      totalSpent: 9000.00,
      isActive: true,
      createdAt: '2024-03-01T00:00:00.000Z',
      updatedAt: '2024-03-10T00:00:00.000Z',
    },
    products: [
      {
        id: 'OP-004',
        productId: '3',
        product: {
          id: '3',
          name: 'Custom Jacket',
          category: 'Apparel',
          price: 150.00,
          basePrice: 150.00,
          isActive: true,
          createdAt: '2024-02-01T00:00:00.000Z',
          updatedAt: '2024-02-01T00:00:00.000Z',
          stock: 20,
          description: '',
          tags: [],
        },
        quantity: 10,
        unitPrice: 150.00,
        totalPrice: 1500.00,
      },
    ],
    status: 'in_delivery' as OrderStatus,
    deliveryMethod: 'shipping',
    designDeposit: 500.00,
    productionDeposit: 500.00,
    balancePayment: 500.00,
    designDueDate: '2024-12-15T00:00:00.000Z',
    productionDueDate: '2024-12-22T00:00:00.000Z',
    createdAt: '2024-12-05T00:00:00.000Z',
    updatedAt: '2024-12-23T00:00:00.000Z',
    paymentMethod: 'deposit_production',
    subtotal: 1500.00,
    totalPaid: 1500.00,
    balanceToPay: 0,
    designDepositApproved: true,
    productionDepositApproved: true,
    balancePaymentApproved: true,
    receipts: [],
    jobSheets: [],
    createdBy: 'admin',
    deliveryTrackingId: 'MYTRACK2001',
  },
  {
    id: 'ORD-005',
    jobName: 'Corporate Team Hoodies',
    clientId: '4',
    client: {
      id: '4',
      name: 'Tech Innovators',
      email: 'info@techinnovators.com',
      phone: '+60123456788',
      address: '55, Jalan Teknologi, Cyberjaya',
      totalOrders: 5,
      totalSpent: 7000.00,
      isActive: true,
      createdAt: '2024-04-01T00:00:00.000Z',
      updatedAt: '2024-04-10T00:00:00.000Z',
    },
    products: [
      {
        id: 'OP-005',
        productId: '4',
        product: {
          id: '4',
          name: 'Hoodie',
          category: 'Apparel',
          price: 60.00,
          basePrice: 60.00,
          isActive: true,
          createdAt: '2024-03-01T00:00:00.000Z',
          updatedAt: '2024-03-01T00:00:00.000Z',
          stock: 40,
          description: '',
          tags: [],
        },
        quantity: 20,
        unitPrice: 60.00,
        totalPrice: 1200.00,
      },
    ],
    status: 'completed' as OrderStatus,
    deliveryMethod: 'shipping',
    designDeposit: 300.00,
    productionDeposit: 400.00,
    balancePayment: 500.00,
    designDueDate: '2024-12-18T00:00:00.000Z',
    productionDueDate: '2024-12-25T00:00:00.000Z',
    createdAt: '2024-12-10T00:00:00.000Z',
    updatedAt: '2024-12-26T00:00:00.000Z',
    paymentMethod: 'deposit_design',
    subtotal: 1200.00,
    totalPaid: 1200.00,
    balanceToPay: 0,
    designDepositApproved: true,
    productionDepositApproved: true,
    balancePaymentApproved: true,
    receipts: [],
    jobSheets: [],
    createdBy: 'admin',
    deliveryTrackingId: '',
  },
  {
    id: 'ORD-006',
    jobName: 'Student Club T-Shirts',
    clientId: '5',
    client: {
      id: '5',
      name: 'Student Club',
      email: 'contact@studentclub.edu',
      phone: '+60123456777',
      address: '22, Jalan Kampus, Bangi',
      totalOrders: 2,
      totalSpent: 2000.00,
      isActive: true,
      createdAt: '2024-05-01T00:00:00.000Z',
      updatedAt: '2024-05-10T00:00:00.000Z',
    },
    products: [
      {
        id: 'OP-006',
        productId: '5',
        product: {
          id: '5',
          name: 'T-Shirt',
          category: 'Apparel',
          price: 20.00,
          basePrice: 20.00,
          isActive: true,
          createdAt: '2024-04-01T00:00:00.000Z',
          updatedAt: '2024-04-01T00:00:00.000Z',
          stock: 100,
          description: '',
          tags: [],
        },
        quantity: 50,
        unitPrice: 20.00,
        totalPrice: 1000.00,
      },
    ],
    status: 'completed' as OrderStatus,
    deliveryMethod: 'self_collect',
    designDeposit: 200.00,
    productionDeposit: 300.00,
    balancePayment: 500.00,
    designDueDate: '2024-12-20T00:00:00.000Z',
    productionDueDate: '2024-12-28T00:00:00.000Z',
    createdAt: '2024-12-15T00:00:00.000Z',
    updatedAt: '2024-12-29T00:00:00.000Z',
    paymentMethod: 'deposit_production',
    subtotal: 1000.00,
    totalPaid: 1000.00,
    balanceToPay: 0,
    designDepositApproved: true,
    productionDepositApproved: true,
    balancePaymentApproved: true,
    receipts: [],
    jobSheets: [],
    createdBy: 'admin',
    deliveryTrackingId: '',
  },
];