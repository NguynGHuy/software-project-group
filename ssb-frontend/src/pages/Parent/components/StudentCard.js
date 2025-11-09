import React, { useState } from "react";
import { FaBus, FaRegClock, FaUserCircle } from "react-icons/fa";

export default function StudentCard({ student }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleDetails = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCallDriver = (e) => {
    e.stopPropagation();
    console.log("Gọi tài xế...");
  };

  const handleGetDirections = (e) => {
    e.stopPropagation();
    console.log("Chỉ đường...");
  };

  return (
    <div className="student-card-v2">
      <div className="card-header">
        <div className="avatar-info">
          <div className="avatar">
            <FaUserCircle size={40} color="#9CA3AF" />
          </div>
          <div className="name-class">
            <span className="student-name">{student.name}</span>
            <span className="student-class">{student.className}</span>
          </div>
        </div>
        <span className={`status-badge ${student.status}`}>
          {student.statusLabel}
        </span>
      </div>

      <div className="card-body">
        <div className="info-row">
          <FaBus size={16} color="#9CA3AF" />
          <span>Xe buýt: {student.bus}</span>
        </div>
        <div className="info-row">
          <FaRegClock size={16} color="#9CA3AF" />
          <span>Thời gian đón: {student.pickup} • ETA: {student.eta}</span>
        </div>
      </div>

      {isExpanded && (
        <div className="expanded-details">
          <h4 className="details-title">Thông tin xe buýt</h4>

          <div className="map-placeholder">BẢN ĐỒ</div>

          <div className="bus-header">
            <span className="bus-name">Xe buýt {student.bus}</span>
            <span className="bus-status">Đang di chuyển</span>
          </div>

          <div className="details-grid">
            <div>
              <span>Tài xế: TX001</span>
              <span>Vị trí hiện tại: 123 abc</span>
              <span>Khoảng cách: 2.5 km</span>
            </div>
            <div>
              <span>Tốc độ: 40 km/h</span>
              <span>Thời gian dự kiến: 25 phút</span>
            </div>
          </div>

          <div className="action-buttons">
            <button className="action-btn" onClick={handleGetDirections}>
              Chỉ đường
            </button>
            <button className="action-btn" onClick={handleCallDriver}>
              Gọi tài xế
            </button>
          </div>
        </div>
      )}

      <div className="card-footer">
        <button className="view-details-btn" onClick={handleToggleDetails}>
          {isExpanded ? "Ẩn thông tin" : "Xem thông tin"}
        </button>
      </div>
    </div>
  );
}