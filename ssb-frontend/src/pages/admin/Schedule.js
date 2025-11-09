import React from "react";
import './AdminPage.css'; 

const ScheduleList = () => {
  return (
    <div className="admin-page">
    <h2 className="page-title">Danh sách lịch trình</h2>

    <div className="data-table-wrapper">
    <table className="data-table">
        <thead>
        <tr>
            <th>Mã</th>
            <th>Tuyến xe</th>
            <th>Xe Buýt</th>
            <th>Tài xế</th>
            <th>Giờ khởi hành</th>
        </tr>
        </thead>

        <tbody>
        <tr>
            <td>B1</td>
            <td>
            Tuyến 1: <br /> Quận 1 - Quận 5
            </td>
            <td>59A-012345</td>
            <td>John</td>
            <td>9:00 AM</td>
        </tr>
        </tbody>
    </table>
    </div>
    </div>

  );
};

export default ScheduleList;
