import React from 'react';
import { useState, useEffect } from "react"
import "./adminDashboard.css"
import Card from "../../components/UI/Card/Card"
import CardStat from "../../components/UI/Card/CardStat"
import ChartLine from "../../components/Charts/ChartLine"
import { busAPI, studentAPI, driverAPI, routeAPI } from "../../services/api"

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBuses: 0,
    totalStudents: 0,
    totalDrivers: 0,
    totalRoutes: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const [busesRes, studentsRes, driversRes, routesRes] = await Promise.all([
          busAPI.getAll(),
          studentAPI.getAll(),
          driverAPI.getAll(),
          routeAPI.getAll(),
        ])

        setStats({
          totalBuses: busesRes.data.length,
          totalStudents: studentsRes.data.length,
          totalDrivers: driversRes.data.length,
          totalRoutes: routesRes.data.length,
        })
        setLoading(false)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Không thể tải dữ liệu. Vui lòng kiểm tra kết nối backend.")
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Dashboard Admin</h1>
        </div>
        <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>Đang tải dữ liệu...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Dashboard Admin</h1>
        </div>
        <div style={{ textAlign: "center", padding: "40px", color: "#ff4444" }}>{error}</div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard Admin</h1>
      </div>

      <div className="stats-grid">
        <CardStat title="Tổng số xe bus" value={stats.totalBuses} icon="🚌" />
        <CardStat title="Tổng số học sinh" value={stats.totalStudents} icon="👨‍🎓" />
        <CardStat title="Tổng số tài xế" value={stats.totalDrivers} icon="👨‍✈️" />
        <CardStat title="Tổng số tuyến" value={stats.totalRoutes} icon="🗺️" />
      </div>

      <div className="chart-section">
        <Card title="Thống kê hoạt động">
          <ChartLine />
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard