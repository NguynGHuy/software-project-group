import { useState, useEffect } from 'react'
import { Box, Card, CardContent, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { busService } from '../services/api'
import BusDialog from '../components/BusDialog'

const BusesPage = () => {
  const [buses, setBuses] = useState([])
  const [filteredBuses, setFilteredBuses] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedBus, setSelectedBus] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = buses.filter(bus =>
        bus.bienSo.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredBuses(filtered)
    } else {
      setFilteredBuses(buses)
    }
  }, [searchTerm, buses])

  const loadData = async () => {
    try {
      const response = await busService.getAll()
      const busesData = Array.isArray(response.data) ? response.data : (response.data?.data || [])
      setBuses(busesData)
    } catch (error) {
      console.error('Failed to load buses:', error)
    }
  }

  const handleAdd = () => {
    setSelectedBus(null)
    setDialogOpen(true)
  }

  const handleEdit = (bus) => {
    setSelectedBus(bus)
    setDialogOpen(true)
  }

  const handleDelete = async (id) => {
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

  const handleSave = async (busData) => {
    try {
      if (selectedBus) {
        await busService.update(selectedBus.idXeBus, busData)
      } else {
        await busService.create(busData)
      }
      setDialogOpen(false)
      loadData()
    } catch (error) {
      console.error('Failed to save bus:', error)
      alert('Không thể lưu thông tin xe bus')
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Quản Lý Xe Buýt</h1>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Quản lý thông tin xe buýt và trạng thái hoạt động
          </Typography>
        </div>
        <button className="admin-btn-add" onClick={handleAdd}>
          <AddIcon sx={{ fontSize: 20 }} />
          Thêm xe buýt
        </button>
      </div>

      <Card sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
        <CardContent sx={{ p: 0 }}>
          <input
            type="text"
            className="admin-search-input"
            placeholder="Tìm kiếm theo biển số xe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: '20px' }}
          />

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Biển số</th>
                  <th>Sức chứa</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredBuses.map((bus) => (
                  <tr key={bus.idXeBus}>
                    <td>{bus.idXeBus}</td>
                    <td style={{ fontWeight: 600 }}>{bus.bienSo}</td>
                    <td>{bus.sucChua} người</td>
                    <td>
                      <span className={bus.trangThai === 'Hoat dong' ? 'chip-active' : 'chip-inactive'}>
                        {bus.trangThai}
                      </span>
                    </td>
                    <td>
                      <div className="admin-action-btns">
                        <button className="admin-btn-edit" onClick={() => handleEdit(bus)}>
                          <EditIcon sx={{ fontSize: 16 }} />
                          Sửa
                        </button>
                        <button className="admin-btn-delete" onClick={() => handleDelete(bus.idXeBus)}>
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

      <BusDialog
        open={dialogOpen}
        bus={selectedBus}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
      />
    </Box>
  )
}

export default BusesPage
