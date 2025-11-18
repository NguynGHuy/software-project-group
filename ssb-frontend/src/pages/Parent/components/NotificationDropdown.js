// File: components/NotificationDropdown.js
import React from 'react';

export default function NotificationDropdown({ notices }) {
  return (
    <div className="notification-dropdown">
      <div className="notif-header">Thông báo</div>
      <ul className="notif-list">
        {notices.map(n => (
          <li key={n.id} className="notif-item">
            <strong>{n.title}</strong>
            <span>{n.desc}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}