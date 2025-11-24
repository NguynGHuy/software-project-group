"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material"
import { incidentService } from "../services/api"

const IncidentsPage = () => {
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedIncident, setSelectedIncident] = useState(null)
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [statusUpdate, setStatusUpdate] = useState({ trangThai: "", ghiChu: "" })

  useEffect(() => {
    loadIncidents()
  }, [])

  const loadIncidents = async () => {
    setLoading(true)
    try {
      const res = await incidentService.getAll()
      if (res.data.success) {
        setIncidents(res.data.data)
      }
    } catch (error) {
      console.error("Failed to load incidents:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateClick = (incident) => {
    setSelectedIncident(incident)
    setStatusUpdate({
      trangThai: incident.trangThai,
      ghiChu: incident.ghiChu || "",
    })
    setUpdateDialogOpen(true)
  }

  const handleUpdateStatus = async () => {
    try {
      const userStr = sessionStorage.getItem("user")
      const user = userStr ? JSON.parse(userStr) : null
      const adminId = user?.idQuanLy || 1

      const res = await incidentService.updateStatus(selectedIncident.idBaoCao, {
        ...statusUpdate,
        nguoiXuLy: adminId,
      })

      if (res.data.success) {
        alert("Cập nhật trạng thái thành công!")
        setUpdateDialogOpen(false)
        loadIncidents()
      }
    } catch (error) {
      console.error("Failed to update status:", error)
      alert("Cập nhật thất bại: " + (error.response?.data?.message || error.message))
    }
  }

  const getStatusChip = (status) => {
    const statusMap = {
      DANG_XU_LY: { label: "Đang xử lý", color: "warning" },
      DA_XU_LY: { label: "Đã xử lý", color: "success" },
      HUY: { label: "Đã hủy", color: "default" },
    }
    const config = statusMap[status] || { label: status, color: "default" }
    return <Chip label={config.label} color={config.color} size="small" />
  }

  const getIncidentTypeLabel = (type) => {
    const typeMap = {
      XE_HU: "Xe hư hỏng",
      TAI_NAN: "Tai nạn",
      HOCSINH_VANG: "Học sinh vắng",
      TRE_GIO: "Trễ giờ",
      KHAC: "Khác",
    }
    return typeMap[type] || type
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: "#f1f5f9" }}>
        Quản lý sự cố
      </Typography>

      <TableContainer component={Paper} sx={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#94a3b8", fontWeight: 600 }}>ID</TableCell>
              <TableCell sx={{ color: "#94a3b8", fontWeight: 600 }}>Tài xế</TableCell>
              <TableCell sx={{ color: "#94a3b8", fontWeight: 600 }}>Loại sự cố</TableCell>
              <TableCell sx={{ color: "#94a3b8", fontWeight: 600 }}>Mô tả</TableCell>
              <TableCell sx={{ color: "#94a3b8", fontWeight: 600 }}>Thời gian</TableCell>
              <TableCell sx={{ color: "#94a3b8", fontWeight: 600 }}>Trạng thái</TableCell>
              <TableCell sx={{ color: "#94a3b8", fontWeight: 600 }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {incidents.map((incident) => (
              <TableRow key={incident.idBaoCao}>
                <TableCell sx={{ color: "#f1f5f9" }}>{incident.idBaoCao}</TableCell>
                <TableCell sx={{ color: "#f1f5f9" }}>{incident.tenTaiXe}</TableCell>
                <TableCell sx={{ color: "#f1f5f9" }}>{getIncidentTypeLabel(incident.loaiSuCo)}</TableCell>
                <TableCell sx={{ color: "#cbd5e1", maxWidth: 200 }}>
                  {incident.moTa.length > 50 ? incident.moTa.substring(0, 50) + "..." : incident.moTa}
                </TableCell>
                <TableCell sx={{ color: "#cbd5e1" }}>{new Date(incident.thoiGian).toLocaleString("vi-VN")}</TableCell>
                <TableCell>{getStatusChip(incident.trangThai)}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleUpdateClick(incident)}
                    sx={{ textTransform: "none", borderColor: "#60a5fa", color: "#60a5fa" }}
                  >
                    Cập nhật
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {incidents.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: "center", py: 3, color: "#94a3b8" }}>
                  Không có báo cáo sự cố nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={updateDialogOpen}
        onClose={() => setUpdateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { backgroundColor: "#1e293b", border: "1px solid #334155" } }}
      >
        <DialogTitle sx={{ color: "#f1f5f9", fontWeight: 600 }}>Cập nhật trạng thái sự cố</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: "#cbd5e1" }}>Trạng thái</InputLabel>
              <Select
                value={statusUpdate.trangThai}
                onChange={(e) => setStatusUpdate((prev) => ({ ...prev, trangThai: e.target.value }))}
                label="Trạng thái"
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#475569" },
                  "& .MuiSelect-select": { color: "#f1f5f9" },
                }}
              >
                <MenuItem value="DANG_XU_LY">Đang xử lý</MenuItem>
                <MenuItem value="DA_XU_LY">Đã xử lý</MenuItem>
                <MenuItem value="HUY">Hủy</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Ghi chú"
              multiline
              rows={3}
              value={statusUpdate.ghiChu}
              onChange={(e) => setStatusUpdate((prev) => ({ ...prev, ghiChu: e.target.value }))}
              fullWidth
              InputLabelProps={{ sx: { color: "#cbd5e1" } }}
              InputProps={{
                sx: {
                  color: "#f1f5f9",
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#475569" },
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setUpdateDialogOpen(false)} sx={{ color: "#94a3b8", textTransform: "none" }}>
            Hủy
          </Button>
          <Button
            onClick={handleUpdateStatus}
            variant="contained"
            sx={{ backgroundColor: "#3b82f6", textTransform: "none" }}
          >
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default IncidentsPage
