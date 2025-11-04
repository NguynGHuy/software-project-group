import React from 'react';
import TableData from '../../components/Table/TableData';
import Status from '../../components/Status';
import './AdminPage.css'; // Dùng chung 1 file CSS cho các trang admin

const BusList = () => {
  // Dữ liệu giả
  const busData = [
    { license: '59A-012345', seats: 30, status: 'Hoạt động' },
    { license: '59A-99999', seats: 35, status: 'Ngừng hoạt động' },
    { license: '59A-12365', seats: 30, status: 'Bảo trì' },
  ];

  // Cấu hình cột
  const columns = [
    { key: 'license', title: 'Biển số xe' },
    { key: 'seats', title: 'Số ghế trên xe' },
    { key: 'status', title: 'Trạng thái' },
  ];

  // Hàm tùy chỉnh render cho Bảng
  const renderBusCell = (key, row) => {
    if (key === 'status') {
      return <Status statusText={row.status} />;
    }
    return row[key];
  };

  return (
    <div className="admin-page">
      <h1 className="page-title">Danh sách xe buýt</h1>
      
      {/* Bộ lọc Tabs */}
      <div className="filter-tabs">
        <button className="tab-item active">Tất cả</button>
        <button className="tab-item">Đang hoạt động</button>
        <button className="tab-item">Không hoạt động</button>
        <button className="tab-item">Bảo trì sửa chữa</button>
      </div>

      {/* Bảng dữ liệu */}
      <TableData 
        columns={columns} 
        data={busData} 
        renderCell={renderBusCell}
      />
    </div>
  );
};

export default BusList;