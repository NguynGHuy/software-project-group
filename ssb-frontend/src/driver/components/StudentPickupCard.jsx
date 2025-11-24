import React from 'react';

export default function StudentPickupCard({ student, onToggleStatus }) {
  const isPicked = student.status === 'picked';

  return (
    <div className="student-pickup-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <strong style={{ color: '#fff', fontSize: '1rem' }}>{student.name}</strong>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>{student.time}</span>
        </div>
        
        <div style={{ fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '4px' }}>{student.className}</div>
        <div style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>📍 {student.address}</div>

        <button 
            className={`status-btn ${isPicked ? 'btn-waiting' : 'btn-success'}`}
            onClick={() => onToggleStatus(student.id)}
        >
            {isPicked ? '↺ Hoàn tác' : '✔ Đã đón'}
        </button>
    </div>
  );
}