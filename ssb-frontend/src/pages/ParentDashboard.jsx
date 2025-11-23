import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material'
import { parentService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import StudentCard from "../parent/components/StudentCard"

// Không cần import css riêng ở đây nữa vì ParentLayout đã import rồi

const ParentDashboard = () => {
  const { user } = useAuth()
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

        const normalized = childrenData.map(child => ({
          id: child.idHocSinh,
          name: child.hoTen,
          className: child.lop,
          status: mapStatus(child.status),
          busName: child.xeBus || 'Chưa phân công xe',
          pickupPoint: child.tenDiemDon || 'Chưa có',
          pickupTime: child.gioBatDau?.substring(0, 5) || '07:15',
          driver: child.tenTaiXe || 'Chưa có',
          driverPhone: child.sdtTaiXe || '0901234567',
          routeName: child.tenTuyen || 'Chưa có tuyến',
          lat: 10.762622,
          lng: 106.660172,
        }))

        setChildren(normalized)
      } else {
        setError('Không tìm thấy thông tin phụ huynh')
      }
    } catch (err) {
      console.error('[ParentDashboard] Load error:', err)
      setError('Không thể tải dữ liệu. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const mapStatus = (backendStatus) => {
    switch (backendStatus) {
      case 'boarding':
      case 'on_bus':
        return 'onboard'
      case 'arrived':
        return 'arrived'
      default:
        return 'missing_bus'
    }
  }

  // --- GIAO DIỆN ĐÃ ĐƯỢC LÀM GỌN ĐỂ CHẠY TRONG LAYOUT ---
  return (
    <Box sx={{ maxWidth: '800px', margin: '0 auto', color: '#fff' }}>
      
      {/* BỎ HEADER GIẢ VÌ LAYOUT ĐÃ CÓ HEADER RỒI */}

      <p className="greeting">
        Xin chào, {user?.detail?.hoTen || 'Phụ huynh'}
      </p>

      <Typography sx={{ fontSize: '1.1rem', fontWeight: 600, mb: 3, color: '#94a3b8' }}>
        Danh sách học sinh
      </Typography>

      {loading && (
        <Box textAlign="center" py={6}>
          <CircularProgress size={36} sx={{ color: '#666' }} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && children.length === 0 && (
        <Box className="card" textAlign="center" py={6} sx={{ bgcolor: '#111', borderRadius: 2, p: 3, border: '1px solid #333' }}>
          <Typography color="#94a3b8">
            Chưa có thông tin học sinh được liên kết
          </Typography>
        </Box>
      )}

      {children.map((child, index) => (
        <StudentCard
          key={child.id}
          student={child}
          isInitiallyExpanded={index === 0}
        />
      ))}

      <Box sx={{ height: 40 }} />
    </Box>
  )
}

export default ParentDashboard