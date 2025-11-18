import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
  Grid,
  Alert,
  Switch,
  FormControlLabel,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import WarningIcon from '@mui/icons-material/Warning'
import GpsFixedIcon from '@mui/icons-material/GpsFixed'
import { scheduleService, studentService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import useRealTimeTracking from '../hooks/useRealTimeTracking'
import MapComponent from '../components/MapComponent'

const DriverDashboard = () => {
  const { user } = useAuth()
  const [schedule, setSchedule] = useState(null)
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({})
  const [tripStarted, setTripStarted] = useState(false)
  const [gpsSimulation, setGpsSimulation] = useState(false)
  const [currentLocation, setCurrentLocation] = useState({ lat: 10.762622, lng: 106.660172 })
  const { connected, updateLocation } = useRealTimeTracking()

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (gpsSimulation && tripStarted) {
      const interval = setInterval(() => {
        setCurrentLocation(prev => {
          const newLat = prev.lat + (Math.random() - 0.5) * 0.001
          const newLng = prev.lng + (Math.random() - 0.5) * 0.001
          const speed = Math.floor(Math.random() * 50) + 20
          const heading = Math.floor(Math.random() * 360)
          
          updateLocation(1, newLat, newLng, speed, heading)
          
          return { lat: newLat, lng: newLng }
        })
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [gpsSimulation, tripStarted, updateLocation])

  const loadData = async () => {
    try {
      const studentRes = await studentService.getAll()
      const studentsData = Array.isArray(studentRes.data) ? studentRes.data : (studentRes.data?.data || [])
      setStudents(studentsData.slice(0, 8))
      
      const initialAttendance = {}
      studentsData.slice(0, 8).forEach(student => {
        initialAttendance[student.idHocSinh] = 'pending'
      })
      setAttendance(initialAttendance)
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  }

  const handleMarkAttendance = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }))
  }

  const handleStartTrip = () => {
    setTripStarted(true)
    setGpsSimulation(true)
  }

  const handleReportIncident = () => {
    alert('Chức năng báo cáo sự cố đang được phát triển')
  }

  const attendanceStats = {
    present: Object.values(attendance).filter(s => s === 'present').length,
    absent: Object.values(attendance).filter(s => s === 'absent').length,
    pending: Object.values(attendance).filter(s => s === 'pending').length,
  }

  return (
    <Box sx={{ color: '#ffffff' }}>
      <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
        Xin chào, {user?.detail?.hoTen || 'Tài xế'}
      </Typography>
      <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
        Lịch làm việc hôm nay
      </Typography>

      {tripStarted && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Chuyến đi đã bắt đầu. Vui lòng điểm danh học sinh tại mỗi điểm đón.
          {connected && <Chip label="GPS TRACKING" color="success" size="small" sx={{ ml: 2 }} />}
        </Alert>
      )}

      <Card sx={{ bgcolor: '#111111', mb: 2, border: '1px solid #1e293b' }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: '#ffffff', mb: 2, fontWeight: 600 }}>
            Thông Tin Chuyến Xe
          </Typography>
          <List sx={{ p: 0 }}>
            <ListItem sx={{ px: 0 }}>
              <ListItemText 
                primary={<Typography sx={{ color: '#64748b', fontSize: '0.875rem' }}>Tuyến xe</Typography>}
                secondary={<Typography sx={{ color: '#ffffff', mt: 0.5 }}>Tuyến 1: Quận 1 - Quận 3</Typography>}
              />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemText 
                primary={<Typography sx={{ color: '#64748b', fontSize: '0.875rem' }}>Biển số xe</Typography>}
                secondary={<Typography sx={{ color: '#ffffff', mt: 0.5 }}>51A-12345</Typography>}
              />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemText 
                primary={<Typography sx={{ color: '#64748b', fontSize: '0.875rem' }}>Giờ xuất phát</Typography>}
                secondary={<Typography sx={{ color: '#ffffff', mt: 0.5 }}>07:00 AM</Typography>}
              />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemText 
                primary={<Typography sx={{ color: '#64748b', fontSize: '0.875rem' }}>GPS Tracking</Typography>}
                secondary={
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={gpsSimulation} 
                        onChange={(e) => setGpsSimulation(e.target.checked)}
                        disabled={!tripStarted}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#00ff00',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#00ff00',
                          },
                        }}
                      />
                    }
                    label={<Typography sx={{ color: '#ffffff', fontSize: '0.875rem' }}>{gpsSimulation ? "Đang bật" : "Đã tắt"}</Typography>}
                  />
                }
              />
            </ListItem>
          </List>

          <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip 
              label={`Đã đón: ${attendanceStats.present}`} 
              sx={{ bgcolor: '#00ff00', color: '#000000', fontWeight: 600 }}
            />
            <Chip 
              label={`Vắng: ${attendanceStats.absent}`} 
              sx={{ bgcolor: '#ff0000', color: '#ffffff', fontWeight: 600 }}
            />
            <Chip 
              label={`Chờ: ${attendanceStats.pending}`} 
              sx={{ bgcolor: '#1e293b', color: '#ffffff', fontWeight: 600 }}
            />
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ bgcolor: '#111111', mb: 2, border: '1px solid #1e293b' }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: '#ffffff', mb: 2, fontWeight: 600 }}>
            Danh Sách Học Sinh Cần Đón
          </Typography>
          <List sx={{ p: 0 }}>
            {students.map((student) => (
              <ListItem
                key={student.idHocSinh}
                sx={{
                  bgcolor: attendance[student.idHocSinh] === 'present' 
                    ? 'rgba(0, 255, 0, 0.1)' 
                    : attendance[student.idHocSinh] === 'absent'
                    ? 'rgba(255, 0, 0, 0.1)'
                    : 'transparent',
                  mb: 1,
                  borderRadius: 1,
                  border: '1px solid #1e293b',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  px: 2,
                  py: 1.5
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Box>
                    <Typography sx={{ color: '#ffffff', fontWeight: 600, mb: 0.5 }}>
                      {student.hoTen}
                    </Typography>
                    <Typography sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                      Lớp {student.lop}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant={attendance[student.idHocSinh] === 'present' ? 'contained' : 'outlined'}
                    size="small"
                    fullWidth
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleMarkAttendance(student.idHocSinh, 'present')}
                    disabled={!tripStarted}
                    sx={{
                      bgcolor: attendance[student.idHocSinh] === 'present' ? '#00ff00' : 'transparent',
                      color: attendance[student.idHocSinh] === 'present' ? '#000000' : '#00ff00',
                      borderColor: '#00ff00',
                      '&:hover': {
                        bgcolor: attendance[student.idHocSinh] === 'present' ? '#00cc00' : 'rgba(0, 255, 0, 0.1)',
                      }
                    }}
                  >
                    Có mặt
                  </Button>
                  <Button
                    variant={attendance[student.idHocSinh] === 'absent' ? 'contained' : 'outlined'}
                    size="small"
                    fullWidth
                    startIcon={<CancelIcon />}
                    onClick={() => handleMarkAttendance(student.idHocSinh, 'absent')}
                    disabled={!tripStarted}
                    sx={{
                      bgcolor: attendance[student.idHocSinh] === 'absent' ? '#ff0000' : 'transparent',
                      color: attendance[student.idHocSinh] === 'absent' ? '#ffffff' : '#ff0000',
                      borderColor: '#ff0000',
                      '&:hover': {
                        bgcolor: attendance[student.idHocSinh] === 'absent' ? '#cc0000' : 'rgba(255, 0, 0, 0.1)',
                      }
                    }}
                  >
                    Vắng
                  </Button>
                </Box>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {tripStarted && (
        <Card sx={{ bgcolor: '#111111', mb: 2, border: '1px solid #1e293b' }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: '#ffffff', mb: 2, fontWeight: 600 }}>
              Vị Trí Hiện Tại
            </Typography>
            <MapComponent 
              center={[currentLocation.lat, currentLocation.lng]}
              buses={[
                {
                  idXeBus: 1,
                  bienSo: '51A-12345',
                  position: [currentLocation.lat, currentLocation.lng]
                }
              ]}
            />
          </CardContent>
        </Card>
      )}

      <Card sx={{ bgcolor: '#111111', border: '1px solid #1e293b' }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: '#ffffff', mb: 2, fontWeight: 600 }}>
            Hành Động
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button 
              variant="contained" 
              fullWidth
              disabled={tripStarted}
              onClick={handleStartTrip}
              startIcon={<GpsFixedIcon />}
              sx={{
                bgcolor: tripStarted ? '#1e293b' : '#00ff00',
                color: tripStarted ? '#64748b' : '#000000',
                fontWeight: 600,
                py: 1.5,
                '&:hover': {
                  bgcolor: tripStarted ? '#1e293b' : '#00cc00',
                }
              }}
            >
              {tripStarted ? 'Chuyến đi đang diễn ra' : 'Bắt đầu chuyến đi'}
            </Button>
            <Button 
              variant="outlined" 
              fullWidth
              startIcon={<WarningIcon />}
              onClick={handleReportIncident}
              sx={{
                borderColor: '#ff0000',
                color: '#ff0000',
                fontWeight: 600,
                py: 1.5,
                '&:hover': {
                  bgcolor: 'rgba(255, 0, 0, 0.1)',
                  borderColor: '#ff0000',
                }
              }}
            >
              Báo cáo sự cố
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default DriverDashboard
