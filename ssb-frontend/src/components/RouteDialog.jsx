"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from "@mui/material"

const RouteDialog = ({ open, onClose, onSave, route, buses = [], drivers = [] }) => {
  const [formData, setFormData] = useState({
    tenTuyen: "",
    gioBatDau: "",
    gioKetThuc: "",
    idXeBus: "",
    idTaiXe: "",
  })

  useEffect(() => {
    if (route) {
      setFormData({
        tenTuyen: route.tenTuyen || "",
        gioBatDau: route.gioBatDau || "",
        gioKetThuc: route.gioKetThuc || "",
        idXeBus: route.idXeBus !== null && route.idXeBus !== undefined ? String(route.idXeBus) : "",
        idTaiXe: route.idTaiXe !== null && route.idTaiXe !== undefined ? String(route.idTaiXe) : "",
      })
    } else {
      setFormData({
        tenTuyen: "",
        gioBatDau: "",
        gioKetThuc: "",
        idXeBus: "",
        idTaiXe: "",
      })
    }
  }, [route, open])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    const sanitizedData = {
      ...formData,
      idXeBus: formData.idXeBus && formData.idXeBus !== "" ? formData.idXeBus : null,
      idTaiXe: formData.idTaiXe && formData.idTaiXe !== "" ? formData.idTaiXe : null,
    }
    console.log("[v0] Submitting sanitized data:", sanitizedData)
    onSave(sanitizedData)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{route ? "Sửa tuyến xe" : "Thêm tuyến xe mới"}</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField label="Tên tuyến" name="tenTuyen" fullWidth value={formData.tenTuyen} onChange={handleChange} />

        <TextField
          select
          label="Xe Bus phụ trách"
          name="idXeBus"
          fullWidth
          value={formData.idXeBus}
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>Chưa chọn xe</em>
          </MenuItem>
          {Array.isArray(buses) && buses.length > 0 ? (
            buses.map((bus) => (
              <MenuItem key={bus.idXeBus} value={String(bus.idXeBus)}>
                {bus.bienSo} ({bus.sucChua} chỗ)
              </MenuItem>
            ))
          ) : (
            <MenuItem value="" disabled>
              <em>Không có xe bus nào</em>
            </MenuItem>
          )}
        </TextField>

        <TextField
          select
          label="Tài xế phụ trách"
          name="idTaiXe"
          fullWidth
          value={formData.idTaiXe}
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>Chưa chọn tài xế</em>
          </MenuItem>
          {Array.isArray(drivers) && drivers.length > 0 ? (
            drivers.map((driver) => (
              <MenuItem key={driver.idTaiXe} value={String(driver.idTaiXe)}>
                {driver.hoTen} - {driver.soDienThoai}
              </MenuItem>
            ))
          ) : (
            <MenuItem value="" disabled>
              <em>Không có tài xế nào</em>
            </MenuItem>
          )}
        </TextField>

        <div style={{ display: "flex", gap: 16 }}>
          <TextField
            label="Giờ bắt đầu (HH:mm)"
            name="gioBatDau"
            fullWidth
            value={formData.gioBatDau}
            onChange={handleChange}
            placeholder="06:00"
          />
          <TextField
            label="Giờ kết thúc (HH:mm)"
            name="gioKetThuc"
            fullWidth
            value={formData.gioKetThuc}
            onChange={handleChange}
            placeholder="18:00"
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RouteDialog
