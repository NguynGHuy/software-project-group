import React, { useState } from "react";
import { FaBus, FaRegClock, FaUserCircle, FaPhone, FaInfoCircle } from "react-icons/fa";
import MapComponent from "../../components/MapComponent";

export default function StudentCard({ student, isInitiallyExpanded = false }) {
  const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const handleCallDriver = (e) => {
    e.stopPropagation();
    const phone = student.driverPhone || "0901234567";
    window.location.href = `tel:${phone}`;
  };

  return (
    <div
      className={`student-card-v2 ${isExpanded ? "expanded" : ""}`}
      style={{
        marginBottom: "20px",
        borderRadius: "20px",
        overflow: "hidden",
        background: "linear-gradient(145deg, #1a1a1d, #141416)",
        border: "1px solid #333",
        boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
        color: "#fff",
        fontFamily: "'Segoe UI', sans-serif"
      }}
    >
      {/* HEADER */}
      <div
        className="card-header"
        onClick={toggleExpand}
        style={{ 
            cursor: "pointer", 
            padding: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
        }}
      >
        <div className="avatar-info" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <FaUserCircle size={48} color="#60a5fa" />
          <div className="name-class">
            <div className="student-name" style={{ fontSize: "1.25rem", fontWeight: 700, color: "#fff" }}>
              {student.name}
            </div>
            <div className="student-class" style={{ fontSize: "1rem", color: "#93c5fd" }}>
              {student.className}
            </div>
          </div>
        </div>
        
        {student.status === "onboard" && (
          <div className="status-badge onboard" style={{ background: "#f97316", padding: "6px 12px", borderRadius: "20px", fontWeight: 600, fontSize: '0.85rem' }}>
            Trên xe
          </div>
        )}
      </div>

      {/* THÔNG TIN CƠ BẢN */}
      <div className="card-body" style={{ padding: "0 16px 16px 80px" }}>
        <div className="info-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <FaBus size={16} color="#60a5fa" />
          <span style={{ fontSize: "0.95rem", color: "#e0e0e0" }}>
            Xe buýt: {student.busName || "Chưa phân công xe"}
          </span>
        </div>
        <div className="info-row" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaRegClock size={16} color="#60a5fa" />
          <span style={{ fontSize: "0.95rem", color: "#e0e0e0" }}>
            Thời gian đón: {student.pickupTime || "Chưa có"} - ETA: {student.eta || "-"}
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="expanded-details" style={{ padding: "16px", borderTop: "1px solid #333", background: "rgba(0,0,0,0.2)" }}>
          {/* Trường hợp chưa có xe */}
          {(student.busName === "Chưa phân công xe" || student.status === "missing_bus") && (
              <p
                style={{
                  textAlign: "center",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "#ff6b6b",
                  margin: "0 0 16px 0",
                  textShadow: "0 0 10px rgba(255,107,107,0.3)",
                  letterSpacing: '1px'
                }}
              >
                CHƯA CÓ XE BUS
              </p>
          )}

            <div
              className="map-wrapper"
              style={{
                height: "280px",
                borderRadius: "16px",
                overflow: "hidden",
                margin: "0 0 20px 0",
                border: "2px solid #333",
                boxShadow: "0 10px 20px rgba(0,0,0,0.5)",
                position: "relative",
                zIndex: 1,
              }}
            >
              <MapComponent
                center={[10.762622, 106.660172]}
                zoom={14}
                buses={[
                  {
                    idXeBus: student.id || 999,
                    bienSo: student.busName || "Chưa có",
                    position: [
                      10.762622 + (Math.random() - 0.5) * 0.04,
                      106.660172 + (Math.random() - 0.5) * 0.04,
                    ],
                    status: "waiting",
                  },
                ]}
              />
            </div>

            <div className="details-grid" style={{ fontSize: "0.95rem", color: "#e0e0e0", display: 'grid', gridTemplateColumns: '100px 1fr', gap: '12px', marginBottom: '24px' }}>
              <div style={{ color: '#94a3b8' }}>Lớp:</div>
              <div style={{ fontWeight: 600 }}>{student.className}</div>
              
              <div style={{ color: '#94a3b8' }}>Học sinh:</div>
              <div style={{ fontWeight: 600 }}>{student.name}</div>
              
              <div style={{ color: '#94a3b8' }}>Điểm đón:</div>
              <div style={{ color: "#ff6b6b" }}>{student.pickupPoint !== 'Chưa có' ? student.pickupPoint : 'Chưa cập nhật'}</div>
              
              <div style={{ color: '#94a3b8' }}>Thời gian:</div>
              <div style={{ color: "#ff6b6b" }}>{student.pickupTime !== 'Chưa có' ? student.pickupTime : 'Chưa cập nhật'}</div>
            </div>

            {/* --- SỬA LỖI NÚT LỆCH Ở ĐÂY --- */}
            <div className="action-buttons" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {/* Nút Chi tiết */}
              <button className="action-btn" style={{ 
                  padding: "14px", 
                  height: "52px", // Đặt chiều cao cố định
                  fontSize: "1rem", 
                  borderRadius: "12px", 
                  background: "#e5e5e5", // Màu sáng như hình bạn gửi
                  color: "black", 
                  border: "1px solid #ccc", // Có viền
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer',
                  fontWeight: 600
              }}>
                <FaInfoCircle /> Chi tiết
              </button>
              
              {/* Nút Gọi tài xế */}
              <button
                className="action-btn"
                onClick={handleCallDriver}
                style={{
                  padding: "14px",
                  height: "52px", // Đặt chiều cao bằng nút kia
                  fontSize: "1rem",
                  borderRadius: "12px",
                  background: "#ef4444",
                  color: "white",
                  border: "1px solid #ef4444", // Thêm viền trùng màu nền để bù kích thước
                  fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer'
                }}
              >
                <FaPhone /> Gọi tài xế
              </button>
            </div>
        </div>
      )}

      <div className="card-footer" style={{ padding: "0 16px 16px" }}>
        {isExpanded && (
            <button
            className="view-details-btn"
            onClick={toggleExpand}
            style={{
                width: "100%",
                padding: "14px",
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: "12px",
                background: "#3b82f6",
                border: "none",
                color: "white",
                cursor: 'pointer',
                marginTop: '16px'
            }}
            >
            Ẩn thông tin
            </button>
        )}
         {!isExpanded && (
            <button
            className="view-details-btn"
            onClick={toggleExpand}
            style={{
                width: "100%",
                padding: "12px",
                fontSize: "0.9rem",
                fontWeight: 600,
                borderRadius: "12px",
                background: "transparent",
                border: "1px solid #3b82f6",
                color: "#3b82f6",
                cursor: 'pointer'
            }}
            >
            Xem chi tiết ▼
            </button>
        )}
      </div>
    </div>
  );
}