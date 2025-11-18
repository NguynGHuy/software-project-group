import React, { useState } from "react";
import { FaBus, FaRegClock, FaUserCircle, FaPhone, FaInfoCircle } from "react-icons/fa";
import MapComponent from "../../components/MapComponent";

export default function StudentCard({ student, isInitiallyExpanded = false }) {
  const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const handleCallDriver = () => {
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
      }}
    >
      {/* HEADER */}
      <div
        className="card-header"
        onClick={toggleExpand}
        style={{ cursor: "pointer", padding: "4px 0" }}
      >
        <div className="avatar-info">
          <FaUserCircle size={48} color="#60a5fa" />
          <div className="name-class">
            <div className="student-name" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
              {student.name}
            </div>
            <div className="student-class" style={{ fontSize: "1rem", color: "#93c5fd" }}>
              {student.className}
            </div>
          </div>
        </div>
        {student.status === "onboard" && (
          <div className="status-badge onboard" style={{ background: "#f97316", padding: "6px 12px", borderRadius: "20px", fontWeight: 600 }}>
            Đang trên xe
          </div>
        )}
      </div>

      {/* THÔNG TIN CƠ BẢN */}
      <div className="card-body" style={{ paddingLeft: "60px", paddingBottom: "8px" }}>
        <div className="info-row">
          <FaBus size={16} color="#60a5fa" />
          <span style={{ fontSize: "1rem", color: "#e0e0e0" }}>
            Xe buýt: {student.busName || "Chưa phân công xe"}
          </span>
        </div>
        <div className="info-row">
          <FaRegClock size={16} color="#60a5fa" />
          <span style={{ fontSize: "1rem", color: "#e0e0e0" }}>
            Thời gian đón: {student.pickupTime || "Chưa có"} - ETA: {student.eta || "-"}
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="expanded-details" style={{ paddingTop: "16px", borderTop: "1px solid #333" }}>
          {student.status === "missing_bus" && (
            <>
              <p
                style={{
                  textAlign: "center",
                  fontSize: "1.3rem",
                  fontWeight: "bold",
                  color: "#ff6b6b",
                  margin: "0 0 16px 0",
                  textShadow: "0 0 10px rgba(255,107,107,0.5)",
                }}
              >
                CHƯA CÓ XE BUS
              </p>

            
              <div
                className="map-wrapper"
                style={{
                  height: "280px",
                  borderRadius: "20px",
                  overflow: "hidden",
                  margin: "20px 0",
                  border: "3px solid #333",
                  boxShadow: "0 15px 40px rgba(0,0,0,0.7)",
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

              <div className="details-grid" style={{ fontSize: "1rem", color: "#e0e0e0" }}>
                <div>Lớp:</div>
                <div style={{ fontWeight: 600 }}>{student.className}</div>
                <div>Học sinh:</div>
                <div style={{ fontWeight: 600 }}>{student.name}</div>
                <div>Điểm đón:</div>
                <div style={{ color: "#ff6b6b" }}>Chưa có</div>
                <div>Thời gian:</div>
                <div style={{ color: "#ff6b6b" }}>Chưa có</div>
              </div>

              <div className="action-buttons" style={{ marginTop: "20px" }}>
                <button className="action-btn" style={{ padding: "16px", fontSize: "1.1rem", borderRadius: "16px" }}>
                  <FaInfoCircle style={{ marginRight: "8px" }} /> Chi tiết
                </button>
                <button
                  className="action-btn"
                  onClick={handleCallDriver}
                  style={{
                    padding: "16px",
                    fontSize: "1.1rem",
                    borderRadius: "16px",
                    background: "#ef4444",
                    border: "none",
                  }}
                >
                  <FaPhone style={{ marginRight: "8px" }} /> Gọi tài xế
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <div className="card-footer" style={{ padding: "12px 20px 20px" }}>
        <button
          className="view-details-btn"
          onClick={toggleExpand}
          style={{
            width: "100%",
            padding: "16px",
            fontSize: "1.1rem",
            fontWeight: 600,
            borderRadius: "16px",
            background: isExpanded ? "#3b82f6" : "#27272a",
            border: "1px solid #3b82f6",
            color: "white",
          }}
        >
          {isExpanded ? "Ẩn thông tin" : "Xem thông tin"}
        </button>
      </div>
    </div>
  );
}