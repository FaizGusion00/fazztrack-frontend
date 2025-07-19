/**
 * FazzTrack - T-Shirt Printing Management System
 * 
 * © 2024 FazzPrint Sdn Bhd. All rights reserved.
 * 
 * Developed by: Faiz Nasir
 * Email: faizhiruko00@gmail.com
 * Phone: +60 19-4596236
 * Portfolio: https://faiznasirweb.netlify.app/
 * 
 * This software is proprietary and confidential.
 * Unauthorized copying, distribution, or modification is strictly prohibited.
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/Auth/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import ClientsPage from './pages/Clients/ClientsPage';
import OrdersPage from './pages/Orders/OrdersPage';
import CreateOrderPage from './pages/Orders/CreateOrderPage';
import PaymentsPage from './pages/Payments/PaymentsPage';
import JobsPage from './pages/Jobs/JobsPage';
import DesignPage from './pages/Design/DesignPage';
import DesignerSectionPage from './pages/Design/DesignerSectionPage';
import ProductsPage from './pages/Products/ProductsPage';
import QRScannerPage from './pages/QRScanner/QRScannerPage';
import DueDatesPage from './pages/DueDates/DueDatesPage';
import DepartmentManagementPage from './pages/DepartmentManagement/DepartmentManagementPage';
import TrackingPage from './pages/Tracking/TrackingPage';
import LoadingSpinner from './components/UI/LoadingSpinner';
import DeliveryTrackingPage from './pages/DeliveryTrackingPage';
import './index.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      
      {/* Public Tracking Route */}
      <Route path="/track" element={<TrackingPage />} />
      <Route path="/track/:trackingId" element={<TrackingPage />} />
      
      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/clients" element={<ClientsPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/create" element={<CreateOrderPage />} />
                <Route path="/orders/edit/:id" element={<CreateOrderPage />} />
                <Route path="/payments" element={<PaymentsPage />} />
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/design" element={<DesignPage />} />
                <Route path="/designer-section" element={<DesignerSectionPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/scanner" element={<QRScannerPage />} />
                <Route path="/due-dates" element={<DueDatesPage />} />
                <Route path="/department-management" element={<DepartmentManagementPage />} />
                <Route path="/delivery-tracking" element={<DeliveryTrackingPage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;