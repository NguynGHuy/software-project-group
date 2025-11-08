import React from 'react';
import './Status.css'; // Tạo file CSS này

const Status = ({ statusText }) => {
  let statusClass = '';

  switch (statusText.toLowerCase()) {
    case 'hoạt động':
    case 'đang hoạt động':
    case 'đang trên xe':
      statusClass = 'status-green';
      break;
    case 'ngừng hoạt động':
    case 'đã xuống xe':
      statusClass = 'status-red';
      break;
    case 'bảo trì':
    case 'nghỉ phép':
      statusClass = 'status-yellow';
      break;
    default:
      statusClass = 'status-gray';
  }

  return (
    <span className={`status-badge ${statusClass}`}>
      {statusText}
    </span>
  );
};

export default Status;