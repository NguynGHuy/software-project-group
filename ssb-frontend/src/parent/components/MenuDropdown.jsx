import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Lưu ý: Chỉnh đường dẫn đúng tới AuthContext

export default function MenuDropdown() {
  const { logout } = useAuth(); // Lấy hàm logout từ context

  const handleLogout = () => {
    logout(); // Gọi hàm này để xóa user và token
    // App.jsx sẽ tự động chuyển về trang Login khi user = null
  };

  return (
    <div className="menu-dropdown">
      <Link to="/parent/profile" className="menu-item">
        Hồ sơ
      </Link>
      
      {/* Các menu khác nếu có */}
      {/* <Link to="/parent/settings" className="menu-item">Cài đặt</Link> */}

      <button onClick={handleLogout} className="menu-item menu-item-logout">
        Đăng xuất
      </button>
    </div>
  );
}