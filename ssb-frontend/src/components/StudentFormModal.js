import { useState, useEffect } from "react"

function StudentFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    hoTen: "",
    lop: "",
    idTuyen: "",
    diemDon: "",
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        hoTen: initialData.hoTen || "",
        lop: initialData.lop || "",
        idTuyen: initialData.idTuyen || "",
        diemDon: initialData.diemDon || "",
      })
    } else {
      setFormData({ hoTen: "", lop: "", idTuyen: "", diemDon: "" })
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
        <h2 style={{ color: "#fff", marginBottom: "20px" }}>
          {initialData ? "Chỉnh sửa học sinh" : "Thêm học sinh mới"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", color: "#ccc", marginBottom: "8px" }}>Họ và tên</label>
            <input
              type="text"
              name="hoTen"
              value={formData.hoTen}
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
              placeholder="Nhập họ và tên học sinh"
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", color: "#ccc", marginBottom: "8px" }}>Lớp</label>
            <input
              type="text"
              name="lop"
              value={formData.lop}
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
              placeholder="Ví dụ: 10A1"
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", color: "#ccc", marginBottom: "8px" }}>ID Tuyến (tùy chọn)</label>
            <input
              type="number"
              name="idTuyen"
              value={formData.idTuyen}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                background: "#1a1a1a",
                border: "1px solid #444",
                borderRadius: "4px",
                color: "#fff",
              }}
              placeholder="ID tuyến đường"
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", color: "#ccc", marginBottom: "8px" }}>Điểm đón (tùy chọn)</label>
            <input
              type="text"
              name="diemDon"
              value={formData.diemDon}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                background: "#1a1a1a",
                border: "1px solid #444",
                borderRadius: "4px",
                color: "#fff",
              }}
              placeholder="Địa điểm đón học sinh"
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

export default StudentFormModal
