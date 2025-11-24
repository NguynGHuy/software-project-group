import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStop, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import MapComponent from '../../components/MapComponent';

export default function DriverTripPage() {
  const navigate = useNavigate();

  const handleEndTrip = () => {
    if(window.confirm("Bạn có chắc chắn muốn kết thúc chuyến đi?")) {
        navigate('/driver');
    }
  };

  return (
    // CONTAINER CHÍNH: Ép chiều cao bằng đúng màn hình trừ đi Header (khoảng 60px)
   <div style={{ 
        flex: 1,              // Tự động lấp đầy chiều cao còn lại
        display: 'flex',      // Thiết lập layout flex
        flexDirection: 'column',
        position: 'relative', 
        width: '100%', 
        background: '#000',
    }}>
      
      {/* 1. LỚP BẢN ĐỒ (Nằm dưới cùng) */}
      <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          zIndex: 1 
      }}>
        <MapComponent 
            center={[10.762622, 106.660172]}
            zoom={15}
            buses={[{
                idXeBus: 999,
                bienSo: "29B-12345",
                position: [10.762622, 106.660172],
                status: 'running'
            }]}
            // Truyền style để đảm bảo MapContainer nhận đủ chiều cao
            style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* 2. OVERLAY THÔNG TIN (Đè lên bản đồ) */}
      <div style={{
            position: 'absolute',
            top: '16px', left: '16px', right: '16px',
            background: 'rgba(24, 24, 27, 0.9)',
            padding: '12px',
            borderRadius: '12px',
            color: '#fff',
            zIndex: 10, // Cao hơn map
            border: '1px solid #3f3f46',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <FaMapMarkerAlt color="#ef4444" />
                <span style={{ fontWeight: 700 }}>Điểm tới: 780 Đống Đa</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#a1a1aa', marginLeft: '24px' }}>
                Dự kiến đến: 07:10 (5 phút)
            </div>
      </div>

      {/* 3. BẢNG ĐIỀU KHIỂN (Nằm dưới đáy) */}
      <div style={{ 
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          background: '#09090b', 
          padding: '16px', 
          borderTop: '1px solid #27272a',
          zIndex: 20, // Cao nhất
          paddingBottom: '24px' // Tránh bị sát đáy quá
      }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                  <FaUsers className="text-gray-400" /> <span>Đã đón: 12/15</span>
              </div>
              <div style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ width: 8, height: 8, background: '#22c55e', borderRadius: '50%', display: 'inline-block', marginRight: 6 }}></span>
                Đang ghi lộ trình
              </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button 
                onClick={() => alert("Đã gửi thông báo!")}
                style={{ padding: '14px', borderRadius: '12px', background: '#27272a', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }}
            >
                🔔 Báo sắp đến
            </button>

            <button 
                onClick={handleEndTrip}
                style={{ padding: '14px', borderRadius: '12px', background: '#dc2626', color: 'white', border: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
            >
                <FaStop /> Kết thúc
            </button>
          </div>
      </div>
    </div>
  );
}