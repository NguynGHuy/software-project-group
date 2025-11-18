import { useState, useEffect } from 'react'
import {
  Box,
  Dialog,
  DialogContent,
  Button,
  Chip,
  Avatar,
  Typography,
} from '@mui/material'
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PhoneIcon from '@mui/icons-material/Phone'
import InfoIcon from '@mui/icons-material/Info'
import { parentService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import MapComponent from '../components/MapComponent'
import useRealTimeTracking from '../hooks/useRealTimeTracking'
import '../styles/parent.css'

const ParentDashboard = () => {
  const { user } = useAuth()
  const [children, setChildren] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [openDetail, setOpenDetail] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { connected, busLocations } = useRealTimeTracking()

  useEffect(() => {
    loadData()
  }, [user])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (user && user.detail?.idPhuHuynh) {
        const response = await parentService.getStudents(user.detail.idPhuHuynh)
        const childrenData = Array.isArray(response.data) 
          ? response.data 
          : (response.data?.data || [])
        
        setChildren(childrenData)
      } else {
        setError('Không tìm thấy thông tin phụ huynh')
      }
    } catch (error) {
      console.error('[v0] ParentDashboard - Failed to load data:', error)
      setError('Không thể tải thông tin học sinh. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusInfo = (status) => {
    switch(status) {
      case 'boarding':
        return { label: 'Đang lên xe', className: 'status-pending' }
      case 'on_bus':
        return { label: 'Đã lên xe', className: 'status-active' }
      case 'arrived':
        return { label: 'Đã đến trường', className: 'status-active' }
      default:
        return { label: 'Chờ đón', className: 'status-pending' }
    }
  }

  return (
    <div className="parent-app">
      <Box sx={{ maxWidth: '450px', margin: '0 auto', p: 2 }}>
        <p className="greeting">
          Xin chào, {user?.detail?.hoTen || 'Phụ huynh A'}
        </p>

        <Typography sx={{ fontSize: '16px', fontWeight: 600, mb: 2, color: '#fff' }}>
          Con của bạn
        </Typography>

        {loading ? (
          <div className="card">
            <Typography sx={{ color: '#94a3b8', textAlign: 'center' }}>
              Đang tải dữ liệu...
            </Typography>
          </div>
        ) : error ? (
          <div className="card" style={{ borderColor: 'var(--color-danger)' }}>
            <Typography sx={{ color: 'var(--color-danger)', textAlign: 'center' }}>
              {error}
            </Typography>
          </div>
        ) : children.length === 0 ? (
          <div className="card">
            <Typography sx={{ color: '#94a3b8', textAlign: 'center' }}>
              Chưa có thông tin học sinh được liên kết
            </Typography>
          </div>
        ) : (
          children.map((child) => {
            const status = getStatusInfo(child.status || 'on_bus')
            return (
              <div key={child.idHocSinh} className="student-card fade-in">
                <div className="student-header">
                  <Avatar className="avatar">
                    {child.hoTen?.charAt(0) || 'H'}
                  </Avatar>
                  <div className="student-info">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 className="student-name">{child.hoTen}</h3>
                      <span className={`status-badge ${status.className}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="student-id">{child.lop}</p>
                  </div>
                </div>

                <div className="student-id" style={{ marginBottom: 'var(--space-md)' }}>
                  ID: SBN-{child.idHocSinh}
                </div>

                <div className="bus-info">
                  <DirectionsBusIcon sx={{ fontSize: '16px' }} />
                  <span className="bus-info-text">
                    {child.xeBus || 'Chưa phân công xe'}
                  </span>
                </div>

                <div className="pickup-time">
                  <AccessTimeIcon sx={{ fontSize: '14px' }} />
                  <span>
                    Thời gian đón: {child.gioBatDau?.substring(0, 5) || '07:15'} - {child.tenDiemDon || 'Chưa có điểm dừng'}
                  </span>
                </div>

                <div className="action-buttons">
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      setSelectedStudent(child)
                      setOpenDetail(true)
                    }}
                    style={{ width: '100%' }}
                  >
                    Xem thông tin
                  </button>
                </div>
              </div>
            )
          })
        )}

        {/* Student Detail Dialog */}
        <Dialog 
          open={openDetail} 
          onClose={() => setOpenDetail(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: '#111',
              color: '#ffffff',
              borderRadius: '16px',
              maxWidth: '400px'
            }
          }}
        >
          <DialogContent sx={{ p: 3 }}>
            {selectedStudent && (
              <>
                <Typography sx={{ fontSize: '16px', fontWeight: 600, mb: 2 }}>
                  {selectedStudent.xeBus || 'Chưa có xe bus'}
                </Typography>
                <Typography sx={{ fontSize: '12px', color: '#888', mb: 2 }}>
                  Tuyến: {selectedStudent.tenTuyen || 'Chưa có tuyến'}
                </Typography>

                <Box sx={{ 
                  height: '200px', 
                  bgcolor: '#1a1a1a',
                  borderRadius: '12px',
                  mb: 3,
                  overflow: 'hidden'
                }}>
                  <MapComponent 
                    center={[10.762622, 106.660172]}
                    buses={[{ 
                      idXeBus: 1, 
                      bienSo: selectedStudent.xeBus || '29A-12345',
                      position: [10.762622, 106.660172]
                    }]}
                    realTimeLocations={busLocations}
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography sx={{ fontSize: '12px', color: '#888' }}>Lớp</Typography>
                    <Typography sx={{ fontSize: '12px' }}>{selectedStudent.lop}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography sx={{ fontSize: '12px', color: '#888' }}>Học sinh</Typography>
                    <Typography sx={{ fontSize: '12px' }}>{selectedStudent.hoTen}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography sx={{ fontSize: '12px', color: '#888' }}>Điểm đón</Typography>
                    <Typography sx={{ fontSize: '12px' }}>{selectedStudent.tenDiemDon || 'Chưa có'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography sx={{ fontSize: '12px', color: '#888' }}>Thời gian</Typography>
                    <Typography sx={{ fontSize: '12px' }}>
                      {selectedStudent.gioBatDau?.substring(0, 5)} - {selectedStudent.gioKetThuc?.substring(0, 5)}
                    </Typography>
                  </Box>
                </Box>

                <div className="action-buttons">
                  <button className="btn btn-outline">
                    <InfoIcon sx={{ fontSize: '16px', mr: 0.5 }} />
                    Chi tiết
                  </button>
                  <button className="btn btn-outline">
                    <PhoneIcon sx={{ fontSize: '16px', mr: 0.5 }} />
                    Gọi tài xế
                  </button>
                </div>

                <button
                  className="btn btn-outline"
                  onClick={() => setOpenDetail(false)}
                  style={{ width: '100%', marginTop: 'var(--space-md)' }}
                >
                  Ẩn thông tin
                </button>
              </>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </div>
  )
}

export default ParentDashboard
