import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Box,
} from '@mui/material'

const StudentDialog = ({ open, student, routes, parents, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    hoTen: '',
    lop: '',
    idTuyen: '',
    diemDon: '',
    trangThai: 'Hoat dong',
    parentIds: [],
  })

  useEffect(() => {
    if (student) {
      setFormData({
        hoTen: student.hoTen || '',
        lop: student.lop || '',
        idTuyen: student.idTuyen || student.idTuyenXe || '', // Try both field names
        diemDon: student.diemDon || '',
        trangThai: student.trangThai === 1 ? 'Hoat dong' : 'Nghi hoc',
        parentIds: student.parentIds || [],
      })
    } else {
      setFormData({
        hoTen: '',
        lop: '',
        idTuyen: '',
        diemDon: '',
        trangThai: 'Hoat dong',
        parentIds: [],
      })
    }
  }, [student, open])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = () => {
    const submitData = {
      ...formData,
      idTuyen: formData.idTuyen ? parseInt(formData.idTuyen) : null,
      diemDon: formData.diemDon ? parseInt(formData.diemDon) : null,
      trangThai: formData.trangThai === 'Hoat dong' ? 1 : 0,
      parentIds: formData.parentIds,
    };
    
    onSave(submitData);
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{student ? 'Chỉnh sửa học sinh' : 'Thêm học sinh mới'}</DialogTitle>
      <DialogContent>
        <TextField
          name="hoTen"
          label="Họ tên"
          fullWidth
          margin="normal"
          value={formData.hoTen}
          onChange={handleChange}
          required
        />
        <TextField
          name="lop"
          label="Lớp"
          fullWidth
          margin="normal"
          value={formData.lop}
          onChange={handleChange}
          required
        />
        <TextField
          name="idTuyen"
          label="Tuyến xe"
          select
          fullWidth
          margin="normal"
          value={formData.idTuyen}
          onChange={handleChange}
        >
          <MenuItem value="">-- Chọn tuyến xe --</MenuItem>
          {routes.map((route) => (
            <MenuItem key={route.idTuyen} value={route.idTuyen}>
              {route.tenTuyen}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          name="diemDon"
          label="Điểm đón"
          fullWidth
          margin="normal"
          value={formData.diemDon}
          onChange={handleChange}
        />
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Phụ huynh</InputLabel>
          <Select
            name="parentIds"
            multiple
            value={formData.parentIds}
            onChange={handleChange}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => {
                  const parent = parents.find(p => p.idPhuHuynh === value);
                  return (
                    <Chip key={value} label={parent?.hoTen || `ID: ${value}`} size="small" />
                  );
                })}
              </Box>
            )}
          >
            {parents && parents.map((parent) => (
              <MenuItem key={parent.idPhuHuynh} value={parent.idPhuHuynh}>
                {parent.hoTen} - {parent.soDienThoai || 'N/A'}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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
          <MenuItem value="Nghi hoc">Nghỉ học</MenuItem>
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

export default StudentDialog
