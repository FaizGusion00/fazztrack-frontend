import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  CalendarIcon,
  DocumentArrowDownIcon,
  PhotoIcon,
  DocumentIcon,
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
import type { Order, Payment } from '../../types';

interface PaymentRecord {
  id: string;
  orderId: string;
  orderJobName: string;
  clientName: string;
  type: 'design' | 'production' | 'balance';
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  paymentDate: Date;
  dueDate: Date;
  paymentMethod: string;
  approvedBy?: string;
  approvedAt?: Date;
  rejectedReason?: string;
  createdAt: Date;
  updatedAt: Date;
  // Receipt proof fields
  receiptProof?: {
    id: string;
    fileName: string;
    fileType: 'pdf' | 'image';
    fileUrl: string;
    fileSize: number;
    uploadedAt: Date;
    description?: string;
  }[];
  receiptNotes?: string;
}

const PaymentsPage: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPayments: PaymentRecord[] = [
        {
          id: 'PAY-001',
          orderId: 'ORD-001',
          orderJobName: 'Corporate Event T-Shirts',
          clientName: 'ABC Corporation',
          type: 'design',
          amount: 200.00,
          status: 'pending',
          paymentDate: new Date('2024-12-17'),
          dueDate: new Date('2024-12-25'),
          paymentMethod: 'Bank Transfer',
          createdAt: new Date('2024-12-15'),
          updatedAt: new Date('2024-12-15'),
          receiptProof: [
            {
              id: 'REC-001',
              fileName: 'bank_transfer_receipt.pdf',
              fileType: 'pdf',
              fileUrl: '/receipts/bank_transfer_receipt.pdf',
              fileSize: 245760,
              uploadedAt: new Date('2024-12-17T10:30:00'),
              description: 'Bank transfer confirmation slip'
            }
          ],
          receiptNotes: 'Payment transferred via online banking. Reference: ABC001'
        },
        {
          id: 'PAY-002',
          orderId: 'ORD-001',
          orderJobName: 'Corporate Event T-Shirts',
          clientName: 'ABC Corporation',
          type: 'production',
          amount: 500.00,
          status: 'pending',
          paymentDate: new Date('2024-12-17'),
          dueDate: new Date('2024-12-31'),
          paymentMethod: 'Bank Transfer',
          createdAt: new Date('2024-12-15'),
          updatedAt: new Date('2024-12-15'),
          receiptProof: [
            {
              id: 'REC-002',
              fileName: 'payment_screenshot.jpg',
              fileType: 'image',
              fileUrl: '/receipts/payment_screenshot.jpg',
              fileSize: 512000,
              uploadedAt: new Date('2024-12-17T14:15:00'),
              description: 'Mobile banking payment screenshot'
            },
            {
              id: 'REC-003',
              fileName: 'transaction_details.pdf',
              fileType: 'pdf',
              fileUrl: '/receipts/transaction_details.pdf',
              fileSize: 189440,
              uploadedAt: new Date('2024-12-17T14:20:00'),
              description: 'Detailed transaction receipt'
            }
          ],
          receiptNotes: 'Production payment completed. Transaction ID: TXN789456'
        },
        {
          id: 'PAY-003',
          orderId: 'ORD-002',
          orderJobName: 'Marketing Campaign Hoodies',
          clientName: 'XYZ Solutions',
          type: 'design',
          amount: 275.00,
          status: 'approved',
          paymentDate: new Date('2024-12-12'),
          dueDate: new Date('2024-12-20'),
          paymentMethod: 'Credit Card',
          approvedBy: 'Admin User',
          approvedAt: new Date('2024-12-12'),
          createdAt: new Date('2024-12-10'),
          updatedAt: new Date('2024-12-12'),
          receiptProof: [
            {
              id: 'REC-004',
              fileName: 'credit_card_receipt.pdf',
              fileType: 'pdf',
              fileUrl: '/receipts/credit_card_receipt.pdf',
              fileSize: 156672,
              uploadedAt: new Date('2024-12-12T09:45:00'),
              description: 'Credit card payment receipt'
            }
          ],
          receiptNotes: 'Payment processed successfully via credit card'
        },
        {
          id: 'PAY-004',
          orderId: 'ORD-002',
          orderJobName: 'Marketing Campaign Hoodies',
          clientName: 'XYZ Solutions',
          type: 'production',
          amount: 550.00,
          status: 'approved',
          paymentDate: new Date('2024-12-12'),
          dueDate: new Date('2024-12-28'),
          paymentMethod: 'Credit Card',
          approvedBy: 'Admin User',
          approvedAt: new Date('2024-12-12'),
          createdAt: new Date('2024-12-10'),
          updatedAt: new Date('2024-12-12'),
          receiptProof: [
            {
              id: 'REC-005',
              fileName: 'production_payment_receipt.pdf',
              fileType: 'pdf',
              fileUrl: '/receipts/production_payment_receipt.pdf',
              fileSize: 198656,
              uploadedAt: new Date('2024-12-12T11:20:00'),
              description: 'Production payment confirmation'
            }
          ],
          receiptNotes: 'Production payment approved and processed'
        },
        {
          id: 'PAY-005',
          orderId: 'ORD-003',
          orderJobName: 'School Uniform Project',
          clientName: 'Education Board',
          type: 'design',
          amount: 150.00,
          status: 'rejected',
          paymentDate: new Date('2024-12-10'),
          dueDate: new Date('2024-12-18'),
          paymentMethod: 'Cheque',
          rejectedReason: 'Insufficient payment proof documentation',
          createdAt: new Date('2024-12-08'),
          updatedAt: new Date('2024-12-09'),
          receiptProof: [
            {
              id: 'REC-006',
              fileName: 'cheque_image.jpg',
              fileType: 'image',
              fileUrl: '/receipts/cheque_image.jpg',
              fileSize: 345600,
              uploadedAt: new Date('2024-12-10T16:30:00'),
              description: 'Cheque image (unclear)'
            }
          ],
          receiptNotes: 'Cheque payment - image quality needs improvement'
        },
      ];
      
      setPayments(mockPayments);
      setLoading(false);
    };

    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.orderJobName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesType = typeFilter === 'all' || payment.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleViewPayment = (payment: PaymentRecord) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
    setShowRejectionModal(false);
    setRejectionReason('');
  };

  const handleApprovePayment = async (paymentId: string) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPayments(prev => prev.map(payment => 
        payment.id === paymentId 
          ? {
              ...payment,
              status: 'approved' as const,
              approvedBy: user?.name || 'Current User',
              approvedAt: new Date(),
              updatedAt: new Date(),
            }
          : payment
      ));
      
      handleCloseModal();
    } catch (error) {
      console.error('Error approving payment:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectPayment = async (paymentId: string, reason: string) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPayments(prev => prev.map(payment => 
        payment.id === paymentId 
          ? {
              ...payment,
              status: 'rejected' as const,
              rejectedReason: reason,
              updatedAt: new Date(),
            }
          : payment
      ));
      
      handleCloseModal();
    } catch (error) {
      console.error('Error rejecting payment:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-4 w-4" />;
      case 'approved':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'rejected':
        return <XCircleIcon className="h-4 w-4" />;
      default:
        return <DocumentTextIcon className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'design':
        return 'primary';
      case 'production':
        return 'secondary';
      case 'balance':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const canApprove = hasPermission('approve_payments') && (user?.department === 'superadmin' || user?.department === 'admin' );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  const pendingCount = payments.filter(p => p.status === 'pending').length;
  const approvedCount = payments.filter(p => p.status === 'approved').length;
  const rejectedCount = payments.filter(p => p.status === 'rejected').length;
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

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
          <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600 mt-2">
            Review and approve payment deposits for orders
          </p>
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
                <ClockIcon className="h-8 w-8 text-warning-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
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

        <Card>
          <Card.Body>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-8 w-8 text-danger-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{rejectedCount}</p>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-8 w-8 text-primary-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">RM {totalAmount.toLocaleString()}</p>
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
                  placeholder="Search payments by order, client, or payment ID..."
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
                    { value: 'approved', label: 'Approved' },
                    { value: 'rejected', label: 'Rejected' },
                  ]}
                />
              </div>
              <div className="w-full lg:w-48">
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Types' },
                    { value: 'design', label: 'Design Deposit' },
                    { value: 'production', label: 'Production Deposit' },
                    { value: 'balance', label: 'Balance Payment' },
                  ]}
                />
              </div>
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      {/* Payments List */}
      <div className="space-y-4">
        {filteredPayments.map((payment, index) => (
          <motion.div
            key={payment.id}
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
                        {payment.orderJobName}
                      </h3>
                      <Badge
                        variant={getStatusColor(payment.status) as any}
                        className="flex items-center space-x-1"
                      >
                        {getStatusIcon(payment.status)}
                        <span className="capitalize">{payment.status}</span>
                      </Badge>
                      <Badge
                        variant={getTypeColor(payment.type) as any}
                        size="sm"
                      >
                        {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Payment ID:</span> {payment.id}
                      </div>
                      <div>
                        <span className="font-medium">Order ID:</span> {payment.orderId}
                      </div>
                      <div>
                        <span className="font-medium">Client:</span> {payment.clientName}
                      </div>
                      <div>
                        <span className="font-medium">Amount:</span> RM {payment.amount.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Payment Date:</span> {payment.paymentDate.toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Due Date:</span> {payment.dueDate.toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Method:</span> {payment.paymentMethod}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Receipt Proof:</span>
                        {payment.receiptProof && payment.receiptProof.length > 0 ? (
                          <Badge size="sm" className="bg-green-100 text-green-700 border-green-200">
                            <DocumentTextIcon className="h-3 w-3 mr-1" />
                            {payment.receiptProof.length} file{payment.receiptProof.length !== 1 ? 's' : ''}
                          </Badge>
                        ) : (
                          <Badge size="sm" className="bg-yellow-100 text-yellow-700 border-yellow-200">
                            <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                            Not provided
                          </Badge>
                        )}
                      </div>
                      {payment.approvedBy && (
                        <div>
                          <span className="font-medium">Approved by:</span> {payment.approvedBy}
                        </div>
                      )}
                    </div>
                    
                    {payment.rejectedReason && (
                      <div className="mt-2 p-2 bg-danger-50 rounded-lg">
                        <p className="text-sm text-danger-700">
                          <span className="font-medium">Rejection Reason:</span> {payment.rejectedReason}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2 mt-4 lg:mt-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewPayment(payment)}
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    
                    {payment.status === 'pending' && canApprove && (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleApprovePayment(payment.id)}
                          loading={isProcessing}
                        >
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            setSelectedPayment(payment);
                            setShowRejectionModal(true);
                          }}
                        >
                          <XCircleIcon className="h-4 w-4 mr-1" />
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

      {filteredPayments.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <CurrencyDollarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No payments found
          </h3>
          <p className="text-gray-600">
            {searchTerm ? 'Try adjusting your search criteria.' : 'No payment records available.'}
          </p>
        </motion.div>
      )}

      {/* Payment Details Modal */}
      <Modal
        isOpen={isModalOpen && !showRejectionModal}
        onClose={handleCloseModal}
        size="lg"
      >
        {selectedPayment && (
          <>
            <Modal.Header>
              <h3 className="text-lg font-semibold">
                Payment Details - {selectedPayment.id}
              </h3>
            </Modal.Header>
            <Modal.Body>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Payment ID</label>
                    <p className="text-gray-900">{selectedPayment.id}</p>
                  </div>
                  <div>
                    <label className="form-label">Order ID</label>
                    <p className="text-gray-900">{selectedPayment.orderId}</p>
                  </div>
                  <div>
                    <label className="form-label">Job Name</label>
                    <p className="text-gray-900">{selectedPayment.orderJobName}</p>
                  </div>
                  <div>
                    <label className="form-label">Client</label>
                    <p className="text-gray-900">{selectedPayment.clientName}</p>
                  </div>
                  <div>
                    <label className="form-label">Payment Type</label>
                    <Badge variant={getTypeColor(selectedPayment.type) as any}>
                      {selectedPayment.type.charAt(0).toUpperCase() + selectedPayment.type.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <label className="form-label">Status</label>
                    <Badge variant={getStatusColor(selectedPayment.status) as any}>
                      {selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <label className="form-label">Amount</label>
                    <p className="text-gray-900 text-lg font-semibold">RM {selectedPayment.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="form-label">Payment Method</label>
                    <p className="text-gray-900">{selectedPayment.paymentMethod}</p>
                  </div>
                  <div>
                    <label className="form-label">Payment Date</label>
                    <p className="text-gray-900">{selectedPayment.paymentDate.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="form-label">Due Date</label>
                    <p className="text-gray-900">{selectedPayment.dueDate.toLocaleDateString()}</p>
                  </div>
                </div>
                
                {selectedPayment.approvedBy && (
                  <div className="p-4 bg-success-50 rounded-lg">
                    <h4 className="font-medium text-success-900 mb-2">Approval Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-success-700">Approved by:</span>
                        <p className="text-success-900">{selectedPayment.approvedBy}</p>
                      </div>
                      <div>
                        <span className="font-medium text-success-700">Approved at:</span>
                        <p className="text-success-900">{selectedPayment.approvedAt?.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedPayment.rejectedReason && (
                  <div className="p-4 bg-danger-50 rounded-lg">
                    <h4 className="font-medium text-danger-900 mb-2">Rejection Information</h4>
                    <p className="text-danger-700">{selectedPayment.rejectedReason}</p>
                  </div>
                )}
                
                {/* Receipt Proof Section */}
                {selectedPayment.receiptProof && selectedPayment.receiptProof.length > 0 && (
                  <div className="border-t pt-6">
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                      Receipt Proof
                    </h4>
                    
                    <div className="space-y-3">
                      {selectedPayment.receiptProof.map((receipt) => (
                        <div key={receipt.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              {receipt.fileType === 'pdf' ? (
                                <DocumentIcon className="h-8 w-8 text-red-500" />
                              ) : (
                                <PhotoIcon className="h-8 w-8 text-blue-500" />
                              )}
                              <div>
                                <h5 className="font-medium text-gray-900 text-sm">{receipt.fileName}</h5>
                                <p className="text-xs text-gray-600">{receipt.description}</p>
                                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                  <span>Size: {formatFileSize(receipt.fileSize)}</span>
                                  <span>Uploaded: {receipt.uploadedAt.toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => window.open(receipt.fileUrl, '_blank')}
                                className="h-8 px-3 text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                              >
                                <EyeIcon className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = receipt.fileUrl;
                                  link.download = receipt.fileName;
                                  link.click();
                                }}
                                className="h-8 px-3 text-xs bg-green-600 hover:bg-green-700 text-white border-green-600"
                              >
                                <DocumentArrowDownIcon className="h-3 w-3 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {selectedPayment.receiptNotes && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <h5 className="font-medium text-blue-900 mb-1 text-sm">Payment Notes</h5>
                        <p className="text-sm text-blue-800">{selectedPayment.receiptNotes}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* No Receipt Proof Warning */}
                {(!selectedPayment.receiptProof || selectedPayment.receiptProof.length === 0) && (
                  <div className="border-t pt-6">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-medium text-yellow-900 mb-2 flex items-center gap-2">
                        <ExclamationTriangleIcon className="h-5 w-5" />
                        No Receipt Proof Provided
                      </h4>
                      <p className="text-sm text-yellow-800">
                        This payment does not have any receipt proof uploaded. Please request the customer to provide payment confirmation before approval.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <div className="flex justify-between w-full">
                <Button variant="ghost" onClick={handleCloseModal}>
                  Close
                </Button>
                
                {selectedPayment.status === 'pending' && canApprove && (
                  <div className="flex space-x-3">
                    <Button
                      variant="danger"
                      onClick={() => {
                        setShowRejectionModal(true);
                      }}
                    >
                      <XCircleIcon className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button
                      variant="success"
                      onClick={() => handleApprovePayment(selectedPayment.id)}
                      loading={isProcessing}
                    >
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      Approve Payment
                    </Button>
                  </div>
                )}
              </div>
            </Modal.Footer>
          </>
        )}
      </Modal>

      {/* Rejection Modal */}
      <Modal
        isOpen={showRejectionModal}
        onClose={handleCloseModal}
        size="md"
      >
        <Modal.Header>
          <h3 className="text-lg font-semibold text-danger-900">
            Reject Payment
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <p className="text-gray-700">
              Please provide a reason for rejecting this payment:
            </p>
            <div>
              <label className="form-label">Rejection Reason</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="input"
                placeholder="Enter the reason for rejection..."
                required
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex space-x-3">
            <Button variant="ghost" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (selectedPayment && rejectionReason.trim()) {
                  handleRejectPayment(selectedPayment.id, rejectionReason);
                }
              }}
              loading={isProcessing}
              disabled={!rejectionReason.trim()}
            >
              <XCircleIcon className="h-4 w-4 mr-1" />
              Reject Payment
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PaymentsPage;