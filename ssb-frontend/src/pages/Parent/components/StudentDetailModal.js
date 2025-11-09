import React from "react";

export default function StudentDetailModal({ student, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h3>{student.name}</h3>
        <div className="student-detail-grid">
          <div><strong>Lớp:</strong> {student.className}</div>
          <div><strong>Xe:</strong> {student.bus}</div>
          <div><strong>Giờ đón:</strong> {student.pickup}</div>
          <div><strong>ETA:</strong> {student.eta}</div>
          <div><strong>Trạng thái:</strong> {student.statusLabel}</div>
        </div>
      </div>
    </div>
  );
}
