import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  MapPinIcon,
  CalendarIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  PrinterIcon,
  ScissorsIcon,
  SparklesIcon,
  EyeIcon,
  ShieldCheckIcon,
  ArchiveBoxIcon,
} from '@heroicons/react/24/outline';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Badge from '../../components/UI/Badge';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { TrackingInfo } from '../../types';

interface TrackingStep {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending';
  completedAt?: Date;
  estimatedCompletion?: Date;
  icon: React.ComponentType<{ className?: string }>;
}

interface OrderTracking extends TrackingInfo {
  steps: TrackingStep[];
  clientInfo: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  orderDetails: {
    items: Array<{
      name: string;
      quantity: number;
      specifications?: string;
    }>;
    totalAmount: number;
    paymentStatus: string;
  };
  deliveryMethod: 'shipping' | 'self_collect';
  lastUpdated: Date;
}

const TrackingPage: React.FC = () => {
  const { trackingId: urlTrackingId } = useParams<{ trackingId?: string }>();
  const [trackingId, setTrackingId] = useState(urlTrackingId || '');
  const [trackingData, setTrackingData] = useState<OrderTracking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock tracking data
  const mockTrackingData: Record<string, OrderTracking> = {
    'TRK-2024-001': {
      orderId: 'ORD-001',
      status: 'in_production',
      currentStep: 'Printing',
      estimatedDelivery: new Date('2024-12-25'),
      deliveryMethod: 'shipping',
      deliveryTrackingId: 'DHL123456789',
      deliveryAddress: '123 Business Street, 10450 Kuala Lumpur',
      lastUpdated: new Date('2024-01-15T14:30:00'),
      clientInfo: {
        name: 'Ahmad Rahman',
        phone: '+60123456789',
        email: 'ahmad.rahman@business.com',
        address: '123 Business Street, 10450 Kuala Lumpur'
      },
      orderDetails: {
        items: [
          { name: 'Custom Business Cards', quantity: 1000, specifications: '350gsm, Matt Lamination' },
          { name: 'Company Brochures', quantity: 500, specifications: 'A4 Size, Full Color' }
        ],
        totalAmount: 450.00,
        paymentStatus: 'Paid'
      },
      steps: [
        {
          id: 'design',
          name: 'Design Approval',
          description: 'Design created and approved by client',
          status: 'completed',
          completedAt: new Date('2024-01-10T10:00:00'),
          icon: SparklesIcon
        },
        {
          id: 'print',
          name: 'Printing',
          description: 'Design printed on materials',
          status: 'in_progress',
          estimatedCompletion: new Date('2024-01-16T14:30:00'),
          icon: PrinterIcon
        },
        {
          id: 'qc',
          name: 'Quality Check',
          description: 'Quality inspection and testing',
          status: 'pending',
          estimatedCompletion: new Date('2024-01-18T16:00:00'),
          icon: ShieldCheckIcon
        },
        {
          id: 'pack',
          name: 'Packing',
          description: 'Final packaging and preparation',
          status: 'pending',
          estimatedCompletion: new Date('2024-01-20T12:00:00'),
          icon: ArchiveBoxIcon
        },
        {
          id: 'delivery',
          name: 'Delivery',
          description: 'Order shipped and on the way',
          status: 'pending',
          estimatedCompletion: new Date('2024-12-25T17:00:00'),
          icon: TruckIcon
        }
      ]
    },
    'ORD-001': {
      orderId: 'ORD-001',
      status: 'completed',
      currentStep: 'Delivered',
      estimatedDelivery: new Date('2024-12-20'),
      deliveryMethod: 'self_collect',
      deliveryTrackingId: 'DHL987654321',
      deliveryAddress: '456 Corporate Ave, 50450 Kuala Lumpur',
      lastUpdated: new Date('2024-12-20T16:45:00'),
      clientInfo: {
        name: 'Sarah Lee',
        phone: '+60198765432',
        email: 'sarah.lee@company.com',
        address: '456 Corporate Ave, 50450 Kuala Lumpur'
      },
      orderDetails: {
        items: [
          {
            name: 'Corporate Banners',
            quantity: 5,
            specifications: '3x6 feet, Vinyl Material'
          },
          {
            name: 'Event Flyers',
            quantity: 2000,
            specifications: 'A5 Size, Glossy Finish'
          }
        ],
        totalAmount: 750.00,
        paymentStatus: 'Paid'
      },
      steps: [
        {
          id: 'design',
          name: 'Design Approval',
          description: 'Design created and approved by client',
          status: 'completed',
          completedAt: new Date('2024-12-16T10:00:00'),
          icon: SparklesIcon
        },
        {
          id: 'print',
          name: 'Printing',
          description: 'Design printed on materials',
          status: 'completed',
          completedAt: new Date('2024-12-17T14:30:00'),
          icon: PrinterIcon
        },
        {
          id: 'press',
          name: 'Heat Press',
          description: 'Heat press application for durability',
          status: 'completed',
          completedAt: new Date('2024-12-18T09:15:00'),
          icon: SparklesIcon
        },
        {
          id: 'cut',
          name: 'Cutting',
          description: 'Precision cutting and trimming',
          status: 'completed',
          completedAt: new Date('2024-12-18T11:45:00'),
          icon: ScissorsIcon
        },
        {
          id: 'sew',
          name: 'Sewing',
          description: 'Final stitching and assembly',
          status: 'completed',
          completedAt: new Date('2024-12-18T13:20:00'),
          icon: SparklesIcon
        },
        {
          id: 'qc',
          name: 'Quality Check',
          description: 'Quality inspection and testing',
          status: 'completed',
          completedAt: new Date('2024-12-19T16:00:00'),
          icon: ShieldCheckIcon
        },
        {
          id: 'pack',
          name: 'Packing',
          description: 'Final packaging and preparation',
          status: 'completed',
          completedAt: new Date('2024-12-20T12:00:00'),
          icon: ArchiveBoxIcon
        },
        {
          id: 'delivery',
          name: 'Delivery',
          description: 'Order shipped and delivered',
          status: 'completed',
          completedAt: new Date('2024-12-20T16:45:00'),
          icon: TruckIcon
        }
      ]
    },
    'ORD-002': {
      orderId: 'ORD-002',
      status: 'completed',
      currentStep: 'Delivered',
      estimatedDelivery: new Date('2024-12-15'),
      deliveryMethod: 'self_collect',
      lastUpdated: new Date('2024-12-15T16:30:00'),
      clientInfo: {
        name: 'Sarah Wilson',
        phone: '+60198765432',
        email: 'sarah.wilson@company.com',
        address: 'Office Collection Point'
      },
      orderDetails: {
        items: [
          {
            name: 'Custom Hoodies',
            quantity: 25,
            specifications: 'Black, Premium Cotton, Embroidered Logo'
          }
        ],
        totalAmount: 875.00,
        paymentStatus: 'Paid'
      },
      steps: [
        {
          id: 'design',
          name: 'Design Approval',
          description: 'Design created and approved by client',
          status: 'completed',
          completedAt: new Date('2024-12-10T09:00:00'),
          icon: SparklesIcon
        },
        {
          id: 'print',
          name: 'Printing',
          description: 'Design printed on materials',
          status: 'completed',
          completedAt: new Date('2024-12-12T11:30:00'),
          icon: PrinterIcon
        },
        {
          id: 'press',
          name: 'Heat Press',
          description: 'Heat press application for durability',
          status: 'completed',
          completedAt: new Date('2024-12-12T15:45:00'),
          icon: SparklesIcon
        },
        {
          id: 'cut',
          name: 'Cutting',
          description: 'Precision cutting and trimming',
          status: 'completed',
          completedAt: new Date('2024-12-13T10:20:00'),
          icon: ScissorsIcon
        },
        {
          id: 'sew',
          name: 'Sewing',
          description: 'Final stitching and assembly',
          status: 'completed',
          completedAt: new Date('2024-12-14T14:15:00'),
          icon: SparklesIcon
        },
        {
          id: 'qc',
          name: 'Quality Check',
          description: 'Quality inspection and testing',
          status: 'completed',
          completedAt: new Date('2024-12-15T09:30:00'),
          icon: ShieldCheckIcon
        },
        {
          id: 'pack',
          name: 'Packing',
          description: 'Final packaging and preparation',
          status: 'completed',
          completedAt: new Date('2024-12-15T11:00:00'),
          icon: ArchiveBoxIcon
        },
        {
          id: 'delivery',
          name: 'Ready for Collection',
          description: 'Order ready for pickup',
          status: 'completed',
          completedAt: new Date('2024-12-15T16:30:00'),
          icon: CheckCircleIcon
        }
      ]
    },
    'ORD-003': {
      orderId: 'ORD-003',
      status: 'pending',
      currentStep: 'Design Approval',
      estimatedDelivery: new Date('2024-12-30'),
      deliveryMethod: 'shipping',
      deliveryTrackingId: undefined,
      deliveryAddress: '123 Business Street, 10450 Kuala Lumpur',
      lastUpdated: new Date('2024-12-18T09:00:00'),
      clientInfo: {
        name: 'Ahmad Rahman',
        phone: '+60123456789',
        email: 'ahmad.rahman@business.com',
        address: '123 Business Street, 10450 Kuala Lumpur'
      },
      orderDetails: {
        items: [
          { name: 'Custom Business Cards', quantity: 1000, specifications: '350gsm, Matt Lamination' },
          { name: 'Company Brochures', quantity: 500, specifications: 'A4 Size, Full Color' }
        ],
        totalAmount: 450.00,
        paymentStatus: 'Paid'
      },
      steps: [
        {
          id: 'design',
          name: 'Design Approval',
          description: 'Design created and awaiting client approval',
          status: 'in_progress',
          estimatedCompletion: new Date('2024-12-20T17:00:00'),
          icon: SparklesIcon
        },
        {
          id: 'print',
          name: 'Printing',
          description: 'Design printed on materials',
          status: 'pending',
          estimatedCompletion: new Date('2024-12-23T14:30:00'),
          icon: PrinterIcon
        },
        {
          id: 'qc',
          name: 'Quality Check',
          description: 'Quality inspection and testing',
          status: 'pending',
          estimatedCompletion: new Date('2024-12-27T16:00:00'),
          icon: ShieldCheckIcon
        },
        {
          id: 'pack',
          name: 'Packing',
          description: 'Final packaging and preparation',
          status: 'pending',
          estimatedCompletion: new Date('2024-12-28T12:00:00'),
          icon: ArchiveBoxIcon
        },
        {
          id: 'delivery',
          name: 'Delivery',
          description: 'Order shipped and on the way',
          status: 'pending',
          estimatedCompletion: new Date('2024-12-30T17:00:00'),
          icon: TruckIcon
        }
      ]
    }
  };

  // Auto-track if URL has tracking ID
  useEffect(() => {
    if (urlTrackingId) {
      handleTrack();
    }
  }, [urlTrackingId]);

  const handleTrack = async () => {
    if (!trackingId.trim()) {
      setError('Please enter a tracking ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const data = mockTrackingData[trackingId.toUpperCase()];
      if (data) {
        setTrackingData(data);
      } else {
        setError('Order not found. Please check your tracking ID and try again.');
      }
    } catch (err) {
      setError('Failed to fetch tracking information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      case 'pending': return 'secondary';
      default: return 'secondary';
    }
  };

  const getOverallStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      case 'pending': return 'secondary';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const formatCurrency = (amount: number) => {
    return `RM ${amount.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-gray-900">Order Tracking</h1>
            <p className="text-gray-600 mt-2">
              Track your order progress in real-time
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <Card.Body>
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="bg-primary-100 p-3 rounded-full">
                    <MagnifyingGlassIcon className="h-8 w-8 text-primary-600" />
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Enter Your Tracking ID
                  </h2>
                  <p className="text-gray-600">
                    Enter your order ID to track your order status
                  </p>
                </div>
                
                <div className="max-w-md mx-auto space-y-4">
                  <Input
                    placeholder="e.g., ORD-001"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
                    icon={<MagnifyingGlassIcon />}
                    fullWidth
                  />
                  
                  <Button
                    onClick={handleTrack}
                    loading={loading}
                    className="w-full"
                  >
                    Track Order
                  </Button>
                </div>
                
                {/* Demo IDs */}
                <div className="text-sm text-gray-500">
                  <p className="mb-2">Demo tracking IDs:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {Object.keys(mockTrackingData).map(id => (
                      <button
                        key={id}
                        onClick={() => setTrackingId(id)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors"
                      >
                        {id}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6"
          >
            <Card>
              <Card.Body>
                <div className="flex items-center space-x-3 text-danger-600">
                  <ExclamationCircleIcon className="h-6 w-6" />
                  <span>{error}</span>
                </div>
              </Card.Body>
            </Card>
          </motion.div>
        )}

        {/* Tracking Results */}
        {trackingData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 space-y-6"
          >
            {/* Order Summary */}
            <Card>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Order Summary</h3>
                  <Badge variant={getOverallStatusColor(trackingData.status)} size="lg">
                    {trackingData.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </Card.Header>
              <Card.Body>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-semibold text-gray-900">{trackingData.orderId}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">Current Step</p>
                    <p className="font-semibold text-gray-900">{trackingData.currentStep}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">Estimated Delivery</p>
                    <p className="font-semibold text-gray-900">
                      {trackingData.estimatedDelivery.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">Delivery Method</p>
                    <p className="font-semibold text-gray-900">
                      {trackingData.deliveryMethod === 'shipping' ? 'Shipping' : 'Self Collection'}
                    </p>
                  </div>
                </div>
                
                {trackingData.deliveryTrackingId && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <TruckIcon className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        Delivery Tracking ID: {trackingData.deliveryTrackingId}
                      </span>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Progress Timeline */}
            <Card>
              <Card.Header>
                <h3 className="text-xl font-semibold">Production Progress</h3>
              </Card.Header>
              <Card.Body>
                <div className="space-y-6">
                  {trackingData.steps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = step.status === 'completed';
                    const isInProgress = step.status === 'in_progress';
                    const isPending = step.status === 'pending';
                    
                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative flex items-start space-x-4"
                      >
                        {/* Timeline Line */}
                        {index < trackingData.steps.length - 1 && (
                          <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200">
                            {isCompleted && (
                              <div className="w-full bg-success-500 h-full"></div>
                            )}
                          </div>
                        )}
                        
                        {/* Step Icon */}
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                          isCompleted ? 'bg-success-500 text-white' :
                          isInProgress ? 'bg-warning-500 text-white' :
                          'bg-gray-200 text-gray-500'
                        }`}>
                          {isCompleted ? (
                            <CheckCircleIcon className="h-6 w-6" />
                          ) : (
                            <Icon className="h-6 w-6" />
                          )}
                        </div>
                        
                        {/* Step Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-lg font-medium text-gray-900">
                                {step.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {step.description}
                              </p>
                            </div>
                            <Badge variant={getStatusColor(step.status)} size="sm">
                              {step.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          
                          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                            {step.completedAt && (
                              <div className="flex items-center space-x-1">
                                <CheckCircleIcon className="h-4 w-4" />
                                <span>Completed: {step.completedAt.toLocaleString()}</span>
                              </div>
                            )}
                            {step.estimatedCompletion && !step.completedAt && (
                              <div className="flex items-center space-x-1">
                                <ClockIcon className="h-4 w-4" />
                                <span>Estimated: {step.estimatedCompletion.toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>

            {/* Order Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Client Information */}
              <Card>
                <Card.Header>
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                </Card.Header>
                <Card.Body>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-semibold text-sm">
                            {trackingData.clientInfo.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{trackingData.clientInfo.name}</p>
                        <p className="text-sm text-gray-600">Customer</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-900">{trackingData.clientInfo.phone}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-900">{trackingData.clientInfo.email}</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                        <span className="text-gray-900">{trackingData.clientInfo.address}</span>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Order Items */}
              <Card>
                <Card.Header>
                  <h3 className="text-lg font-semibold">Order Items</h3>
                </Card.Header>
                <Card.Body>
                  <div className="space-y-4">
                    {trackingData.orderDetails.items.map((item, index) => (
                      <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            {item.specifications && (
                              <p className="text-sm text-gray-600 mt-1">{item.specifications}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">Total Amount:</span>
                        <span className="font-bold text-lg text-gray-900">
                          {formatCurrency(trackingData.orderDetails.totalAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-600">Payment Status:</span>
                        <Badge variant="success" size="sm">
                          {trackingData.orderDetails.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>

            {/* Last Updated */}
            <Card>
              <Card.Body>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Last updated: {trackingData.lastUpdated.toLocaleString()}</span>
                </div>
              </Card.Body>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TrackingPage;