import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/adminDashboard';
import BusList from './pages/admin/BusList';
import DriverList from './pages/admin/DriverList';
import StudentList from './pages/admin/StudentList';
import ScheduleList from './pages/admin/Schedule';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="bus" element={<BusList />} />
          <Route path="driver" element={<DriverList />} />
          <Route path="student" element={<StudentList />} />
          <Route path="schedule" element={<ScheduleList />} /> {/**/}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
