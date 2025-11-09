import { useState, useEffect } from "react"
import { studentAPI } from "../../services/api"
import StudentFormModal from "../../components/StudentFormModal"

function StudentList() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await studentAPI.getAll()
      console.log('API response:', response)
      // Lấy mảng học sinh từ response.data.data
      const studentsData = response.data?.data || []
      setStudents(studentsData)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching students:", err)
      setError("Không thể tải danh sách học sinh")
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingStudent(null)
    setIsModalOpen(true)
  }

  const handleEdit = (student) => {
    setEditingStudent(student)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa học sinh này?")) {
      return
    }

    try {
      await studentAPI.delete(id)
      alert("Xóa học sinh thành công!")
      fetchStudents()
    } catch (err) {
      console.error("Error deleting student:", err)
      alert("Lỗi khi xóa học sinh: " + (err.response?.data?.message || err.message))
    }
  }

  const handleSubmit = async (formData) => {
    try {
      if (editingStudent) {
        await studentAPI.update(editingStudent.idHocSinh, formData)
        alert("Cập nhật học sinh thành công!")
      } else {
        await studentAPI.create(formData)
        alert("Thêm học sinh thành công!")
      }
      setIsModalOpen(false)
      setEditingStudent(null)
      fetchStudents()
    } catch (err) {
      console.error("Error saving student:", err)
      alert("Lỗi khi lưu học sinh: " + (err.response?.data?.message || err.message))
    }
  }

  if (loading) {
    return <div style={{ padding: "20px", color: "#888" }}>Đang tải danh sách học sinh...</div>
  }

  if (error) {
    return <div style={{ padding: "20px", color: "#ff4444" }}>{error}</div>
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ color: "#fff" }}>Quản lý Học Sinh</h1>
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
          + Thêm học sinh
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
              <th style={{ padding: "15px", textAlign: "left", color: "#fff" }}>Họ tên</th>
              <th style={{ padding: "15px", textAlign: "left", color: "#fff" }}>Lớp</th>
              <th style={{ padding: "15px", textAlign: "left", color: "#fff" }}>ID Tuyến</th>
              <th style={{ padding: "15px", textAlign: "left", color: "#fff" }}>Điểm đón</th>
              <th style={{ padding: "15px", textAlign: "left", color: "#fff" }}>Trạng thái</th>
              <th style={{ padding: "15px", textAlign: "center", color: "#fff" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#888",
                  }}
                >
                  Chưa có học sinh nào
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.idHocSinh} style={{ borderTop: "1px solid #333" }}>
                  <td style={{ padding: "15px", color: "#fff" }}>{student.idHocSinh}</td>
                  <td style={{ padding: "15px", color: "#fff" }}>{student.hoTen}</td>
                  <td style={{ padding: "15px", color: "#fff" }}>{student.lop}</td>
                  <td style={{ padding: "15px", color: "#fff" }}>{student.idTuyen || "Chưa có"}</td>
                  <td style={{ padding: "15px", color: "#fff" }}>{student.diemDon || "Chưa có"}</td>
                  <td style={{ padding: "15px" }}>
                    <span
                      style={{
                        padding: "5px 12px",
                        borderRadius: "12px",
                        background: student.trangThai === 1 ? "#4caf50" : "#ff9800",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    >
                      {student.trangThai === 1 ? "Hoạt động" : "Không hoạt động"}
                    </span>
                  </td>
                  <td style={{ padding: "15px", textAlign: "center" }}>
                    <button
                      onClick={() => handleEdit(student)}
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
                      onClick={() => handleDelete(student.idHocSinh)}
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

      <StudentFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingStudent(null)
        }}
        onSubmit={handleSubmit}
        initialData={editingStudent}
      />
    </div>
  )
}

export default StudentList
