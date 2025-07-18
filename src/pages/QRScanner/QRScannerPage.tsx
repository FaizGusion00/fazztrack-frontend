import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  QrCodeIcon,
  CameraIcon,
  PlayIcon,
  StopIcon,
  ClockIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  EyeIcon,
  PencilIcon,
  UserIcon,
  CalendarIcon,
  TagIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Modal from '../../components/UI/Modal';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { Job, QRScanResult, Order, JobType, JobStatus, PaymentMethod, OrderStatus } from '../../types';
import { mockOrders } from '../Orders/OrdersPage'; // Import after export

interface JobPhase {
  id: string;
  name: string;
  order: number;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  assignedTo?: string;
  startTime?: Date;
  endTime?: Date;
  duration?: number; // in minutes
  notes?: string;
}

interface JobWithPhases extends Job {
  phases: JobPhase[];
  currentPhase?: string;
  qrCode: string;
  dueDate?: string;
}

const QRScannerPage: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<QRScanResult | null>(null);
  const [currentJob, setCurrentJob] = useState<JobWithPhases | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [manualJobId, setManualJobId] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  // Add state for tab selection
  const [activeTab, setActiveTab] = useState<'scan' | 'manual'>('scan');

  // Mock job data with phases
  const fallbackOrder: Order = {
    id: '',
    jobName: 'Unknown Job',
    clientId: '',
    client: {
      id: '',
      name: 'Unknown Client',
      email: '',
      phone: '',
      address: '',
      totalOrders: 0,
      totalSpent: 0,
      isActive: false,
      createdAt: '',
      updatedAt: '',
    },
    products: [],
    status: 'pending' as OrderStatus,
    deliveryMethod: 'shipping',
    designDeposit: 0,
    designPaymentDate: '',
    designDueDate: '',
    productionDeposit: 0,
    productionPaymentDate: '',
    productionDueDate: '',
    balancePayment: 0,
    balancePaymentDate: '',
    paymentMethod: 'deposit_design',
    subtotal: 0,
    totalPaid: 0,
    balanceToPay: 0,
    designDepositApproved: false,
    productionDepositApproved: false,
    balancePaymentApproved: false,
    receipts: [],
    jobSheets: [],
    downloadLink: '',
    remarks: '',
    createdAt: '',
    updatedAt: '',
    createdBy: '',
  };
  const jobsWithOrder: JobWithPhases[] = [
    {
      id: 'JOB-001',
      orderId: 'ORD-001',
      order: mockOrders.find(o => o.id === 'ORD-001') || fallbackOrder,
      type: 'print',
      status: 'in_progress',
      priority: 'high',
      assignedTo: 'Mike Johnson',
      dueDate: '2024-12-25',
      isFinalized: false,
      createdAt: '2024-12-15T00:00:00Z',
      updatedAt: '2024-12-18T00:00:00Z',
      qrCode: 'QR-JOB-001',
      phases: [
        {
          id: 'phase-001',
          name: 'PRINT',
          order: 1,
          status: 'completed',
          assignedTo: 'John Printer',
          startTime: new Date('2024-12-18T08:00:00'),
          endTime: new Date('2024-12-18T10:30:00'),
          duration: 150,
          notes: 'Printed 50 units successfully'
        },
        {
          id: 'phase-002',
          name: 'PRESS',
          order: 2,
          status: 'completed',
          assignedTo: 'Sarah Press',
          startTime: new Date('2024-12-18T11:00:00'),
          endTime: new Date('2024-12-18T13:00:00'),
          duration: 120,
          notes: 'Heat press applied to all units'
        },
        {
          id: 'phase-003',
          name: 'CUT',
          order: 3,
          status: 'in_progress',
          assignedTo: 'Mike Johnson',
          startTime: new Date('2024-12-18T14:00:00'),
          notes: 'Currently cutting excess material'
        },
        {
          id: 'phase-004',
          name: 'SEW',
          order: 4,
          status: 'pending',
        },
        {
          id: 'phase-005',
          name: 'QUALITY CHECK (QC)',
          order: 5,
          status: 'pending',
        },
        {
          id: 'phase-006',
          name: 'IRON/PACKING',
          order: 6,
          status: 'pending',
        },
      ],
      currentPhase: 'phase-003'
    },
    {
      id: 'JOB-002',
      orderId: 'ORD-002',
      order: mockOrders.find(o => o.id === 'ORD-002') || fallbackOrder,
      type: 'design',
      status: 'pending',
      priority: 'medium',
      assignedTo: 'Production Team',
      dueDate: '2024-12-30',
      isFinalized: false,
      createdAt: '2024-12-16T00:00:00Z',
      updatedAt: '2024-12-16T00:00:00Z',
      qrCode: 'QR-JOB-002',
      phases: [
        {
          id: 'phase-007',
          name: 'PRINT',
          order: 1,
          status: 'pending',
        },
        {
          id: 'phase-008',
          name: 'PRESS',
          order: 2,
          status: 'pending',
        },
        {
          id: 'phase-009',
          name: 'CUT',
          order: 3,
          status: 'pending',
        },
        {
          id: 'phase-010',
          name: 'SEW',
          order: 4,
          status: 'pending',
        },
        {
          id: 'phase-011',
          name: 'QUALITY CHECK (QC)',
          order: 5,
          status: 'pending',
        },
        {
          id: 'phase-012',
          name: 'IRON/PACKING',
          order: 6,
          status: 'pending',
        },
      ],
      currentPhase: 'phase-007'
    }
  ];

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const simulateQRScan = (qrCode: string) => {
    // Simulate QR code scanning
    const job = jobsWithOrder.find(j => j.qrCode === qrCode);
    if (job) {
      setScanResult({
        jobId: job.id,
        jobType: job.type,
        orderId: job.orderId,
        clientName: job.order?.client?.name || 'Unknown Client',
        jobName: job.order?.jobName || 'Unknown Job'
      });
      setCurrentJob(job);
      setShowJobModal(true);
      stopCamera();
    } else {
      setError('Invalid QR code or job not found');
    }
  };

  const handleManualJobEntry = () => {
    if (manualJobId.trim()) {
      simulateQRScan(manualJobId.trim());
      setManualJobId('');
    }
  };

  const calculateProgress = (job: JobWithPhases): number => {
    const completedPhases = job.phases.filter(p => p.status === 'completed').length;
    const totalPhases = job.phases.length;
    return totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0;
  };

  const getCurrentPhase = (job: JobWithPhases): JobPhase | null => {
    if (job.currentPhase) {
      return job.phases.find(p => p.id === job.currentPhase) || null;
    }
    return job.phases.find(p => p.status === 'pending') || null;
  };

  const canUserWorkOnPhase = (phase: JobPhase): boolean => {
    if (!user) return false;
    
    // Super Admin and Sales Manager can work on any phase
    if (user.department === 'admin' || user.department === 'sales_manager') {
      return true;
    }
    
    // Production staff can only work on their assigned phases or phases matching their role
    if (user.department === 'production_staff') {
      const userRole = user.role?.toLowerCase();
      const phaseName = phase.name.toLowerCase();
      
      // Check if user is assigned to this phase
      if (phase.assignedTo === user.name) {
        return true;
      }
      
      // Check if phase matches user's role
      if (userRole?.includes('print') && phaseName.includes('print')) return true;
      if (userRole?.includes('press') && phaseName.includes('press')) return true;
      if (userRole?.includes('cut') && phaseName.includes('cut')) return true;
      if (userRole?.includes('sew') && phaseName.includes('sew')) return true;
      if (userRole?.includes('qc') && phaseName.includes('quality')) return true;
      if (userRole?.includes('iron') && phaseName.includes('iron')) return true;
      if (userRole?.includes('pack') && phaseName.includes('pack')) return true;
    }
    
    return false;
  };

  const handleStartPhase = async (phaseId: string) => {
    if (!currentJob) return;
    
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedJob = {
        ...currentJob,
        phases: currentJob.phases.map(phase => 
          phase.id === phaseId
            ? {
                ...phase,
                status: 'in_progress' as const,
                startTime: new Date(),
                assignedTo: user?.name || phase.assignedTo
              }
            : phase
        ),
        currentPhase: phaseId
      };
      
      setCurrentJob(updatedJob);
    } catch (error) {
      setError('Failed to start phase');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEndPhase = async (phaseId: string) => {
    if (!currentJob) return;
    
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const phase = currentJob.phases.find(p => p.id === phaseId);
      const startTime = phase?.startTime;
      const endTime = new Date();
      const duration = startTime ? Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60)) : 0;
      
      const updatedJob = {
        ...currentJob,
        phases: currentJob.phases.map(phase => 
          phase.id === phaseId
            ? {
                ...phase,
                status: 'completed' as const,
                endTime,
                duration
              }
            : phase
        )
      };
      
      // Find next pending phase
      const nextPhase = updatedJob.phases.find(p => p.status === 'pending');
      if (nextPhase) {
        updatedJob.currentPhase = nextPhase.id;
      } else {
        // All phases completed
        updatedJob.currentPhase = undefined;
        updatedJob.status = 'completed';
      }
      
      setCurrentJob(updatedJob);
    } catch (error) {
      setError('Failed to end phase');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPhaseStatusColor = (status: JobPhase['status']) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      case 'pending': return 'secondary';
      case 'skipped': return 'danger';
      default: return 'secondary';
    }
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const canEditJob = hasPermission('edit_jobs');
  const canExecuteJob = hasPermission('execute_jobs');

  return (
    <div className="min-h-screen font-sans bg-white flex flex-col items-center px-2 sm:px-4 py-6">
      <div className="w-full max-w-md sm:max-w-2xl flex flex-col gap-10">
        {/* Header - minimalist, tech, animated */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-center"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">QR Scanner</h1>
          <p className="text-base sm:text-lg text-gray-500">Scan job QR codes to track and manage production progress</p>
        </motion.div>
        {/* Scanner Section - minimalist card, animated */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-8 flex flex-col gap-8">
            {/* <Card.Header className="mb-2 sm:mb-6 text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center justify-center">
                <QrCodeIcon className="h-7 w-7 mr-2 text-blue-500" /> QR Code Scanner
              </h2>
            </Card.Header> */}
            <Card.Body className="p-0 flex flex-col gap-8">
              {/* Tabs above camera section */}
              <div className="flex justify-center mb-4 gap-2">
                <button
                  className={`px-4 py-2 rounded-t-lg font-semibold text-base transition-all duration-150 ${activeTab === 'scan' ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => setActiveTab('scan')}
                >
                  Scan QR
                </button>
                <button
                  className={`px-4 py-2 rounded-t-lg font-semibold text-base transition-all duration-150 ${activeTab === 'manual' ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => setActiveTab('manual')}
                >
                  Manual Entry
                </button>
              </div>
              {/* Camera and Manual Entry Sections */}
              {activeTab === 'scan' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex flex-col items-center gap-4"
                >
                  {/* Camera Display Section */}
                  <div className="relative flex items-center justify-center w-full max-w-xs sm:max-w-sm mx-auto" style={{ height: '340px' }}>
                    {/* Animated green border when not scanning */}
                    {!isScanning && (
                      <div className="absolute -inset-2 rounded-2xl pointer-events-none animate-glow-green z-20" style={{ boxShadow: '0 0 0 4px #22d3ee, 0 0 16px 4px #22d3ee, 0 0 32px 8px #10b981' }}></div>
                    )}
                    <div className="relative bg-white rounded-2xl shadow-lg border border-gray-200 flex items-center justify-center w-full h-full">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover rounded-2xl"
                        style={{ background: '#000' }}
                      />
                      <canvas ref={canvasRef} className="hidden" />
                      {/* Overlay border and corners */}
                      <div className="absolute inset-0 border-2 border-primary-500 rounded-lg pointer-events-none">
                        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-primary-500"></div>
                        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-primary-500"></div>
                        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-primary-500"></div>
                        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-primary-500"></div>
                      </div>
                      {/* Overlay message when camera is not active */}
                      {!isScanning && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 rounded-2xl z-10">
                          <CameraIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">Camera not active</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Add more space before the button */}
                  <div className="mt-6 w-full flex flex-col sm:flex-row justify-center gap-3">
                    {/* Start/Stop Camera Button as before */}
                    {!isScanning ? (
                      <Button
                        onClick={startCamera}
                        className="w-full sm:w-auto flex flex-col items-center justify-center px-6 py-4 rounded-xl shadow bg-teal-500 text-white font-semibold hover:bg-teal-600 focus:ring-2 focus:ring-teal-400 transition-all duration-150 gap-2 text-base"
                      >
                        <span className="flex items-center justify-center w-full">
                          <CameraIcon className="h-8 w-8" />
                        </span>
                        <span className="mt-1">Start Camera</span>
                      </Button>
                    ) : (
                      <Button
                        variant="danger"
                        onClick={stopCamera}
                        className="w-full sm:w-auto px-8 py-4 text-lg rounded-xl shadow bg-red-500 text-white font-semibold hover:bg-red-600 focus:ring-2 focus:ring-red-400 transition-all duration-150 flex items-center gap-2 justify-center"
                      >
                        <StopIcon className="h-5 w-5" />
                        Stop Camera
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
              {activeTab === 'manual' && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="pt-6 flex flex-col gap-4"
                >
                  {/* Manual Job Entry Form as before */}
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 text-center">Manual Job Entry</h3>
                  <div className="flex flex-col sm:flex-row gap-3 items-center w-full">
                    <input
                      type="text"
                      value={manualJobId}
                      onChange={(e) => setManualJobId(e.target.value)}
                      placeholder="Enter Job ID"
                      className="flex-1 w-full text-lg px-6 py-4 rounded-xl shadow-sm border border-gray-200 bg-white focus:ring-2 focus:ring-blue-400 transition-all duration-150"
                      onKeyPress={(e) => e.key === 'Enter' && handleManualJobEntry()}
                    />
                    <Button
                      onClick={handleManualJobEntry}
                      className="w-full sm:w-auto flex flex-col items-center justify-center px-6 py-4 rounded-xl shadow bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition-all duration-150 gap-1 text-base"
                    >
                      <QrCodeIcon className="h-7 w-7 mb-1" />
                      <span>Scan</span>
                    </Button>
                  </div>
                </motion.div>
              )}
              {/* Demo Jobs Section - minimalist, tech, animated */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full"
              >
                <div className="bg-blue-50/60 rounded-2xl shadow-inner px-2 py-4 flex flex-col items-center">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 text-center">Demo Jobs</h3>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
                    {jobsWithOrder.map(job => (
                      <Button
                        key={job.id}
                        variant="ghost"
                        onClick={() => simulateQRScan(job.qrCode)}
                        className="max-w-[220px] w-full flex flex-col items-center justify-center bg-white rounded-xl border border-blue-200 shadow-sm hover:scale-105 hover:shadow-lg hover:border-blue-400 focus:ring-2 focus:ring-blue-400 transition-all duration-150 px-4 py-4 text-base min-h-[80px] mx-auto"
                      >
                        <span className="font-bold text-gray-900 text-center text-base leading-tight w-full break-words">{job.order?.jobName || 'Unknown Job'}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </motion.div>
              {/* Error Display - minimalist */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-full bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-center mt-2"
                >
                  {error}
                </motion.div>
              )}
            </Card.Body>
          </Card>
        </motion.div>
        {/* Job Details Modal - glassy, modern, more whitespace */}
        <Modal isOpen={showJobModal} onClose={() => setShowJobModal(false)} size="xl">
          {currentJob && (
            <>
              <Modal.Header>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    <QrCodeIcon className="h-6 w-6 text-primary-500" />
                    <div>
                      <h3 className="text-lg font-semibold">
                        {currentJob.order?.jobName || 'Unknown Job'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {currentJob.id} • {currentJob.order?.client?.name || 'Unknown Client'}
                      </p>
                    </div>
                  </div>
                  <Badge variant={currentJob.status === 'completed' ? 'success' : currentJob.status === 'in_progress' ? 'warning' : 'secondary'}>
                    {currentJob.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </Modal.Header>
              
              <Modal.Body>
                <div className="space-y-6">
                  {/* Job Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Assigned To</p>
                        <p className="font-medium">{currentJob.assignedTo}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Due Date</p>
                        <p className="font-medium">{currentJob.dueDate ? new Date(currentJob.dueDate).toLocaleDateString() : 'Not set'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Progress</p>
                        <p className="font-medium">{calculateProgress(currentJob)}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Overall Progress</span>
                      <span>{calculateProgress(currentJob)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${calculateProgress(currentJob)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Production Phases */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Production Phases</h4>
                    <div className="space-y-3">
                      {currentJob.phases.map((phase, index) => {
                        const isCurrentPhase = currentJob.currentPhase === phase.id;
                        const canWork = canUserWorkOnPhase(phase);
                        const isInProgress = phase.status === 'in_progress';
                        const isCompleted = phase.status === 'completed';
                        
                        return (
                          <motion.div
                            key={phase.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`border rounded-lg p-4 ${
                              isCurrentPhase ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium text-gray-600">
                                    {phase.order}.
                                  </span>
                                  <h5 className="font-medium text-gray-900">
                                    {phase.name}
                                  </h5>
                                </div>
                                <Badge variant={getPhaseStatusColor(phase.status)} size="sm">
                                  {phase.status.replace('_', ' ').toUpperCase()}
                                </Badge>
                              </div>
                              
                              {canExecuteJob && canWork && (
                                <div className="flex space-x-2">
                                  {phase.status === 'pending' && (
                                    <Button
                                      size="sm"
                                      onClick={() => handleStartPhase(phase.id)}
                                      loading={isProcessing}
                                    >
                                      <PlayIcon className="h-4 w-4 mr-1" />
                                      Start
                                    </Button>
                                  )}
                                  {isInProgress && (
                                    <Button
                                      size="sm"
                                      variant="success"
                                      onClick={() => handleEndPhase(phase.id)}
                                      loading={isProcessing}
                                    >
                                      <CheckIcon className="h-4 w-4 mr-1" />
                                      Complete
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            {/* Phase Details */}
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              {phase.assignedTo && (
                                <div>
                                  <span className="text-gray-600">Assigned:</span>
                                  <span className="ml-1 font-medium">{phase.assignedTo}</span>
                                </div>
                              )}
                              {phase.startTime && (
                                <div>
                                  <span className="text-gray-600">Started:</span>
                                  <span className="ml-1 font-medium">
                                    {phase.startTime.toLocaleTimeString()}
                                  </span>
                                </div>
                              )}
                              {phase.duration && (
                                <div>
                                  <span className="text-gray-600">Duration:</span>
                                  <span className="ml-1 font-medium">
                                    {formatDuration(phase.duration)}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {phase.notes && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-600">
                                  <DocumentTextIcon className="h-4 w-4 inline mr-1" />
                                  {phase.notes}
                                </p>
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Modal.Body>
              
              <Modal.Footer>
                <div className="flex space-x-3">
                  <Button
                    variant="ghost"
                    onClick={() => setShowJobModal(false)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setShowJobModal(false);
                      setIsScanning(false);
                      setScanResult(null);
                      setCurrentJob(null);
                    }}
                  >
                    Scan Another
                  </Button>
                  {canEditJob && (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setShowJobModal(false);
                        setShowEditModal(true);
                      }}
                    >
                      <PencilIcon className="h-4 w-4 mr-2" />
                      Edit Job
                    </Button>
                  )}
                </div>
              </Modal.Footer>
            </>
          )}
        </Modal>

        {/* 1. Edit Job Modal - modern, glassy, minimalist, responsive */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          size="lg"
        >
          <Modal.Header>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Edit Job Details</h3>
          </Modal.Header>
          <Modal.Body>
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 space-y-8">
              <form /* onSubmit={handleEditJobSubmit} */>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Job Title</label>
                    <input type="text" name="title" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/90 focus:ring-2 focus:ring-blue-400 text-gray-900" placeholder="Enter job title" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Type</label>
                    <select name="type" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/90 focus:ring-2 focus:ring-blue-400 text-gray-900">
                      <option value="design">Design</option>
                      <option value="print">Print</option>
                      <option value="press">Press</option>
                      <option value="cut">Cut</option>
                      <option value="sew">Sew</option>
                      <option value="qc">Quality Check</option>
                      <option value="iron">Iron/Packing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Priority</label>
                    <select name="priority" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/90 focus:ring-2 focus:ring-blue-400 text-gray-900">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Assigned To</label>
                    <input type="text" name="assignedTo" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/90 focus:ring-2 focus:ring-blue-400 text-gray-900" placeholder="Enter assignee name" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Due Date</label>
                    <input type="date" name="dueDate" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/90 focus:ring-2 focus:ring-blue-400 text-gray-900" />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Description</label>
                  <textarea name="description" rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/90 focus:ring-2 focus:ring-blue-400 text-gray-900 resize-none" placeholder="Enter job description..."></textarea>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Notes</label>
                  <textarea name="notes" rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/90 focus:ring-2 focus:ring-blue-400 text-gray-900 resize-none" placeholder="Enter additional notes..."></textarea>
                </div>
                {/* Extra fields for QC phase */}
                {currentJob?.phases.find(p => p.name.toLowerCase().includes('quality')) && (
                  <div className="mb-6 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">QC Result</label>
                      <select name="qcResult" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/90 focus:ring-2 focus:ring-blue-400 text-gray-900">
                        <option value="">Select result</option>
                        <option value="pass">Pass</option>
                        <option value="fail">Fail</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">QC Notes</label>
                      <textarea name="qcNotes" rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/90 focus:ring-2 focus:ring-blue-400 text-gray-900 resize-none" placeholder="Enter QC notes..."></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">QC Photo (optional)</label>
                      <input type="file" accept="image/*" className="w-full" />
                    </div>
                  </div>
                )}
                {/* Extra fields for Packaging phase */}
                {currentJob?.phases.find(p => p.name.toLowerCase().includes('pack')) && (
                  <div className="mb-6 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">Packaging Details</label>
                      <input type="text" name="packagingDetails" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/90 focus:ring-2 focus:ring-blue-400 text-gray-900" placeholder="e.g. Box, Polybag, etc." />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">Packaging Notes</label>
                      <textarea name="packagingNotes" rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/90 focus:ring-2 focus:ring-blue-400 text-gray-900 resize-none" placeholder="Enter packaging notes..."></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">Packaging Photo (optional)</label>
                      <input type="file" accept="image/*" className="w-full" />
                    </div>
                  </div>
                )}
                <div className="flex space-x-4 justify-end pt-4">
                  <Button variant="ghost" onClick={() => setShowEditModal(false)} className="px-6 py-3 rounded-xl font-medium">Cancel</Button>
                  <Button type="submit" className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:scale-105 transition-transform">Save Changes</Button>
                </div>
              </form>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default QRScannerPage;