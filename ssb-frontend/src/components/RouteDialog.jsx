import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from '@mui/material'

const RouteDialog = ({ open, route, buses, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    tenTuyen: '',
    idXeBus: '',
    gioBatDau: '',
    gioKetThuc: '',
  })

  useEffect(() => {
    if (route) {
      setFormData({
        tenTuyen: route.tenTuyen || '',
        idXeBus: route.idXeBus || '',
        gioBatDau: route.gioBatDau || '',
        gioKetThuc: route.gioKetThuc || '',
      })
    } else {
      setFormData({
        tenTuyen: '',
        idXeBus: '',
        gioBatDau: '',
        gioKetThuc: '',
      })
    }
  }, [route, open])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = () => {
    onSave(formData)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{route ? 'Chỉnh sửa tuyến đường' : 'Thêm tuyến đường mới'}</DialogTitle>
      <DialogContent>
        <TextField
          name="tenTuyen"
          label="Tên tuyến"
          fullWidth
          margin="normal"
          value={formData.tenTuyen}
          onChange={handleChange}
          required
        />
        <TextField
          name="idXeBus"
          label="Xe bus"
          select
          fullWidth
          margin="normal"
          value={formData.idXeBus}
          onChange={handleChange}
        >
          <MenuItem value="">-- Chọn xe bus --</MenuItem>
          {buses.map((bus) => (
            <MenuItem key={bus.idXeBus} value={bus.idXeBus}>
              {bus.bienSo}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          name="gioBatDau"
          label="Thời gian bắt đầu"
          type="time"
          fullWidth
          margin="normal"
          value={formData.gioBatDau}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          name="gioKetThuc"
          label="Thời gian kết thúc"
          type="time"
          fullWidth
          margin="normal"
          value={formData.gioKetThuc}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RouteDialog
