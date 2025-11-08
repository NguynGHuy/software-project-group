// TRONG FILE: components/layout/Header.js

import React from 'react';
// Import icon từ thư viện (npm install react-icons)
import { FiSearch, FiBell } from 'react-icons/fi';
import './header.css'; // Tạo file CSS riêng cho Header

// Đây là component Avatar (Giống trong Hình 1)
const Avatar = () => {
  return (
    <div className="header-avatar">
      {/* Ảnh placeholder, bạn có thể thay bằng thẻ <img> */}
      <svg width="40" height="40" viewBox="0 0 40 40">
        <defs>
          <linearGradient id="avatar-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: '#007BFF', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: '#00C6FF', stopOpacity: 1}} />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="20" fill="url(#avatar-gradient)" />
        <text x="50%" y="50%" dy=".3em" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold">U</text>
      </svg>
    </div>
  );
};


const Header = () => {
  return (
    <header className="admin-header">
      {/* 1. Thanh Searchbar mới (Giống Hình 1) */}
      <div className="search-bar">
        <FiSearch color="#888" size={20} />
        <input type="text" placeholder="Search..." />
      </div>

      {/* 2. Cụm icon Chuông & User mới (Giống Hình 1) */}
      <div className="header-user-items">
        <button className="icon-button">
          <FiBell size={22} />
        </button>
        <Avatar />
      </div>
    </header>
  );
};

export default Header;