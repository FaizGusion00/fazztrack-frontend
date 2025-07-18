// User and Authentication Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department: Department;
  role: Role;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type Department = 
  | 'superadmin'
  | 'admin'
  | 'sales_manager'
  | 'designer'
  | 'production_staff';

export type Role = 
  | 'superadmin'
  | 'admin'
  | 'sales_manager'
  | 'designer'
  | 'print'
  | 'press'
  | 'cut'
  | 'sew'
  | 'qc'
  | 'iron_packing';

// Client Types
export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  billingAddress?: string;
  shippingAddress?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Added fields for compatibility with code usage
  address?: string; // Unified address field for display
  status?: string; // e.g. 'active', 'inactive'
  totalOrders?: number;
  totalSpent?: number;
  company?: string;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Added for compatibility with code usage
  price?: number;
  stock?: number;
  supplier?: string;
  tags?: string[];
}

export interface OrderProduct {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  // Added for compatibility with code usage
  price?: number;
}

// Order Types
export interface Order {
  id: string;
  jobName: string;
  clientId: string;
  client: Client;
  deliveryMethod: 'self_collect' | 'shipping';
  shippingAddress?: string;
  products: OrderProduct[];
  receipts: FileAttachment[];
  jobSheets: FileAttachment[];
  downloadLink?: string;
  remarks?: string;
  
  // Payment Information
  designDeposit: number;
  designPaymentDate?: string;
  designDueDate?: string;
  
  productionDeposit: number;
  productionPaymentDate?: string;
  productionDueDate?: string;
  
  balancePayment: number;
  balancePaymentDate?: string;
  
  paymentMethod: PaymentMethod;
  
  // Calculated Fields
  subtotal: number;
  totalPaid: number;
  balanceToPay: number;
  
  // Status and Tracking
  status: OrderStatus;
  trackingId?: string;
  deliveryTrackingId?: string;
  estimatedDelivery?: string;
  
  // Approval Status
  designDepositApproved: boolean;
  productionDepositApproved: boolean;
  balancePaymentApproved: boolean;
  
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export type PaymentMethod = 
  | 'skip_vip_agent'
  | 'skip_vip_end_user'
  | 'deposit_design'
  | 'deposit_production';

export type OrderStatus = 
  | 'pending'
  | 'payment_pending'
  | 'approved'
  | 'in_design'
  | 'design_completed'
  | 'in_production'
  | 'in_qc'
  | 'ready_for_delivery'
  | 'in_delivery'
  | 'completed'
  | 'cancelled';

// Job Types
export interface Job {
  id: string;
  orderId: string;
  order: Order;
  type: JobType;
  assignedTo?: string;
  assignedUser?: User;
  status: JobStatus;
  qrCode?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  notes?: string;
  designFiles?: FileAttachment[];
  isFinalized: boolean;
  createdAt: string;
  updatedAt: string;
  // Added for compatibility with code usage
  priority?: string;
  dueDate?: string;
  description?: string;
  title?: string;
}

export type JobType = 
  | 'design'
  | 'print'
  | 'press'
  | 'cut'
  | 'sew'
  | 'qc'
  | 'iron_packing';

export type JobStatus = 
  | 'pending'
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'on_hold'
  | 'cancelled';

// File Attachment Types
export interface FileAttachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

// Dashboard Types
export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  pendingPayments: number;
  overdueJobs: number;
  activeJobs: number;
  completedJobs: number;
  // Added for compatibility with code usage
  totalClients?: number;
  newClients?: number;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface OrderTrend {
  date: string;
  orders: number;
  revenue: number;
}

// Permission Types
export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

export interface RolePermission {
  roleId: string;
  permissionId: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  userId: string;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface ClientForm {
  name: string;
  phone: string;
  email?: string;
  billingAddress?: string;
  shippingAddress?: string;
}

export interface OrderForm {
  jobName: string;
  clientId?: string;
  newClient?: ClientForm;
  deliveryMethod: 'self_collect' | 'shipping';
  shippingAddress?: string;
  products: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
  receipts: File[];
  jobSheets: File[];
  downloadLink?: string;
  remarks?: string;
  designDeposit: number;
  designPaymentDate?: string;
  designDueDate?: string;
  productionDeposit: number;
  productionPaymentDate?: string;
  productionDueDate?: string;
  balancePayment: number;
  balancePaymentDate?: string;
  paymentMethod: PaymentMethod;
}

// QR Scanner Types
export interface QRScanResult {
  jobId: string;
  jobType: JobType;
  orderId: string;
  clientName: string;
  jobName: string;
}

// Due Date Alert Types
export interface DueDateAlert {
  id: string;
  orderId: string;
  jobName: string;
  clientName: string;
  type: 'design' | 'production';
  dueDate: string;
  daysRemaining: number;
  isOverdue: boolean;
}

// Tracking Types
export interface TrackingInfo {
  orderId: string;
  trackingId?: string;
  jobName?: string;
  clientName?: string;
  status: OrderStatus;
  currentStep: string;
  estimatedDelivery: Date;
  deliveryTrackingId?: string;
  deliveryAddress?: string;
  timeline?: TrackingEvent[];
}

export interface TrackingEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'current' | 'pending';
  icon?: string;
}

// Payment Type (added for compatibility)
export interface Payment {
  id: string;
  orderId: string;
  type: 'design' | 'production' | 'balance';
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  paymentDate: string;
  dueDate: string;
  paymentMethod: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedReason?: string;
  createdAt: string;
  updatedAt: string;
}