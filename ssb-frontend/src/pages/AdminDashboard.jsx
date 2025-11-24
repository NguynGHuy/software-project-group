"use client"

import { useState, useEffect } from "react"
import { Box, Grid, Card, CardContent, Typography, CircularProgress, Chip } from "@mui/material"
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus"
import PersonIcon from "@mui/icons-material/Person"
import RouteIcon from "@mui/icons-material/Route"
import ScheduleIcon from "@mui/icons-material/Schedule"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"
import { busService, studentService, routeService, scheduleService } from "../services/api"
import MapComponent from "../components/MapComponent"
import BusDialog from "../components/BusDialog"
import useRealTimeTracking from "../hooks/useRealTimeTracking"

const AdminDashboard = () => {
  const [buses, setBuses] = useState([])
  const [students, setStudents] = useState([])
  const [routes, setRoutes] = useState([])
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)

  const [busDialogOpen, setBusDialogOpen] = useState(false)
  const [selectedBus, setSelectedBus] = useState(null)

  // Use real-time tracking
  const { busLocations, connected } = useRealTimeTracking()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [busRes, studentRes, routeRes, scheduleRes] = await Promise.all([
        busService.getAll(),
        studentService.getAll(),
        routeService.getAll(),
        scheduleService ? scheduleService.getAll() : Promise.resolve({ data: [] }),
      ])

      const busData = Array.isArray(busRes.data) ? busRes.data : busRes.data?.data || []
      const studentData = Array.isArray(studentRes.data) ? studentRes.data : studentRes.data?.data || []
      const routeData = Array.isArray(routeRes.data) ? routeRes.data : routeRes.data?.data || []
      const scheduleData = Array.isArray(scheduleRes.data) ? scheduleRes.data : scheduleRes.data?.data || []

      setBuses(busData)
      setStudents(studentData)
      setRoutes(routeData)
      setSchedules(scheduleData)
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusLabel = (status) => {
    const s = Number(status)
    if (s === 1 || status === "Hoạt động" || status === "active") {
      return { text: "Hoạt động", className: "chip-active" }
    }
    return { text: "Bảo trì", className: "chip-inactive" }
  }

  const stats = [
    {
      title: "Tổng số xe bus",
      value: buses.length,
      icon: <DirectionsBusIcon />,
      color: "#3b82f6",
      bg: "rgba(59, 130, 246, 0.1)",
    },
    {
      title: "Tổng số học sinh",
      value: students.length,
      icon: <PersonIcon />,
      color: "#22c55e",
      bg: "rgba(34, 197, 94, 0.1)",
    },
    {
      title: "Tổng số tuyến",
      value: routes.length,
      icon: <RouteIcon />,
      color: "#f59e0b",
      bg: "rgba(245, 158, 11, 0.1)",
    },
    {
      title: "Tổng lịch trình",
      value: schedules.length,
      icon: <ScheduleIcon />,
      color: "#ec4899",
      bg: "rgba(236, 72, 153, 0.1)",
    },
  ]

  const handleAddBus = () => {
    setSelectedBus(null)
    setBusDialogOpen(true)
  }

  const handleEditBus = (bus) => {
    setSelectedBus(bus)
    setBusDialogOpen(true)
  }

  // Create bus markers with real-time locations
  const busMarkers = buses
    .map((bus) => {
      const location = busLocations[bus.idXe] || busLocations[bus.idXeBus]
      if (location) {
        return {
          idXeBus: bus.idXe || bus.idXeBus,
          bienSo: bus.bienSo,
          position: [location.latitude, location.longitude],
          status: "moving",
        }
      }
      return null
    })
    .filter(Boolean)

  return (
    <Box sx={{ p: 3 }}>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Tổng Quan Hệ Thống</h1>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Báo cáo nhanh tình hình hoạt động
          </Typography>
        </div>
        {connected && <Chip label="REAL-TIME SYNC" color="success" size="small" sx={{ fontWeight: 600 }} />}
      </div>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <div
                  style={{
                    backgroundColor: "#1e293b",
                    padding: "24px",
                    borderRadius: "16px",
                    border: "1px solid #334155",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography color="text.secondary" gutterBottom sx={{ fontSize: "0.875rem", fontWeight: 600 }}>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: "#f8fafc" }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <div
                    style={{
                      backgroundColor: stat.bg,
                      color: stat.color,
                      padding: "12px",
                      borderRadius: "12px",
                      display: "flex",
                    }}
                  >
                    {stat.icon}
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>

          <div className="admin-map-container" style={{ marginBottom: "30px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <h2 className="admin-page-title" style={{ fontSize: "1.25rem", margin: 0 }}>
                Vị trí trực tuyến
              </h2>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                {busMarkers.length} / {buses.length} xe đang hoạt động
              </Typography>
            </Box>
            <Box sx={{ height: "500px", borderRadius: "12px", overflow: "hidden", border: "1px solid #334155" }}>
              <MapComponent buses={busMarkers} height="500px" />
            </Box>
          </div>

          <Card sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
            <CardContent sx={{ p: 0 }}>
              <div className="admin-page-header" style={{ marginBottom: "16px" }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#f1f5f9" }}>
                  Danh sách xe Bus (5 xe mới nhất)
                </Typography>
                <button className="admin-btn-add" onClick={handleAddBus}>
                  <AddIcon sx={{ fontSize: 20 }} />
                  Thêm xe mới
                </button>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Biển số</th>
                      <th>Sức chứa</th>
                      <th>Trạng thái</th>
                      <th style={{ textAlign: "right" }}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buses.slice(0, 5).map((bus, index) => {
                      const statusInfo = getStatusLabel(bus.trangThai)
                      const isTracking = busLocations[bus.idXe] || busLocations[bus.idXeBus]
                      return (
                        <tr key={bus.idXeBus || bus.id || index}>
                          <td style={{ fontWeight: 600 }}>
                            {bus.bienSo}
                            {isTracking && (
                              <Chip
                                label="LIVE"
                                size="small"
                                sx={{
                                  ml: 1,
                                  height: 20,
                                  bgcolor: "#22c55e",
                                  color: "#000",
                                  fontWeight: 600,
                                  fontSize: "0.65rem",
                                }}
                              />
                            )}
                          </td>
                          <td>{bus.sucChua} người</td>
                          <td>
                            <span className={statusInfo.className}>{statusInfo.text}</span>
                          </td>
                          <td>
                            <div className="admin-action-btns" style={{ justifyContent: "flex-end" }}>
                              <button className="admin-btn-edit" onClick={() => handleEditBus(bus)}>
                                <EditIcon sx={{ fontSize: 16 }} /> Sửa
                              </button>
                              <button className="admin-btn-delete">
                                <DeleteIcon sx={{ fontSize: 16 }} /> Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                    {buses.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ textAlign: "center", padding: "20px", color: "#94a3b8" }}>
                          Chưa có dữ liệu.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {BusDialog && (
        <BusDialog
          open={busDialogOpen}
          bus={selectedBus}
          onClose={() => setBusDialogOpen(false)}
          onSave={() => {
            setBusDialogOpen(false)
            loadData()
          }}
        />
      )}
    </Box>
  )
}

export default AdminDashboard
