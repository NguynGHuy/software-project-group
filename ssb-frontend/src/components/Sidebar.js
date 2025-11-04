import React from 'react';
import { NavLink } from 'react-router-dom';
import './sidebar.css'; // Tạo file CSS này
; 

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        {/* <img src={logo} alt="Logo" className="sidebar-logo" /> */}
        <h2>SmartBus Admin</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li><NavLink to="/dashboard">DashBoard</NavLink></li>
          <li><NavLink to="/schedule">Lịch Trình</NavLink></li>
          <li><NavLink to="/bus">Xe Buýt</NavLink></li>
          <li><NavLink to="/driver">Tài xế</NavLink></li>
          <li><NavLink to="/student">Học sinh</NavLink></li>
          <li><NavLink to="/report">Báo cáo</NavLink></li>
          <li><NavLink to="/profile">Profile</NavLink></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;