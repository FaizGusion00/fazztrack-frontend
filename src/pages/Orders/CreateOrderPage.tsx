import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  UserIcon,
  DocumentIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  PlusIcon,
  TrashIcon,
  CloudArrowUpIcon,
  LinkIcon,
  CalendarIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Select from '../../components/UI/Select';
import Badge from '../../components/UI/Badge';
import { Client, Product, Order } from '../../types';

interface OrderForm {
  jobName: string;
  clientId: string;
  newClient: {
    name: string;
    phone: string;
    email: string;
    billingAddress: string;
    shippingAddress: string;
    useDifferentShipping: boolean;
  };
  deliveryMethod: 'self_collect' | 'shipping';
  receipts: File[];
  jobSheets: File[];
  downloadLink: string;
  products: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  remarks: string;
  designDeposit: number;
  designPaymentDate: string;
  designDueDate: string;
  productionDeposit: number;
  productionPaymentDate: string;
  productionDueDate: string;
  balancePayment: number;
  balancePaymentDate: string;
  paymentMethod: string;
}

const CreateOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { user, hasPermission } = useAuth();
  const isEditing = Boolean(id);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check permissions
  useEffect(() => {
    if (!hasPermission('orders') && !isEditing) {
      navigate('/orders');
    }
    if (!hasPermission('orders') && isEditing) {
      navigate('/orders');
    }
  }, [hasPermission, isEditing, navigate]);

  const [form, setForm] = useState<OrderForm>({
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
    deliveryMethod: 'self_collect',
    receipts: [],
    jobSheets: [],
    downloadLink: '',
    products: [{ productId: '', quantity: 0, price: 0 }],
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

  // Mock data
  const mockClients: Client[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+60123456789',
      company: 'ABC Corp',
      address: 'Lot 1112, Kampung Baru, 50300 KL',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      email: 'sarah@company.com',
      phone: '+60198765432',
      company: 'XYZ Ltd',
      address: '123 Business Street, 50400 KL',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Cotton T-Shirt',
      category: 'T-Shirts',
      price: 25.00,
      basePrice: 25.00,
      stock: 100,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Premium Hoodie',
      category: 'Hoodies',
      price: 65.00,
      basePrice: 65.00,
      stock: 50,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const paymentMethods = [
    { value: 'skip_vip_agent', label: 'Skip Payment (VIP/Agent)' },
    { value: 'skip_vip_user', label: 'Skip Payment (VIP/End User)' },
    { value: 'deposit_design', label: 'Deposit Design' },
    { value: 'deposit_production', label: 'Deposit Production' },
  ];

  const steps = [
    { id: 1, name: 'Customer Details', icon: UserIcon },
    { id: 2, name: 'File Attachments', icon: DocumentIcon },
    { id: 3, name: 'Products', icon: ShoppingBagIcon },
    { id: 4, name: 'Payment & Details', icon: CreditCardIcon },
  ];

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('newClient.')) {
      const clientField = field.replace('newClient.', '');
      setForm(prev => ({
        ...prev,
        newClient: {
          ...prev.newClient,
          [clientField]: value,
        },
      }));
    } else {
      setForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleProductChange = (index: number, field: string, value: any) => {
    setForm(prev => ({
      ...prev,
      products: prev.products.map((product, i) => 
        i === index ? { ...product, [field]: value } : product
      ),
    }));
  };

  const addProduct = () => {
    setForm(prev => ({
      ...prev,
      products: [...prev.products, { productId: '', quantity: 0, price: 0 }],
    }));
  };

  const removeProduct = (index: number) => {
    if (form.products.length > 1) {
      setForm(prev => ({
        ...prev,
        products: prev.products.filter((_, i) => i !== index),
      }));
    }
  };

  const handleFileUpload = (field: 'receipts' | 'jobSheets', files: FileList | null) => {
    if (files) {
      setForm(prev => ({
        ...prev,
        [field]: [...prev[field], ...Array.from(files)],
      }));
    }
  };

  const removeFile = (field: 'receipts' | 'jobSheets', index: number) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const calculateTotals = () => {
    const subtotal = form.products.reduce((sum, product) => {
      return sum + (product.quantity * product.price);
    }, 0);
    
    const totalPaid = form.designDeposit + form.productionDeposit;
    const balance = subtotal - totalPaid;
    
    return { subtotal, totalPaid, balance };
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would make the actual API call
      console.log('Order data:', form);
      
      navigate('/orders');
    } catch (error) {
      console.error('Error saving order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const { subtotal, totalPaid, balance } = calculateTotals();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/orders')}
            className="p-2"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Order' : 'Create New Order'}
            </h1>
            <p className="text-gray-600">
              {isEditing ? 'Update order details' : 'Fill in the order information'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Progress Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center space-x-2 ${
                      isActive ? 'text-primary-600' : 
                      isCompleted ? 'text-success-600' : 'text-gray-400'
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isActive ? 'bg-primary-100' :
                        isCompleted ? 'bg-success-100' : 'bg-gray-100'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="font-medium text-sm">{step.name}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-0.5 mx-4 ${
                        isCompleted ? 'bg-success-300' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      {/* Form Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Step 1: Customer Details */}
        {currentStep === 1 && (
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Customer Details</h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-6">
                {/* Job Name */}
                <Input
                  label="Job Name *"
                  value={form.jobName}
                  onChange={(e) => handleInputChange('jobName', e.target.value)}
                  placeholder="Enter job name"
                  fullWidth
                />

                {/* Client Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose Client
                  </label>
                  <Select
                    value={form.clientId}
                    onChange={(e) => handleInputChange('clientId', e.target.value)}
                    options={[
                      { value: '', label: 'Select existing client or create new' },
                      ...mockClients.map(client => ({
                        value: client.id,
                        label: `${client.name} - ${client.company}`,
                      })),
                      { value: 'new', label: '+ Create New Customer' },
                    ]}
                    fullWidth
                  />
                </div>

                {/* New Customer Form */}
                {form.clientId === 'new' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <h4 className="font-medium text-gray-900">New Customer Details</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Customer Name *"
                        value={form.newClient.name}
                        onChange={(e) => handleInputChange('newClient.name', e.target.value)}
                        placeholder="John Doe"
                        fullWidth
                      />
                      <Input
                        label="Customer Phone *"
                        value={form.newClient.phone}
                        onChange={(e) => handleInputChange('newClient.phone', e.target.value)}
                        placeholder="60123456789"
                        fullWidth
                      />
                    </div>
                    
                    <Input
                      label="Customer Email"
                      type="email"
                      value={form.newClient.email}
                      onChange={(e) => handleInputChange('newClient.email', e.target.value)}
                      placeholder="customer@mail.com"
                      fullWidth
                    />
                    
                    <Input
                      label="Billing Address"
                      value={form.newClient.billingAddress}
                      onChange={(e) => handleInputChange('newClient.billingAddress', e.target.value)}
                      placeholder="Lot 1112 Kampung..."
                      fullWidth
                    />
                  </motion.div>
                )}

                {/* Delivery Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Method
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="self_collect"
                        checked={form.deliveryMethod === 'self_collect'}
                        onChange={(e) => handleInputChange('deliveryMethod', e.target.value)}
                        className="mr-2"
                      />
                      Self Collect
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="shipping"
                        checked={form.deliveryMethod === 'shipping'}
                        onChange={(e) => handleInputChange('deliveryMethod', e.target.value)}
                        className="mr-2"
                      />
                      Shipping
                    </label>
                  </div>
                </div>

                {/* Shipping Address */}
                {form.deliveryMethod === 'shipping' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={form.newClient.useDifferentShipping}
                        onChange={(e) => handleInputChange('newClient.useDifferentShipping', e.target.checked)}
                        className="mr-2"
                      />
                      <label className="text-sm text-gray-700">
                        Use different customer information for shipping?
                      </label>
                    </div>
                    
                    <Input
                      label="Delivery Address"
                      value={form.newClient.shippingAddress}
                      onChange={(e) => handleInputChange('newClient.shippingAddress', e.target.value)}
                      placeholder="Lot 1112 Kampung..."
                      fullWidth
                    />
                  </motion.div>
                )}
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Step 2: File Attachments */}
        {currentStep === 2 && (
          <div className="space-y-6">
            {/* Receipts */}
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold">File Attachment (Receipts)</h3>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                    <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">DRAG OR UPLOAD YOUR FILES</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload('receipts', e.target.files)}
                      className="hidden"
                      id="receipts-upload"
                    />
                    <label htmlFor="receipts-upload">
                      <Button variant="secondary" className="cursor-pointer">
                        Choose Files
                      </Button>
                    </label>
                  </div>
                  
                  {form.receipts.length > 0 && (
                    <div className="space-y-2">
                      {form.receipts.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile('receipts', index)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>

            {/* Job Sheets & Download Link */}
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold">File Attachment (Job Sheet & Link Download)</h3>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                    <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">DRAG OR UPLOAD YOUR FILES</p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                      onChange={(e) => handleFileUpload('jobSheets', e.target.files)}
                      className="hidden"
                      id="jobsheets-upload"
                    />
                    <label htmlFor="jobsheets-upload">
                      <Button variant="secondary" className="cursor-pointer">
                        Choose Files
                      </Button>
                    </label>
                  </div>
                  
                  {form.jobSheets.length > 0 && (
                    <div className="space-y-2">
                      {form.jobSheets.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile('jobSheets', index)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <Input
                    label="Link Download"
                    value={form.downloadLink}
                    onChange={(e) => handleInputChange('downloadLink', e.target.value)}
                    placeholder="https://..."
                    icon={<LinkIcon />}
                    fullWidth
                  />
                </div>
              </Card.Body>
            </Card>
          </div>
        )}

        {/* Step 3: Products */}
        {currentStep === 3 && (
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Products</h3>
                <Button onClick={addProduct} size="sm">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                {form.products.map((product, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <Select
                      label="Product Name"
                      value={product.productId}
                      onChange={(e) => handleProductChange(index, 'productId', e.target.value)}
                      options={[
                        { value: '', label: 'Select product' },
                        ...mockProducts.map(p => ({
                          value: p.id,
                          label: p.name,
                        })),
                      ]}
                      fullWidth
                    />
                    
                    <Input
                      label="Quantity"
                      type="number"
                      value={product.quantity}
                      onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value) || 0)}
                      placeholder="0"
                      fullWidth
                    />
                    
                    <Input
                      label="Price"
                      type="number"
                      step="0.01"
                      value={product.price}
                      onChange={(e) => handleProductChange(index, 'price', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      fullWidth
                    />
                    
                    <div className="flex items-end">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeProduct(index)}
                        disabled={form.products.length === 1}
                        className="w-full"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Step 4: Payment & Order Details */}
        {currentStep === 4 && (
          <div className="space-y-6">
            {/* Remarks */}
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold">Remarks</h3>
              </Card.Header>
              <Card.Body>
                <textarea
                  value={form.remarks}
                  onChange={(e) => handleInputChange('remarks', e.target.value)}
                  placeholder="Enter any additional remarks or special instructions..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </Card.Body>
            </Card>

            {/* Payment Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Design Payment */}
              <Card>
                <Card.Header>
                  <h4 className="font-semibold text-gray-900">--- Design ---</h4>
                </Card.Header>
                <Card.Body>
                  <div className="space-y-4">
                    <Input
                      label="Deposit Design:"
                      type="number"
                      step="0.01"
                      value={form.designDeposit}
                      onChange={(e) => handleInputChange('designDeposit', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      icon={<CurrencyDollarIcon />}
                      fullWidth
                    />
                    
                    <Input
                      label="Tarikh Payment:"
                      type="date"
                      value={form.designPaymentDate}
                      onChange={(e) => handleInputChange('designPaymentDate', e.target.value)}
                      icon={<CalendarIcon />}
                      fullWidth
                    />
                    
                    <Input
                      label="Due Date Design:"
                      type="date"
                      value={form.designDueDate}
                      onChange={(e) => handleInputChange('designDueDate', e.target.value)}
                      icon={<CalendarIcon />}
                      fullWidth
                    />
                  </div>
                </Card.Body>
              </Card>

              {/* Production Payment */}
              <Card>
                <Card.Header>
                  <h4 className="font-semibold text-gray-900">--- Production ---</h4>
                </Card.Header>
                <Card.Body>
                  <div className="space-y-4">
                    <Input
                      label="Deposit Production:"
                      type="number"
                      step="0.01"
                      value={form.productionDeposit}
                      onChange={(e) => handleInputChange('productionDeposit', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      icon={<CurrencyDollarIcon />}
                      fullWidth
                    />
                    
                    <Input
                      label="Tarikh Payment:"
                      type="date"
                      value={form.productionPaymentDate}
                      onChange={(e) => handleInputChange('productionPaymentDate', e.target.value)}
                      icon={<CalendarIcon />}
                      fullWidth
                    />
                    
                    <Input
                      label="Due Date Production:"
                      type="date"
                      value={form.productionDueDate}
                      onChange={(e) => handleInputChange('productionDueDate', e.target.value)}
                      icon={<CalendarIcon />}
                      fullWidth
                    />
                  </div>
                </Card.Body>
              </Card>

              {/* Balance Payment */}
              <Card>
                <Card.Header>
                  <h4 className="font-semibold text-gray-900">--- Balance Payment ---</h4>
                </Card.Header>
                <Card.Body>
                  <div className="space-y-4">
                    <Input
                      label="Balance Payment:"
                      type="number"
                      step="0.01"
                      value={form.balancePayment}
                      onChange={(e) => handleInputChange('balancePayment', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      icon={<CurrencyDollarIcon />}
                      fullWidth
                    />
                    
                    <Input
                      label="Tarikh Payment:"
                      type="date"
                      value={form.balancePaymentDate}
                      onChange={(e) => handleInputChange('balancePaymentDate', e.target.value)}
                      icon={<CalendarIcon />}
                      fullWidth
                    />
                    
                    <Select
                      label="Payment Method?"
                      value={form.paymentMethod}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      options={[
                        { value: '', label: 'Please select one' },
                        ...paymentMethods,
                      ]}
                      fullWidth
                    />
                  </div>
                </Card.Body>
              </Card>
            </div>

            {/* Order Summary */}
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold">Order Summary</h3>
              </Card.Header>
              <Card.Body>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal ({form.products.length} Items)</span>
                    <span>RM{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deposit Design</span>
                    <span>RM{form.designDeposit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deposit Production</span>
                    <span>RM{form.productionDeposit.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-semibold">
                      <span>Total paid by customer</span>
                      <span>RM{totalPaid.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Balance to paid</span>
                      <span>RM{balance.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        )}
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex justify-between"
      >
        <Button
          variant="secondary"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        
        <div className="flex space-x-3">
          {currentStep < steps.length ? (
            <Button onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              loading={isSubmitting}
            >
              {isEditing ? 'Update Order' : 'Create Order'}
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CreateOrderPage;