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

const BusDialog = ({ open, bus, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    bienSo: '',
    sucChua: '',
    trangThai: 'Hoat dong',
  })

  useEffect(() => {
    if (bus) {
      setFormData({
        bienSo: bus.bienSo || '',
        sucChua: bus.sucChua || '',
        trangThai: bus.trangThai || 'Hoat dong',
      })
    } else {
      setFormData({
        bienSo: '',
        sucChua: '',
        trangThai: 'Hoat dong',
      })
    }
  }, [bus, open])

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
      <DialogTitle>{bus ? 'Chỉnh sửa xe bus' : 'Thêm xe bus mới'}</DialogTitle>
      <DialogContent>
        <TextField
          name="bienSo"
          label="Biển số xe"
          fullWidth
          margin="normal"
          value={formData.bienSo}
          onChange={handleChange}
          required
        />
        <TextField
          name="sucChua"
          label="Sức chứa"
          type="number"
          fullWidth
          margin="normal"
          value={formData.sucChua}
          onChange={handleChange}
          required
        />
        <TextField
          name="trangThai"
          label="Trạng thái"
          select
          fullWidth
          margin="normal"
          value={formData.trangThai}
          onChange={handleChange}
        >
          <MenuItem value="Hoat dong">Hoạt động</MenuItem>
          <MenuItem value="Bao tri">Bảo trì</MenuItem>
          <MenuItem value="Ngung hoat dong">Ngừng hoạt động</MenuItem>
        </TextField>
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

export default BusDialog
