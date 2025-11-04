import React from 'react';
import Card from '../../components/Card/Card';
import TableData from '../../components/Table/TableData';
import Status from '../../components/Status';
import StatCard from '../../components/Card/CardStat'; // Giả sử bạn đã có
import './adminDashboard.css'; // CSS riêng cho Dashboard
import './AdminPage.css'; // Dùng chung style

const AdminDashboard = () => {
  // Dữ liệu giả cho bảng lịch trình
  const scheduleData = [
    { id: 'B1', time: '9:00 AM', driver: 'John', status: 'Đang hoạt động' }
  ];
  const scheduleCols = [
    { key: 'id', title: 'Tuyến' },
    { key: 'time', title: 'Thời gian' },
    { key: 'driver', title: 'Tài xế' },
    { key: 'status', title: 'Trạng thái' },
  ];
  const renderScheduleCell = (key, row) => {
    if (key === 'status') {
      return <Status statusText={row.status} />;
    }
    return row[key];
  };

  return (
    <div className="admin-page">
      <div className="dashboard-grid">
        {/* Hàng 1: Các thẻ thống kê nhỏ */}
        <Card className="stat-card">
          <div className="stat-info">
            <span className="stat-title">Tổng người dùng</span>
            <span className="stat-value">12.3K</span>
          </div>
          <div className="stat-chart">
            {/* <ChartStat type="mini-line" /> */}
          </div>
        </Card>
        
        <Card className="stat-card">
          <div className="stat-info">
            <span className="stat-title">Tuyến Hoạt động</span>
            <span className="stat-value">36</span>
          </div>
          <div className="stat-chart">
            {/* <ChartStat type="mini-line" /> */}
          </div>
        </Card>

        {/* Hàng 1: Biểu đồ tuyến xe bus */}
        <Card title="Tuyến xe Bus" className="grid-col-span-2">
          {/* <ChartStat type="main-line" /> */}
          <p>(Nội dung biểu đồ Tuyến xe Bus)</p>
        </Card>

        {/* Hàng 2: Lịch trình và Thông báo */}
        <Card title="Lịch trình hôm nay">
          <TableData 
            columns={scheduleCols} 
            data={scheduleData} 
            renderCell={renderScheduleCell} 
          />
        </Card>

        <Card title="Thông Báo" className="grid-row-span-2">
          <p>Bus 01 đang dừng lại</p>
          <p>Bus 02 đang trì hoãn</p>
        </Card>

        {/* Hàng 3: Khu vực */}
        <Card title="Khu vực & Tuyến phụ trách" className="grid-col-span-2">
          <p>(Nội dung khu vực...)</p>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;