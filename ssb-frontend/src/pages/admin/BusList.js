import { useState, useEffect } from "react"
import { busAPI } from "../../services/api"
import BusFormModal from "../../components/BusFormModal"

function BusList() {
  const [buses, setBuses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBus, setEditingBus] = useState(null)

  useEffect(() => {
    fetchBuses()
  }, [])

  const fetchBuses = async () => {
    try {
      setLoading(true)
      const response = await busAPI.getAll()
      setBuses(response.data?.buses || [])
      setLoading(false)
    } catch (err) {
      console.error("Error fetching buses:", err)
      setError("Không thể tải danh sách xe bus")
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingBus(null)
    setIsModalOpen(true)
  }

  const handleEdit = (bus) => {
    setEditingBus(bus)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa xe bus này?")) {
      return
    }

    try {
      await busAPI.delete(id)
      alert("Xóa xe bus thành công!")
      fetchBuses()
    } catch (err) {
      console.error("Error deleting bus:", err)
      alert("Lỗi khi xóa xe bus: " + (err.response?.data?.message || err.message))
    }
  }

  const handleSubmit = async (formData) => {
    try {
      if (editingBus) {
        await busAPI.update(editingBus.idXe, formData)
        alert("Cập nhật xe bus thành công!")
      } else {
        await busAPI.create(formData)
        alert("Thêm xe bus thành công!")
      }
      setIsModalOpen(false)
      setEditingBus(null)
      fetchBuses()
    } catch (err) {
      console.error("Error saving bus:", err)
      alert("Lỗi khi lưu xe bus: " + (err.response?.data?.message || err.message))
    }
  }

  if (loading) {
    return <div style={{ padding: "20px", color: "#888" }}>Đang tải danh sách xe bus...</div>
  }

  if (error) {
    return <div style={{ padding: "20px", color: "#ff4444" }}>{error}</div>
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ color: "#fff" }}>Quản lý Xe Bus</h1>
        <button
          onClick={handleCreate}
          style={{
            padding: "10px 20px",
            background: "#4caf50",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          + Thêm xe bus
        </button>
      </div>

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
              <th style={{ padding: "15px", textAlign: "left", color: "#fff" }}>Biển số</th>
              <th style={{ padding: "15px", textAlign: "left", color: "#fff" }}>Sức chứa</th>
              <th style={{ padding: "15px", textAlign: "left", color: "#fff" }}>Trạng thái</th>
              <th style={{ padding: "15px", textAlign: "center", color: "#fff" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {buses.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#888",
                  }}
                >
                  Chưa có xe bus nào
                </td>
              </tr>
            ) : (
              buses.map((bus) => (
                <tr key={bus.idXe} style={{ borderTop: "1px solid #333" }}>
                  <td style={{ padding: "15px", color: "#fff" }}>{bus.idXe}</td>
                  <td style={{ padding: "15px", color: "#fff" }}>{bus.bienSo}</td>
                  <td style={{ padding: "15px", color: "#fff" }}>{bus.sucChua}</td>
                  <td style={{ padding: "15px" }}>
                    <span
                      style={{
                        padding: "5px 12px",
                        borderRadius: "12px",
                        background: bus.trangThai === 1 ? "#4caf50" : "#ff9800",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    >
                      {bus.trangThai === 1 ? "Hoạt động" : "Không hoạt động"}
                    </span>
                  </td>
                  <td style={{ padding: "15px", textAlign: "center" }}>
                    <button
                      onClick={() => handleEdit(bus)}
                      style={{
                        padding: "6px 12px",
                        background: "#2196f3",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        marginRight: "8px",
                        fontSize: "12px",
                      }}
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(bus.idXe)}
                      style={{
                        padding: "6px 12px",
                        background: "#f44336",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <BusFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingBus(null)
        }}
        onSubmit={handleSubmit}
        initialData={editingBus}
      />
    </div>
  )
}

export default BusList
