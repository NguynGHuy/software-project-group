import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import DriverDashboard from './pages/DriverDashboard'
import ParentDashboard from './pages/ParentDashboard'
import StudentsPage from './pages/StudentsPage'
import RoutesPage from './pages/RoutesPage'
import Layout from './components/Layout'
import ParentLayout from './parent/ParentLayout'
import DriverLayout from './components/DriverLayout'

function App() {
  const { user } = useAuth()

  const getDashboardRoute = () => {
    if (!user) return '/login'
    switch (user.role) {
      case 'QUAN_LY':
        return '/admin'
      case 'TAI_XE':
        return '/driver'
      case 'PHU_HUYNH':
        return '/parent'
      default:
        return '/login'
    }
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={!user ? <Login /> : <Navigate to={getDashboardRoute()} replace />} 
      />
      
      <Route path="/" element={user ? <Layout /> : <Navigate to="/login" replace />}>
        <Route path="admin" element={
          user?.role === 'QUAN_LY' ? <AdminDashboard /> : <Navigate to={getDashboardRoute()} replace />
        } />
        <Route path="admin/students" element={
          user?.role === 'QUAN_LY' ? <StudentsPage /> : <Navigate to={getDashboardRoute()} replace />
        } />
        <Route path="admin/routes" element={
          user?.role === 'QUAN_LY' ? <RoutesPage /> : <Navigate to={getDashboardRoute()} replace />
        } />
        
        <Route index element={<Navigate to={getDashboardRoute()} replace />} />
      </Route>

      <Route path="/parent" element={user?.role === 'PHU_HUYNH' ? <ParentLayout /> : <Navigate to={getDashboardRoute()} replace />}>
        <Route index element={<ParentDashboard />} />
      </Route>

      <Route path="/driver" element={user?.role === 'TAI_XE' ? <DriverLayout /> : <Navigate to={getDashboardRoute()} replace />}>
        <Route index element={<DriverDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
