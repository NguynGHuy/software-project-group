import React from "react";
import { FaCheckCircle, FaExclamationTriangle, FaRegClock } from "react-icons/fa";

const renderIcon = (iconName) => {
  switch (iconName) {
    case "check":
      return <FaCheckCircle size={24} color="#22C55E" />;
    case "warn":
      return <FaExclamationTriangle size={24} color="#F97316" />;
    case "clock":
      return <FaRegClock size={24} color="#6B7280" />;
    default:
      return null;
  }
};

export default function NotificationItem({ notice }) {
  return (
    <div className="notification-item-v2">
      <div className="notification-icon">
        {renderIcon(notice.icon)}
      </div>
      <div className="notification-content">
        <span className="notification-title">{notice.title}</span>
        <span className="notification-desc">{notice.desc}</span>
        <span className="notification-time">{notice.time}</span>
      </div>
    </div>
  );
}