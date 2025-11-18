import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material'
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { parentService } from '../services/api'
import { useAuth } from '../context/AuthContext'

// ĐÚNG ĐƯỜNG DẪN – StudentCard nằm trong src/components/
import StudentCard from "../parent/components/StudentCard"   // CHỈNH DÒNG NÀY LÀ XONG!

import '../styles/parent.css'

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
          // Dùng để giả lập vị trí xe (sau này thay bằng socket)
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

  return (
    <div className="parent-app">
      <Box sx={{ maxWidth: '650px', margin: '0 auto' }}>
        <p className="greeting">
          Xin chào, {user?.detail?.hoTen || 'Phụ huynh'}
        </p>

        <Typography sx={{ fontSize: '16px', fontWeight: 600, mb: 3, color: '#fff' }}>
          Con của bạn
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
          <Box className="card" textAlign="center" py={6}>
            <Typography color="#94a3b8">
              Chưa có thông tin học sinh được liên kết
            </Typography>
          </Box>
        )}

        {/* DANH SÁCH HỌC SINH – ĐÃ HOÀN HẢO */}
        {children.map((child, index) => (
          <StudentCard
            key={child.id}
            student={child}
            isInitiallyExpanded={index === 0}   // HS đầu tự mở
          />
        ))}
      </Box>
    </div>
  )
}

export default ParentDashboard