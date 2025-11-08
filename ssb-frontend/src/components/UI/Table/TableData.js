import React from 'react';
import './TableData.css'; // Tạo file CSS này

/**
 * Component Bảng dữ liệu
 * @param {Array<Object>} columns - Mảng các cột. VD: [{ key: 'id', title: 'Mã' }]
 * @param {Array<Object>} data - Mảng dữ liệu. VD: [{ id: 'B1', name: 'Tuyến 1' }]
 * @param {Function} renderCell - (Optional) Hàm tùy chỉnh cách render ô
 */
const TableData = ({ columns, data, renderCell }) => {
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => (
                <td key={col.key}>
                  {/* Cho phép tùy chỉnh render, ví dụ: render Component Status */}
                  {renderCell ? renderCell(col.key, row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableData;