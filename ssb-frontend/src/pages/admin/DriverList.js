import React from "react";
import './AdminPage.css'; 

const DriverList = () => {
  const drivers = [
    { id: 1, name: "Tài xế A", phone: "0901123456", status: "Online" },
    { id: 2, name: "Tài xế B", phone: "0902987654", status: "Offline" },
    { id: 3, name: "Tài xế C", phone: "0912345678", status: "Busy" },
  ];

  const statusClass = (status) => {
    if (status === "Online") return "driver-status online";
    if (status === "Offline") return "driver-status offline";
    if (status === "Busy") return "driver-status busy";
    return "driver-status inactive";
  };

  return (
    <div className="admin-page">
    <h2 className="page-title">Danh sách tài xế</h2>

    <table className="data-table">
        <thead>
        <tr>
            <th>Mã</th>
            <th>Họ Tên</th>
            <th>SĐT</th>
            <th>Trạng thái</th>
        </tr>
        </thead>
        <tbody>
        {drivers.map((item) => (
            <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>{item.phone}</td>
            <td className={`status ${item.status === "Online" ? "green" : item.status === "Offline" ? "red" : "yellow"}`}>
                {item.status}
            </td>
            </tr>
        ))}
        </tbody>
    </table>
    </div>

  );
};

export default DriverList;
