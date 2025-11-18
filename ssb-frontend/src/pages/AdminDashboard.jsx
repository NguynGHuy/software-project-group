import { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
} from '@mui/material'
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus'
import PersonIcon from '@mui/icons-material/Person'
import RouteIcon from '@mui/icons-material/Route'
import ScheduleIcon from '@mui/icons-material/Schedule'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { busService, studentService, routeService } from '../services/api'
import MapComponent from '../components/MapComponent'
import BusDialog from '../components/BusDialog'
import StudentDialog from '../components/StudentDialog'
import RouteDialog from '../components/RouteDialog'

const AdminDashboard = () => {
  const [buses, setBuses] = useState([])
  const [students, setStudents] = useState([])
  const [routes, setRoutes] = useState([])
  const [busDialogOpen, setBusDialogOpen] = useState(false)
  const [studentDialogOpen, setStudentDialogOpen] = useState(false)
  const [routeDialogOpen, setRouteDialogOpen] = useState(false)
  const [selectedBus, setSelectedBus] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [busRes, studentRes, routeRes] = await Promise.all([
        busService.getAll(),
        studentService.getAll(),
        routeService.getAll(),
      ])
      
      setBuses(Array.isArray(busRes.data) ? busRes.data : (busRes.data?.data || []))
      setStudents(Array.isArray(studentRes.data) ? studentRes.data : (studentRes.data?.data || []))
      setRoutes(Array.isArray(routeRes.data) ? routeRes.data : (routeRes.data?.data || []))
    } catch (error) {
      console.error('Failed to load data:', error)
      setBuses([])
      setStudents([])
      setRoutes([])
    }
  }

  const stats = [
    { title: 'Tổng số xe bus', value: buses.length, icon: <DirectionsBusIcon />, color: 'primary' },
    { title: 'Tổng số học sinh', value: students.length, icon: <PersonIcon />, color: 'success' },
    { title: 'Tổng số tuyến', value: routes.length, icon: <RouteIcon />, color: 'warning' },
    { title: 'Lịch trình hôm nay', value: 0, icon: <ScheduleIcon />, color: 'info' },
  ]

  // CRUD handlers for buses
  const handleAddBus = () => {
    setSelectedBus(null)
    setBusDialogOpen(true)
  }

  const handleEditBus = (bus) => {
    setSelectedBus(bus)
    setBusDialogOpen(true)
  }

  const handleDeleteBus = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa xe bus này?')) {
      try {
        await busService.delete(id)
        loadData()
      } catch (error) {
        console.error('Failed to delete bus:', error)
        alert('Không thể xóa xe bus')
      }
    }
  }

  const handleSaveBus = async (busData) => {
    try {
      if (selectedBus) {
        await busService.update(selectedBus.idXeBus, busData)
      } else {
        await busService.create(busData)
      }
      setBusDialogOpen(false)
      loadData()
    } catch (error) {
      console.error('Failed to save bus:', error)
      alert('Không thể lưu thông tin xe bus')
    }
  }

  // CRUD handlers for students
  const handleAddStudent = () => {
    setSelectedStudent(null)
    setStudentDialogOpen(true)
  }

  const handleEditStudent = (student) => {
    setSelectedStudent(student)
    setStudentDialogOpen(true)
  }

  const handleDeleteStudent = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa học sinh này?')) {
      try {
        await studentService.delete(id)
        loadData()
      } catch (error) {
        console.error('Failed to delete student:', error)
        alert('Không thể xóa học sinh')
      }
    }
  }

  const handleSaveStudent = async (studentData) => {
    try {
      if (selectedStudent) {
        await studentService.update(selectedStudent.idHocSinh, studentData)
      } else {
        await studentService.create(studentData)
      }
      setStudentDialogOpen(false)
      loadData()
    } catch (error) {
      console.error('Failed to save student:', error)
      alert('Không thể lưu thông tin học sinh')
    }
  }

  // CRUD handlers for routes
  const handleAddRoute = () => {
    setSelectedRoute(null)
    setRouteDialogOpen(true)
  }

  const handleEditRoute = (route) => {
    setSelectedRoute(route)
    setRouteDialogOpen(true)
  }

  const handleDeleteRoute = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa tuyến đường này?')) {
      try {
        await routeService.delete(id)
        loadData()
      } catch (error) {
        console.error('Failed to delete route:', error)
        alert('Không thể xóa tuyến đường')
      }
    }
  }

  const handleSaveRoute = async (routeData) => {
    try {
      if (selectedRoute) {
        await routeService.update(selectedRoute.idTuyen, routeData)
      } else {
        await routeService.create(routeData)
      }
      setRouteDialogOpen(false)
      loadData()
    } catch (error) {
      console.error('Failed to save route:', error)
      alert('Không thể lưu thông tin tuyến đường')
    }
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tổng Quan Hệ Thống
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4">{stat.value}</Typography>
                  </Box>
                  <Box
                    sx={{
                      bgcolor: `${stat.color}.main`,
                      color: 'white',
                      p: 1.5,
                      borderRadius: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Bản Đồ Vị Trí Xe Bus
          </Typography>
          <MapComponent buses={buses} />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Danh Sách Xe Bus</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddBus}>
              Thêm xe mới
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Biển số</TableCell>
                  <TableCell>Sức chứa</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {buses.slice(0, 5).map((bus) => (
                  <TableRow key={bus.idXeBus}>
                    <TableCell>{bus.bienSo}</TableCell>
                    <TableCell>{bus.sucChua} người</TableCell>
                    <TableCell>
                      <Chip
                        label={bus.trangThai}
                        color={bus.trangThai === 'Hoat dong' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button size="small" startIcon={<EditIcon />} onClick={() => handleEditBus(bus)}>
                        Sửa
                      </Button>
                      <Button 
                        size="small" 
                        color="error" 
                        startIcon={<DeleteIcon />} 
                        onClick={() => handleDeleteBus(bus.idXeBus)}
                      >
                        Xóa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog components */}
      <BusDialog
        open={busDialogOpen}
        bus={selectedBus}
        onClose={() => setBusDialogOpen(false)}
        onSave={handleSaveBus}
      />
      <StudentDialog
        open={studentDialogOpen}
        student={selectedStudent}
        routes={routes}
        onClose={() => setStudentDialogOpen(false)}
        onSave={handleSaveStudent}
      />
      <RouteDialog
        open={routeDialogOpen}
        route={selectedRoute}
        buses={buses}
        onClose={() => setRouteDialogOpen(false)}
        onSave={handleSaveRoute}
      />
    </Box>
  )
}

export default AdminDashboard
