import React from 'react';
import { FaClock, FaMapMarkerAlt, FaUser } from 'react-icons/fa';

export default function TripStatusCard({ info, stats }) {
  return (
    <div className="trip-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
            <span className="badge-processing">Đang thực hiện</span>
            <h3 style={{ color: '#fff', margin: '8px 0 4px', fontSize: '1.2rem' }}>{info.routeName}</h3>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', margin: 0 }}>{info.description}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>
                {stats.picked}/{stats.total}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#71717a' }}>Học sinh</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', borderTop: '1px solid #333', paddingTop: '16px' }}>
         <div style={{ color: '#fff', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
            <FaClock style={{ marginRight: 6, color: '#a1a1aa' }} /> {info.startTime}
         </div>
         <div style={{ color: '#fff', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
            <FaMapMarkerAlt style={{ marginRight: 6, color: '#a1a1aa' }} /> {info.nextStop}
         </div>
         <div style={{ color: '#fff', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
            <FaUser style={{ marginRight: 6, color: '#a1a1aa' }} /> Còn lại: {stats.remaining}
         </div>
      </div>
    </div>
  );
}