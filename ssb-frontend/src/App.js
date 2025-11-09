import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./contexts/AuthContext"

// ADMIN
import AdminLayout from "./layouts/AdminLayout"
import AdminDashboard from "./pages/admin/adminDashboard"
import BusList from "./pages/admin/BusList"
import DriverList from "./pages/admin/DriverList"
import StudentList from "./pages/admin/StudentList"
import ScheduleList from "./pages/admin/Schedule"
import ReportPage from "./pages/admin/ReportPage"
import ProfilePage from "./pages/admin/ProfilePage"

// DRIVER
import DriverLayout from "./layouts/DriverLayout"
import DriverDashboard from "./pages/Driver/DriverDashboard"

// PARENT
import ParentLayout from "./pages/Parent/ParentLayout"
import Home from "./pages/Parent/Home"

import LoginPage from "./pages/Login/LoginPage"

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>Loading...</div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect về trang phù hợp với role
    if (user.role === "QUAN_LY") return <Navigate to="/dashboard" replace />
    if (user.role === "TAI_XE") return <Navigate to="/driver" replace />
    if (user.role === "PHU_HUYNH") return <Navigate to="/parent" replace />
  }

  return children
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* ADMIN ROUTES - Chỉ cho QUAN_LY */}
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["QUAN_LY"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="bus" element={<BusList />} />
            <Route path="driver" element={<DriverList />} />
            <Route path="student" element={<StudentList />} />
            <Route path="schedule" element={<ScheduleList />} />
            <Route path="report" element={<ReportPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* DRIVER ROUTES - Chỉ cho TAI_XE */}
          <Route
            path="/driver"
            element={
              <ProtectedRoute allowedRoles={["TAI_XE"]}>
                <DriverLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DriverDashboard />} />
          </Route>

          {/* PARENT ROUTES - Chỉ cho PHU_HUYNH */}
          <Route
            path="/parent"
            element={
              <ProtectedRoute allowedRoles={["PHU_HUYNH"]}>
                <ParentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
