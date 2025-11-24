import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaStop, FaExclamationTriangle, FaCommentDots } from "react-icons/fa";

// Import các component con (Code ở mục 2 và 3 bên dưới)
import TripStatusCard from "../driver/components/TripStatusCard";
import StudentPickupCard from "../driver/components/StudentPickupCard";

// Dữ liệu giả lập ban đầu
const MOCK_TRIP_INFO = {
  routeName: "Chuyến đón sáng",
  description: "Cầu Giấy - Trường DEF",
  startTime: "07:00",
  nextStop: "Trạm 3/5",
};

const INITIAL_STUDENTS = [
  { id: 1, name: "Nguyễn Văn A", className: "Lớp 3C", address: "780 Đống Đa, Hà Nội", time: "07:15", status: "waiting" },
  { id: 2, name: "Trần Thị B", className: "Lớp 3C", address: "123 Cầu Giấy, Hà Nội", time: "07:25", status: "waiting" },
  { id: 3, name: "Lê Hoàng C", className: "Lớp 4A", address: "456 Kim Mã, Hà Nội", time: "07:30", status: "picked" }, // Đã lên xe
  { id: 4, name: "Phạm Văn D", className: "Lớp 5B", address: "12 Láng Hạ, Hà Nội", time: "07:35", status: "waiting" },
];

export default function DriverDashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState(INITIAL_STUDENTS);

  // Tính toán số liệu Real-time
  const totalCount = students.length;
  const pickedCount = students.filter(s => s.status === 'picked').length;
  const remainingCount = totalCount - pickedCount;

  // Xử lý chuyển trang khi bấm Bắt đầu
  const handleStartTrip = () => {
    navigate('/driver/trip');
  };

  // Xử lý toggle trạng thái đón
  const toggleStatus = (id) => {
    setStudents(prev => prev.map(s => 
        s.id === id 
        ? { ...s, status: s.status === 'waiting' ? 'picked' : 'waiting' } 
        : s
    ));
  };

  const handleEndTrip = () => {
      if(window.confirm("Kết thúc chuyến đi ngay?")) {
          alert("Đã kết thúc chuyến!");
      }
  }

  return (
    <div className="driver-dashboard" style={{ padding: '16px', overflowY: 'auto', height: '100%' }}>
      {/* 1. Greeting Section */}
      <div className="greeting-section">
        <div className="greeting-text">Xin chào, Tài xế Nguyễn Văn A</div>
        <div className="date-text">Thứ Ba, 30 tháng 9, 2025</div>
      </div>

      {/* 2. Card Trạng Thái Chuyến (Dữ liệu động) */}
      <TripStatusCard 
        info={MOCK_TRIP_INFO} 
        stats={{ total: totalCount, picked: pickedCount, remaining: remainingCount }} 
      />

      {/* 3. Grid 4 Nút Hành Động */}
      <div className="action-grid">
        <button className="action-btn-large btn-white" onClick={handleStartTrip}>
            <FaPlay size={24} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Bắt đầu</span>
        </button>
        <button className="action-btn-large btn-dark" onClick={handleEndTrip}>
            <FaStop size={24} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Kết thúc</span>
        </button>
        <button className="action-btn-large btn-red" onClick={() => alert("Mở form báo cáo sự cố")}>
            <FaExclamationTriangle size={24} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Báo cáo</span>
        </button>
        <button className="action-btn-large btn-dark" onClick={() => alert("Mở danh sách tin nhắn")}>
            <FaCommentDots size={24} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Tin nhắn</span>
        </button>
      </div>

      {/* 4. Danh sách học sinh cần đón */}
      <div className="student-list-section">
        <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '12px' }}>Danh sách học sinh ({remainingCount} chưa đón)</h3>
        {students.map(std => (
            <StudentPickupCard key={std.id} student={std} onToggleStatus={toggleStatus} />
        ))}
      </div>
    </div>
  );
}