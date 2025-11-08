import { BrowserRouter, Routes, Route } from 'react-router-dom';

// ADMIN
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/adminDashboard';
import BusList from './pages/admin/BusList';
import DriverList from './pages/admin/DriverList';
import StudentList from './pages/admin/StudentList';
import ScheduleList from './pages/admin/Schedule';
import ReportPage from './pages/admin/ReportPage'; 
import ProfilePage from './pages/admin/ProfilePage';

// DRIVER
import DriverLayout from './layouts/DriverLayout';
import DriverDashboard from './pages/Driver/DriverDashboard';

// PARENT
import ParentLayout from './pages/Parent/ParentLayout';
import Home from './pages/Parent/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ADMIN ROUTES */}
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="bus" element={<BusList />} />
          <Route path="driver" element={<DriverList />} />
          <Route path="student" element={<StudentList />} />
          <Route path="schedule" element={<ScheduleList />} />
          <Route path="report" element={<ReportPage />} />
          <Route path="profile" element={<ProfilePage />} />

        </Route>

        {/* DRIVER ROUTES */}
        <Route path="/driver" element={<DriverLayout />}>
          <Route index element={<DriverDashboard />} />
        </Route>

        {/* PARENT ROUTES */}
        <Route path="/parent" element={<ParentLayout />}>
          <Route index element={<Home />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
