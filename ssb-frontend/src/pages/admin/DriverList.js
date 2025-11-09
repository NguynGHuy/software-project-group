import { useState, useEffect } from "react"
import { driverAPI } from "../../services/api"

function DriverList() {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDrivers()
  }, [])

  const fetchDrivers = async () => {
    try {
      setLoading(true)
      const response = await driverAPI.getAll()
      setDrivers(response.data)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching drivers:", err)
      setError("Không thể tải danh sách tài xế")
      setLoading(false)
    }
  }

  if (loading) {
    return <div style={{ padding: "20px", color: "#888" }}>Đang tải danh sách tài xế...</div>
  }

  if (error) {
    return <div style={{ padding: "20px", color: "#ff4444" }}>{error}</div>
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "#fff", marginBottom: "20px" }}>Quản lý Tài Xế</h1>

      <div
        style={{
          background: "#2a2a2a",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#1a1a1a" }}>
              <th style={{ padding: "15px", textAlign: "left", color: "#fff" }}>ID</th>
              <th style={{ padding: "15px", textAlign: "left", color: "#fff" }}>Họ tên</th>
              <th style={{ padding: "15px", textAlign: "left", color: "#fff" }}>Tài khoản</th>
              <th style={{ padding: "15px", textAlign: "left", color: "#fff" }}>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {drivers.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#888",
                  }}
                >
                  Chưa có tài xế nào
                </td>
              </tr>
            ) : (
              drivers.map((driver) => (
                <tr key={driver.idTaiXe} style={{ borderTop: "1px solid #333" }}>
                  <td style={{ padding: "15px", color: "#fff" }}>{driver.idTaiXe}</td>
                  <td style={{ padding: "15px", color: "#fff" }}>{driver.hoTen}</td>
                  <td style={{ padding: "15px", color: "#fff" }}>{driver.taiKhoan}</td>
                  <td style={{ padding: "15px" }}>
                    <span
                      style={{
                        padding: "5px 12px",
                        borderRadius: "12px",
                        background: driver.trangThai === 1 ? "#4caf50" : "#ff9800",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    >
                      {driver.trangThai === 1 ? "Hoạt động" : "Không hoạt động"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DriverList