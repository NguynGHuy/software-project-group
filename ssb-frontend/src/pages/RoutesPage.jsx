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
    <Box sx={{ p: 3 }}>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Quản Lý Tuyến Đường</h1>
        <button className="admin-btn-add" onClick={handleAdd}>
          <AddIcon sx={{ fontSize: 20 }} />
          Thêm tuyến
        </button>
      </div>

      <Card sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
        <CardContent sx={{ p: 0 }}>
          <input
            type="text"
            className="admin-search-input"
            placeholder="Tìm kiếm tuyến đường..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: '20px' }}
          />

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên tuyến</th>
                  <th>Xe bus</th>
                  <th>Thời gian bắt đầu</th>
                  <th>Thời gian kết thúc</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoutes.map((route) => (
                  <tr key={route.idTuyen}>
                    <td>{route.idTuyen}</td>
                    <td>{route.tenTuyen}</td>
                    <td>{route.bienSo || 'Chưa phân công'}</td>
                    <td>{route.gioBatDau}</td>
                    <td>{route.gioKetThuc}</td>
                    <td>
                      <div className="admin-action-btns">
                        <button className="admin-btn-edit" onClick={() => handleEdit(route)}>
                          <EditIcon sx={{ fontSize: 16 }} />
                          Sửa
                        </button>
                        <button className="admin-btn-delete" onClick={() => handleDelete(route.idTuyen)}>
                          <DeleteIcon sx={{ fontSize: 16 }} />
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
