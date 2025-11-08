
import React from 'react';
import { NavLink } from 'react-router-dom';
import './sidebar.css'; 

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        SmartBus Admin
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="nav-link">
          DashBoard
        </NavLink>
        <NavLink to="/schedule" className="nav-link">
          Lịch Trình
        </NavLink>
        <NavLink to="/bus" className="nav-link">
          Xe Buýt
        </NavLink>
        <NavLink to="/driver" className="nav-link">
          Tài xế
        </NavLink>
        <NavLink to="/student" className="nav-link">
          Học sinh
        </NavLink>
        <NavLink to="/report" className="nav-link">
          Báo cáo
        </NavLink>
        <NavLink to="/profile" className="nav-link profile-link">
          Profile
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
