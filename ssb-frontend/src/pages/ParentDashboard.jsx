"use client"

import { useState, useEffect } from "react"
import { Box, Typography, CircularProgress, Alert } from "@mui/material"
import { parentService, routeService } from "../services/api"
import { useAuth } from "../context/AuthContext"
import useRealTimeTracking from "../hooks/useRealTimeTracking"

import StudentCard from "../parent/components/StudentCard"

import "../styles/parent.css"

const ParentDashboard = () => {
  const { user } = useAuth()
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Use real-time tracking
  const { busLocations } = useRealTimeTracking()

  useEffect(() => {
    loadData()
  }, [user])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      if (user && user.detail?.idPhuHuynh) {
        const response = await parentService.getStudents(user.detail.idPhuHuynh)
        const childrenData = Array.isArray(response.data) ? response.data : response.data?.data || []

        const normalized = await Promise.all(
          childrenData.map(async (child) => {
            // Get route details with stops for pickup point coordinates
            let pickupLat = 10.88
            let pickupLng = 106.59

            if (child.idTuyen && child.diemDon) {
              try {
                const routeRes = await routeService.getDetails(child.idTuyen)
                if (routeRes.data.success) {
                  const stop = routeRes.data.data.stops.find((s) => s.idDiemDung === child.diemDon)
                  if (stop) {
                    pickupLat = stop.viDo
                    pickupLng = stop.kinhDo
                  }
                }
              } catch (err) {
                console.error("[v0] Error loading route details:", err)
              }
            }

            return {
              id: child.idHocSinh,
              name: child.hoTen,
              className: child.lop,
              status: mapStatus(child.status),
              busId: child.idXeBus,
              busName: child.xeBus || "Chưa phân công xe",
              pickupPoint: child.tenDiemDon || "Chưa có",
              pickupTime: child.gioBatDau?.substring(0, 5) || "07:15",
              pickupLat,
              pickupLng,
              driver: child.tenTaiXe || "Chưa có",
              driverPhone: child.sdtTaiXe || "0901234567",
              routeName: child.tenTuyen || "Chưa có tuyến",
            }
          }),
        )

        setChildren(normalized)
      } else {
        setError("Không tìm thấy thông tin phụ huynh")
      }
    } catch (err) {
      console.error("[ParentDashboard] Load error:", err)
      setError("Không thể tải dữ liệu. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  const mapStatus = (backendStatus) => {
    switch (backendStatus) {
      case "boarding":
      case "on_bus":
        return "onboard"
      case "arrived":
        return "arrived"
      default:
        return "missing_bus"
    }
  }

  return (
    <div className="parent-app">
      <Box sx={{ maxWidth: "650px", margin: "0 auto" }}>
        <p className="greeting">Xin chào, {user?.detail?.hoTen || "Phụ huynh"}</p>

        <Typography sx={{ fontSize: "16px", fontWeight: 600, mb: 3, color: "#fff" }}>Con của bạn</Typography>

        {loading && (
          <Box textAlign="center" py={6}>
            <CircularProgress size={36} sx={{ color: "#666" }} />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && children.length === 0 && (
          <Box className="card" textAlign="center" py={6}>
            <Typography color="#94a3b8">Chưa có thông tin học sinh được liên kết</Typography>
          </Box>
        )}

        {children.map((child, index) => (
          <StudentCard
            key={child.id}
            student={child}
            isInitiallyExpanded={index === 0}
            userId={user?.detail?.idPhuHuynh}
            userType="PHU_HUYNH"
          />
        ))}
      </Box>
    </div>
  )
}

export default ParentDashboard
