import React from 'react';
import Card from '../../components/UI/Card/Card';
import TableData from '../../components/UI/Table/TableData';
import Status from '../../components/UI/Status';

import './AdminPage.css';
import './adminDashboard.css';

const SparklineChart = () => (
  <div className="sparkline-chart">
    <svg width="100%" height="100%" viewBox="0 0 100 30" preserveAspectRatio="none">
      <path d="M 0 20 L 10 15 L 20 18 L 30 12 L 40 15 L 50 20 L 60 25 L 70 18 L 80 10 L 90 14 L 100 10" 
            fill="none" stroke="#8A74F9" strokeWidth="2"/>
    </svg>
  </div>
);

const MainBusChart = () => (
  <div className="main-bus-chart">
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M 10 80 L 30 40 L 50 50 L 70 30 L 90 20" 
              fill="none" stroke="#8A74F9" strokeWidth="3"/>
        <text x="10" y="95" fill="#888">A</text>
        <text x="30" y="55" fill="#888">B</text>
        <text x="50" y="65" fill="#888">C</text>
        <text x="90" y="35" fill="#888">D</text>
    </svg>
  </div>
);

const ZoneStat = ({ title, value, subtext }) => (
  <div className="zone-stat-card">
    <span className="zone-stat-title">{title}</span>
    <span className="zone-stat-value">{value}</span>
    {subtext && <span className="zone-stat-subtext">{subtext}</span>}
  </div>
);

const AdminDashboard = () => {
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
        
        <Card title="Tổng người dùng" className="stat-user">
          <span className="stat-value-large">12.3K</span>
          <SparklineChart />
        </Card>

        <Card title="Tuyến Hoạt động" className="stat-routes">
          <span className="stat-value-large">36</span>
          <SparklineChart />
        </Card>

        <Card title="Tuyến xe Bus" className="chart-bus-routes">
          <MainBusChart />
        </Card>

        <Card title="Lịch trình hôm nay" className="table-schedule">
          <TableData 
            columns={scheduleCols} 
            data={scheduleData} 
            renderCell={renderScheduleCell} 
          />
        </Card>

        <Card title="Thông Báo" className="notifications">
          <p>Bus 01 đang dừng lại</p>
          <p>Bus 02 đang trì hoãn</p>
        </Card>

        <Card title="Khu vực & Tuyến phụ trách" className="zone-summary">
          <div className="zone-summary-content">
            <ZoneStat 
              title="Tuyến đang quản lý" 
              value="5 Tuyến" 
              subtext="Tuyến nổi bật: 12 - Đại học KHTN -> Bến xe Miền Tây" 
            />
            <ZoneStat 
              title="Xe hoạt động" 
              value="42" 
            />
            <ZoneStat 
              title="Tài xế hiện tại" 
              value="18" 
              subtext="Báo cáo chốt: Bảo trì động cơ (B12), Lốp (B2)" 
            />
            <ZoneStat 
              title="Báo cáo tồn" 
              value="3" 
            />
          </div>
        </Card>

      </div>
    </div>
  );
};

export default AdminDashboard;