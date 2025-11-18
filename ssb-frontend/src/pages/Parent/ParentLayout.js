import React, { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import "./parent.css"; 

import NotificationDropdown from "./components/NotificationDropdown";
import useOnClickOutside from "./useOnClickOutside";

const noticesMock = [
  { id: 1, title: "Con của bạn đã đến trường", desc: "HS2 đã đến trường..." },
  { id: 2, title: "Con của bạn đã được đón", desc: "HS1 đã lên xe..." },
  { id: 3, title: "Xe buýt bị trễ", desc: "Xe buýt 29A-12345..." },
];

const MenuDropdown = () => {
  const handleLogout = () => {
    console.log("Đang đăng xuất...");
    // Thêm logic đăng xuất (xóa token, điều hướng)
  };

  return (
    <div className="menu-dropdown">
      <a href="/parent/profile" className="menu-item">
        Hồ sơ
      </a>
      <button onClick={handleLogout} className="menu-item menu-item-logout">
        Đăng xuất
      </button>
    </div>
  );
};

export default function ParentLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const notificationRef = useRef();
  const menuRef = useRef();

  useOnClickOutside(notificationRef, () => setIsNotifOpen(false));
  useOnClickOutside(menuRef, () => setIsMenuOpen(false));

  useEffect(() => {
    document.body.classList.add("parent-app-body");
    return () => {
      document.body.classList.remove("parent-app-body");
    };
  }, []);

  return (
    <div className="parent-app-shell">
      <div className="parent-topbar">
        
        <div className="menu-wrapper" ref={menuRef}>
          <button 
            className="icon-btn menu-btn" 
            aria-label="menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none"><rect width="20" height="2" rx="1" fill="white"/><rect y="6" width="20" height="2" rx="1" fill="white"/><rect y="12" width="20" height="2" rx="1" fill="white"/></svg>
          </button>
          {isMenuOpen && <MenuDropdown />}
        </div>
        
        <div className="parent-title">Parent App</div>

        <div className="notification-wrapper" ref={notificationRef}>
          <button 
            className="icon-btn bell-btn" 
            aria-label="notifications"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 22c1.1 0 2-.9 2-2H10c0 1.1.9 2 2 2Z" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 17H5v-1c0-3.1 1.6-5.8 4.3-7.1V8a3.7 3.7 0 0 1 7.4 0v.9C17.4 10.2 19 12.9 19 16v1z" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="badge">3</span>
          </button>
          
          {isNotifOpen && <NotificationDropdown notices={noticesMock} />}
        </div>
      </div>

      <div className="parent-container">
        <Outlet />
      </div>
    </div>
  );
}