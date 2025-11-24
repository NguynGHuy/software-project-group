import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { FaBars, FaUserCircle } from "react-icons/fa";
import '../styles/driver.css'; // Import style riêng

export default function DriverLayout() {
  // Effect để đổi màu body thành đen khi vào trang Driver
  useEffect(() => {
    document.body.classList.add("driver-app-body");
    return () => document.body.classList.remove("driver-app-body");
  }, []);

  return (
    <div className="driver-app-shell">
      {/* Header Mobile */}
      <header className="driver-header">
        <button className="icon-btn" style={{ background: 'none', border: 'none', color: '#fff' }}>
            <FaBars size={24} />
        </button>
        
        <div className="header-title">Driver App</div>
        
        <div className="user-avatar">
            <FaUserCircle size={28} color="#a1a1aa" />
        </div>
      </header>

      {/* Nội dung thay đổi (Dashboard, History...) */}
      <div className="driver-content">
        <Outlet />
      </div>
    </div>
  );
}