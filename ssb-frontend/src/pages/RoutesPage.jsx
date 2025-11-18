import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import { routeService, busService } from '../services/api'
import RouteDialog from '../components/RouteDialog'

const RoutesPage = () => {
  const [routes, setRoutes] = useState([])
  const [buses, setBuses] = useState([])
  const [filteredRoutes, setFilteredRoutes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = routes.filter(route =>
        route.tenTuyen.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredRoutes(filtered)
    } else {
      setFilteredRoutes(routes)
    }
  }, [searchTerm, routes])

  const loadData = async () => {
    try {
      const [routeRes, busRes] = await Promise.all([
        routeService.getAll(),
        busService.getAll(),
      ])
      
      const routesData = Array.isArray(routeRes.data) ? routeRes.data : (routeRes.data?.data || [])
      const busesData = Array.isArray(busRes.data) ? busRes.data : (busRes.data?.data || [])
      
      setRoutes(routesData)
      setBuses(busesData)
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  }

  const handleAdd = () => {
    setSelectedRoute(null)
    setDialogOpen(true)
  }

  const handleEdit = (route) => {
    setSelectedRoute(route)
    setDialogOpen(true)
  }

  const handleDelete = async (id) => {
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

  const handleSave = async (routeData) => {
    try {
      if (selectedRoute) {
        await routeService.update(selectedRoute.idTuyen, routeData)
      } else {
        await routeService.create(routeData)
      }
      setDialogOpen(false)
      loadData()
    } catch (error) {
      console.error('Failed to save route:', error)
      alert('Không thể lưu thông tin tuyến đường')
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Quản Lý Tuyến Đường</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Thêm tuyến
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Tìm kiếm tuyến đường..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Tên tuyến</TableCell>
                  <TableCell>Xe bus</TableCell>
                  <TableCell>Thời gian bắt đầu</TableCell>
                  <TableCell>Thời gian kết thúc</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRoutes.map((route) => (
                  <TableRow key={route.idTuyen}>
                    <TableCell>{route.idTuyen}</TableCell>
                    <TableCell>{route.tenTuyen}</TableCell>
                    <TableCell>{route.bienSo || 'Chưa phân công'}</TableCell>
                    <TableCell>{route.gioBatDau}</TableCell>
                    <TableCell>{route.gioKetThuc}</TableCell>
                    <TableCell>
                      <Button 
                        size="small" 
                        startIcon={<EditIcon />} 
                        onClick={() => handleEdit(route)}
                      >
                        Sửa
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(route.idTuyen)}
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

      <RouteDialog
        open={dialogOpen}
        route={selectedRoute}
        buses={buses}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
      />
    </Box>
  )
}

export default RoutesPage
