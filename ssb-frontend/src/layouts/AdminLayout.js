import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import './AdminLayout.css'; // Tạo file CSS này để style

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      {/* Phần 1: Sidebar */}
      <Sidebar />

      {/* Phần 2: Nội dung chính */}
      <div className="main-content">
        <Header />
        <main className="page-content">
          {/* Đây là nơi các trang con sẽ được render */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;