import { useState, useEffect } from "react"

function BusFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    bienSo: "",
    sucChua: "",
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        bienSo: initialData.bienSo || "",
        sucChua: initialData.sucChua || "",
      })
    } else {
      setFormData({ bienSo: "", sucChua: "" })
    }
  }, [initialData, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  if (!isOpen) return null

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#2a2a2a",
          padding: "30px",
          borderRadius: "8px",
          width: "500px",
          maxWidth: "90%",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ color: "#fff", marginBottom: "20px" }}>{initialData ? "Chỉnh sửa xe bus" : "Thêm xe bus mới"}</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", color: "#ccc", marginBottom: "8px" }}>Biển số</label>
            <input
              type="text"
              name="bienSo"
              value={formData.bienSo}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                background: "#1a1a1a",
                border: "1px solid #444",
                borderRadius: "4px",
                color: "#fff",
              }}
              placeholder="Ví dụ: 29A-12345"
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", color: "#ccc", marginBottom: "8px" }}>Sức chứa</label>
            <input
              type="number"
              name="sucChua"
              value={formData.sucChua}
              onChange={handleChange}
              required
              min="1"
              style={{
                width: "100%",
                padding: "10px",
                background: "#1a1a1a",
                border: "1px solid #444",
                borderRadius: "4px",
                color: "#fff",
              }}
              placeholder="Số chỗ ngồi"
            />
          </div>

          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 20px",
                background: "#555",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                background: "#4caf50",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {initialData ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BusFormModal