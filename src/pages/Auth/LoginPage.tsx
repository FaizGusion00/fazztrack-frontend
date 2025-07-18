import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import WaterWaveBackground from '../../components/UI/WaterWaveBackground';

const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(formData.email, formData.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const demoAccounts = [
    { email: 'superadmin@fazztrack.com', role: 'Super Admin' },
    { email: 'admin@fazztrack.com', role: 'Admin' },
    { email: 'sales@fazztrack.com', role: 'Sales Manager' },
    { email: 'designer@fazztrack.com', role: 'Designer' },
    { email: 'print@fazztrack.com', role: 'Print Staff' },
    { email: 'press@fazztrack.com', role: 'Press Staff' },
    { email: 'cut@fazztrack.com', role: 'Cut Staff' },
    { email: 'sew@fazztrack.com', role: 'Sew Staff' },
    { email: 'qc@fazztrack.com', role: 'QC Staff' },
    { email: 'iron@fazztrack.com', role: 'Iron/Packing Staff' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <WaterWaveBackground />
      <div className="max-w-6xl w-full space-y-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center lg:justify-start items-center space-x-4 mb-8"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">F</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Fazztrack</h1>
                <p className="text-lg text-primary-600 font-medium">T-Shirt Printing System</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-4"
            >
              <h2 className="text-3xl font-bold text-gray-900">
                Welcome to the Future of
                <span className="text-primary-600"> T-Shirt Production</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-md mx-auto lg:mx-0">
                Streamline your workflow from client management to production tracking with our comprehensive system.
              </p>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0"
            >
              {[
                { icon: '📋', text: 'Order Management' },
                { icon: '🎨', text: 'Design Workflow' },
                { icon: '📊', text: 'Real-time Tracking' },
                { icon: '⚡', text: 'QR Code System' },
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  className="flex items-center space-x-2 text-sm text-gray-600"
                >
                  <span className="text-lg">{feature.icon}</span>
                  <span>{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-md w-full mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900">Sign In</h3>
                <p className="text-gray-600 mt-2">Access your dashboard</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  icon={<UserIcon />}
                  required
                />

                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    icon={<LockClosedIcon />}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <Button
                  type="submit"
                  fullWidth
                  loading={isSubmitting}
                  size="lg"
                >
                  Sign In
                </Button>
              </form>

              {/* Demo Accounts */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center mb-4">
                  Demo Accounts (Password: password123)
                </p>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                  {demoAccounts.map((account) => (
                    <button
                      key={account.email}
                      type="button"
                      onClick={() => setFormData({ email: account.email, password: 'password123' })}
                      className="text-left p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-100"
                    >
                      <div className="text-xs font-medium text-gray-900">{account.role}</div>
                      <div className="text-xs text-gray-500">{account.email}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;