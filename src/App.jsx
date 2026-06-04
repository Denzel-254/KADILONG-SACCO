import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AdminLayout from './components/layout/AdminLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import MyLoans from './pages/MyLoans';
import ApplyLoan from './pages/ApplyLoan';
import Savings from './pages/Savings';
import OpenSavingsAccount from './pages/OpenSavingsAccount';
import MemberManagement from './pages/admin/MemberManagement';
import LoanApprovals from './pages/admin/LoanApprovals';
import Defaulters from './pages/admin/Defaulters';
import LoanProducts from './pages/admin/LoanProducts';
import ActiveLoans from './pages/admin/ActiveLoans';
import MakePayment from './pages/MakePayment';
import LoanApplications from './pages/admin/LoanApplications';
import SavingsManagement from './pages/admin/SavingsManagement';
import ReportsAnalytics from './pages/admin/ReportsAnalytics';
import PenaltySettings from './pages/admin/PenaltySettings';
import ActiveCases from './pages/admin/ActiveCases';
import PaymentPlans from './pages/admin/PaymentPlans';
import SystemSettings from './pages/admin/SystemSettings';




// Protected Route wrapper for member routes
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, userRole, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Admin Route wrapper with AdminLayout
const AdminRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, userRole, loading, logout, user } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <AdminLayout user={user} onLogout={logout}>
      {children}
    </AdminLayout>
  );
};

function AppContent() {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();

  // Check if current path is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Show regular header on non-admin routes
  const showRegularHeader = !isAdminRoute;
  
  // Show footer only on non-admin routes
  const showFooter = !isAdminRoute;

  return (
    <div className="flex flex-col min-h-screen">
      {showRegularHeader && (
        <Header 
          isAuthenticated={isAuthenticated} 
          user={user} 
          onLogout={logout} 
        />
      )}
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Member Routes - Loans */}
          <Route 
            path="/loans" 
            element={
              <ProtectedRoute allowedRoles={['member', 'admin', 'super_admin']}>
                <MyLoans />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/loans/apply" 
            element={
              <ProtectedRoute allowedRoles={['member', 'admin', 'super_admin']}>
                <ApplyLoan />
              </ProtectedRoute>
            } 
          />
          <Route 
  path="/repayments" 
  element={
    <ProtectedRoute allowedRoles={['member', 'admin', 'super_admin']}>
      <MakePayment />
    </ProtectedRoute>
  } 
/>
          {/* Member Routes - Savings */}
          <Route 
            path="/savings" 
            element={
              <ProtectedRoute allowedRoles={['member', 'admin', 'super_admin']}>
                <Savings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/savings/open" 
            element={
              <ProtectedRoute allowedRoles={['member', 'admin', 'super_admin']}>
                <OpenSavingsAccount />
              </ProtectedRoute>
            } 
          />
          
          {/* Member Routes - Dashboard & Others */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['member', 'admin', 'super_admin']}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          {/* <Route 
            path="/repayments" 
            element={
              <ProtectedRoute allowedRoles={['member', 'admin', 'super_admin']}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <h1 className="text-2xl font-bold">Repayments</h1>
                  <p className="text-gray-600 mt-2">Feature coming soon...</p>
                </div>
              </ProtectedRoute>
            } 
          /> */}
          
          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <AdminRoute allowedRoles={['admin', 'super_admin']}>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          <Route 
  path="/admin/members" 
  element={
    <AdminRoute allowedRoles={['admin', 'super_admin']}>
      <MemberManagement />
    </AdminRoute>
  } 
/>          <Route 
  path="/admin/loan-products" 
  element={
    <AdminRoute allowedRoles={['admin', 'super_admin']}>
      <LoanProducts />
    </AdminRoute>
  } 
/>
          <Route 
  path="/admin/loan-applications" 
  element={
    <AdminRoute allowedRoles={['admin', 'super_admin']}>
      <LoanApplications />
    </AdminRoute>
  } 
/>          <Route 
  path="/admin/loan-approvals" 
  element={
    <AdminRoute allowedRoles={['admin', 'super_admin']}>
      <LoanApprovals />
    </AdminRoute>
  } 
/>
          <Route 
  path="/admin/active-loans" 
  element={
    <AdminRoute allowedRoles={['admin', 'super_admin']}>
      <ActiveLoans />
    </AdminRoute>
  } 
/>

          <Route 
  path="/admin/savings" 
  element={
    <AdminRoute allowedRoles={['admin', 'super_admin']}>
      <SavingsManagement />
    </AdminRoute>
  } 
/>
          <Route 
  path="/admin/collections" 
  element={
    <AdminRoute allowedRoles={['admin', 'super_admin']}>
      <ActiveCases />
    </AdminRoute>
  } 
/>
          <Route 
  path="/admin/payment-plans" 
  element={
    <AdminRoute allowedRoles={['admin', 'super_admin']}>
      <PaymentPlans />
    </AdminRoute>
  } 
/>
          <Route 
  path="/admin/defaulters" 
  element={
    <AdminRoute allowedRoles={['admin', 'super_admin']}>
      <Defaulters />
    </AdminRoute>
  } 
/>
          <Route 
  path="/admin/reports" 
  element={
    <AdminRoute allowedRoles={['admin', 'super_admin']}>
      <ReportsAnalytics />
    </AdminRoute>
  } 
/>
          <Route 
  path="/admin/penalty-settings" 
  element={
    <AdminRoute allowedRoles={['admin', 'super_admin']}>
      <PenaltySettings />
    </AdminRoute>
  } 
/>
          <Route 
  path="/admin/settings" 
  element={
    <AdminRoute allowedRoles={['super_admin', 'admin']}>
      <SystemSettings />
    </AdminRoute>
  } 
/>

        </Routes>
      </main>
      {showFooter && <Footer />}
      <Toaster position="top-right" />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;