import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

// --- LAYOUT ---
import AdminLayout from './components/Layout';
import ParentLayout from './parent/ParentLayout';

// --- LOGIN ---
import Login from './pages/Login';

// --- DASHBOARDS ---
import AdminDashboard from './pages/AdminDashboard';
import DriverDashboard from './pages/DriverDashboard';
import ParentDashboard from './pages/ParentDashboard';

// --- ADMIN SUB PAGES ---
import StudentsPage from './pages/StudentsPage';
import RoutesPage from './pages/RoutesPage';
import DriversPage from './pages/DriversPage';
import ParentsPage from './pages/ParentsPage';
import BusesPage from './pages/BusesPage';
import SchedulesPage from './pages/SchedulesPage';
import ProfilePage from './pages/ProfilePage';

// --- PROTECTED ROUTE ---
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'QUAN_LY') return <Navigate to="/admin" replace />;
    if (user.role === 'TAI_XE') return <Navigate to="/driver" replace />;
    if (user.role === 'PHU_HUYNH') return <Navigate to="/parent" replace />;
  }

  return children;
};

function App() {
  const { user } = useAuth();

  const getDashboardRoute = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'QUAN_LY': return '/admin';
      case 'TAI_XE': return '/driver';
      case 'PHU_HUYNH': return '/parent';
      default: return '/login';
    }
  };

  return (
    <Routes>

      {/* LOGIN */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to={getDashboardRoute()} replace />} />

      {/* ========================================================= */}
      {/* 1. ADMIN AREA – dùng AdminLayout (Sidebar đen)            */}
      {/* ========================================================= */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={
          <ProtectedRoute allowedRoles={['QUAN_LY']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="students" element={<ProtectedRoute allowedRoles={['QUAN_LY']}><StudentsPage /></ProtectedRoute>} />
        <Route path="routes" element={<ProtectedRoute allowedRoles={['QUAN_LY']}><RoutesPage /></ProtectedRoute>} />
        <Route path="drivers" element={<ProtectedRoute allowedRoles={['QUAN_LY']}><DriversPage /></ProtectedRoute>} />
        <Route path="parents" element={<ProtectedRoute allowedRoles={['QUAN_LY']}><ParentsPage /></ProtectedRoute>} />
        <Route path="buses" element={<ProtectedRoute allowedRoles={['QUAN_LY']}><BusesPage /></ProtectedRoute>} />
        <Route path="schedules" element={<ProtectedRoute allowedRoles={['QUAN_LY']}><SchedulesPage /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute allowedRoles={['QUAN_LY']}><ProfilePage /></ProtectedRoute>} />
      </Route>

      {/* ========================================================= */}
      {/* 2. DRIVER – độc lập, không dùng AdminLayout               */}
      {/* ========================================================= */}
      <Route path="/driver">
        <Route index element={
          <ProtectedRoute allowedRoles={['TAI_XE']}>
            <DriverDashboard />
          </ProtectedRoute>
        } />
      </Route>

      {/* ========================================================= */}
      {/* 3. PARENT – dùng ParentLayout riêng                       */}
      {/* ========================================================= */}
      <Route path="/parent" element={<ParentLayout />}>
        <Route index element={
          <ProtectedRoute allowedRoles={['PHU_HUYNH']}>
            <ParentDashboard />
          </ProtectedRoute>
        } />
      </Route>

      {/* DEFAULT REDIRECT */}
      <Route path="/" element={<Navigate to={getDashboardRoute()} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default App;
