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
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import WarningIcon from '@mui/icons-material/Warning'
import { scheduleService, studentService } from '../services/api'
import { useAuth } from '../context/AuthContext'

const DriverDashboard = () => {
  const { user } = useAuth()
  const [schedule, setSchedule] = useState(null)
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({})
  const [tripStarted, setTripStarted] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

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
    <Box>
      <Typography variant="h4" gutterBottom>
        Lịch Làm Việc Hôm Nay
      </Typography>

      {tripStarted && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Chuyến đi đã bắt đầu. Vui lòng điểm danh học sinh tại mỗi điểm đón.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Thông Tin Chuyến Xe
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Tuyến xe" secondary="Tuyến 1: Quận 1 - Quận 3" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Biển số xe" secondary="51A-12345" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Giờ xuất phát" secondary="07:00 AM" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Giờ kết thúc" secondary="08:30 AM" />
                </ListItem>
              </List>

              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Chip 
                  label={`Đã đón: ${attendanceStats.present}`} 
                  color="success" 
                />
                <Chip 
                  label={`Vắng: ${attendanceStats.absent}`} 
                  color="error" 
                />
                <Chip 
                  label={`Chờ: ${attendanceStats.pending}`} 
                  color="default" 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Danh Sách Học Sinh Cần Đón
              </Typography>
              <List>
                {students.map((student) => (
                  <ListItem
                    key={student.idHocSinh}
                    sx={{
                      bgcolor: attendance[student.idHocSinh] === 'present' 
                        ? 'success.light' 
                        : attendance[student.idHocSinh] === 'absent'
                        ? 'error.light'
                        : 'inherit',
                      mb: 1,
                      borderRadius: 1,
                    }}
                  >
                    <ListItemText
                      primary={student.hoTen}
                      secondary={`Lớp ${student.lop} - ${student.diemDon}`}
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant={attendance[student.idHocSinh] === 'present' ? 'contained' : 'outlined'}
                        size="small"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleMarkAttendance(student.idHocSinh, 'present')}
                        disabled={!tripStarted}
                      >
                        Có mặt
                      </Button>
                      <Button
                        variant={attendance[student.idHocSinh] === 'absent' ? 'contained' : 'outlined'}
                        size="small"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => handleMarkAttendance(student.idHocSinh, 'absent')}
                        disabled={!tripStarted}
                      >
                        Vắng
                      </Button>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Hành Động
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              color="success"
              disabled={tripStarted}
              onClick={handleStartTrip}
            >
              {tripStarted ? 'Chuyến đi đang diễn ra' : 'Bắt đầu chuyến đi'}
            </Button>
            <Button 
              variant="outlined" 
              color="error"
              startIcon={<WarningIcon />}
              onClick={handleReportIncident}
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
