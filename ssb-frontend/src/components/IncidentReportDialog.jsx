"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from "@mui/material"
import { incidentService } from "../services/api"

const IncidentReportDialog = ({ open, onClose, driverId, scheduleId, currentLocation }) => {
  const [formData, setFormData] = useState({
    loaiSuCo: "",
    moTa: "",
    viTri: "",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setFormData({
        loaiSuCo: "",
        moTa: "",
        viTri: currentLocation?.address || "",
      })
    }
  }, [open, currentLocation])

  const incidentTypes = [
    { value: "XE_HU", label: "Xe hư hỏng" },
    { value: "TAI_NAN", label: "Tai nạn giao thông" },
    { value: "HOCSINH_VANG", label: "Học sinh vắng mặt" },
    { value: "TRE_GIO", label: "Trễ giờ" },
    { value: "KHAC", label: "Khác" },
  ]

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!formData.loaiSuCo || !formData.moTa) {
      alert("Vui lòng điền đầy đủ thông tin")
      return
    }

    setLoading(true)
    try {
      const data = {
        idTaiXe: driverId,
        idLichTrinh: scheduleId || null,
        loaiSuCo: formData.loaiSuCo,
        moTa: formData.moTa,
        viTri: formData.viTri,
        kinhDo: currentLocation?.lng || null,
        viDo: currentLocation?.lat || null,
      }

      const res = await incidentService.create(data)
      if (res.data.success) {
        alert("Báo cáo sự cố thành công!")
        onClose(true) // Pass true to indicate success
      }
    } catch (error) {
      console.error("Failed to report incident:", error)
      alert("Báo cáo sự cố thất bại: " + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "#1e293b",
          border: "1px solid #334155",
        },
      }}
    >
      <DialogTitle sx={{ color: "#f1f5f9", fontWeight: 600 }}>Báo cáo sự cố</DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: "#cbd5e1" }}>Loại sự cố</InputLabel>
            <Select
              value={formData.loaiSuCo}
              onChange={(e) => handleChange("loaiSuCo", e.target.value)}
              label="Loại sự cố"
              sx={{
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#475569" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#60a5fa" },
                "& .MuiSelect-select": { color: "#f1f5f9" },
              }}
            >
              {incidentTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Mô tả chi tiết"
            multiline
            rows={4}
            value={formData.moTa}
            onChange={(e) => handleChange("moTa", e.target.value)}
            fullWidth
            required
            InputLabelProps={{ sx: { color: "#cbd5e1" } }}
            InputProps={{
              sx: {
                color: "#f1f5f9",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#475569" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#60a5fa" },
              },
            }}
          />

          <TextField
            label="Vị trí"
            value={formData.viTri}
            onChange={(e) => handleChange("viTri", e.target.value)}
            fullWidth
            InputLabelProps={{ sx: { color: "#cbd5e1" } }}
            InputProps={{
              sx: {
                color: "#f1f5f9",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#475569" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#60a5fa" },
              },
            }}
          />

          {currentLocation && (
            <Typography variant="caption" sx={{ color: "#94a3b8" }}>
              Tọa độ GPS: {currentLocation.lat?.toFixed(6)}, {currentLocation.lng?.toFixed(6)}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={() => onClose(false)} sx={{ color: "#94a3b8", textTransform: "none" }} disabled={loading}>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            backgroundColor: "#3b82f6",
            textTransform: "none",
            "&:hover": { backgroundColor: "#2563eb" },
          }}
        >
          {loading ? "Đang gửi..." : "Gửi báo cáo"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default IncidentReportDialog
