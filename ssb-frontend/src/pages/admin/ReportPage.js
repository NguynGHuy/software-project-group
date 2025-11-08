import React from 'react';
import { FiSearch } from 'react-icons/fi';
import './AdminPage.css';
import './ReportPage.css';

const ReportPage = () => {
  return (
    <div className="admin-page">
      <h1 className="page-title">Báo cáo</h1>

      <div className="report-search-bar">
        <FiSearch color="#888" size={20} />
        <input type="text" placeholder="Tìm kiếm báo cáo..." />
      </div>

      <div className="report-content-area">
        {/* Nội dung báo cáo sẽ được hiển thị ở đây */}
      </div>
    </div>
  );
};

export default ReportPage;