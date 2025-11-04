import React from 'react';
import './header.css'; // Tạo file CSS này
// Import icons từ thư viện (ví dụ: react-icons)
// import { FiSearch, FiBell } from 'react-icons/fi';

const Header = () => {
  return (
    <header className="header">
      <div className="search-bar">
        {/* <FiSearch className="search-icon" /> */}
        <input type="text" placeholder="Search..." />
      </div>
      <div className="user-actions">
        {/* <FiBell className="action-icon" /> */}
        <span>🔔</span>
        <img 
          src="https://via.placeholder.com/40" // Thay bằng ảnh profile
          alt="User Avatar" 
          className="user-avatar" 
        />
      </div>
    </header>
  );
};

export default Header;