import React, { useState } from "react";
import './AdminPage.css'; 

const StudentList = () => {
  const [filter, setFilter] = useState("all");

  const students = [
    { id: 1, name: "Nguyễn Văn A", grade: "3A", status: "Đang trên xe" },
    { id: 2, name: "Trần Thị B", grade: "4B", status: "Đã xuống xe" },
    { id: 3, name: "Lê Minh C", grade: "5C", status: "Chưa đón" },
  ];

  const getStatusClass = (status) => {
    if (status === "Đang trên xe") return "status green";
    if (status === "Đã xuống xe") return "status red";
    if (status === "Chưa đón") return "status yellow";
    return "status blue";
  };

  return (
    <div className="admin-page">
  <h2 className="page-title">Danh sách học sinh</h2>

  <div className="filter-tabs">
    <button
      className={`tab-item ${filter === "all" ? "active" : ""}`}
      onClick={() => setFilter("all")}
    >
      Tất cả
    </button>
    <button
      className={`tab-item ${filter === "on" ? "active" : ""}`}
      onClick={() => setFilter("on")}
    >
      Đang trên xe
    </button>
    <button
      className={`tab-item ${filter === "off" ? "active" : ""}`}
      onClick={() => setFilter("off")}
    >
      Đã xuống xe
    </button>
  </div>

  <table className="data-table">
    <thead>
      <tr>
        <th>Mã</th>
        <th>Họ Tên</th>
        <th>Lớp</th>
        <th>Trạng thái</th>
      </tr>
    </thead>
    <tbody>
      {students.map((item) => (
        <tr key={item.id}>
          <td>{item.id}</td>
          <td>{item.name}</td>
          <td>{item.grade}</td>
          <td className={getStatusClass(item.status)}>{item.status}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
  );
}
export default StudentList;
