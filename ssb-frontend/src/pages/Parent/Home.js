import React from "react";
import StudentCard from "./components/StudentCard";
import NotificationItem from "./components/NotificationItem";

const studentsMock = [
  {
    id: "HS1",
    name: "HS1",
    className: "Lớp 3C",
    bus: "29B-12345",
    pickup: "07:15",
    eta: "15 phút",
    status: "onboard",
    statusLabel: "Đang trên xe"
  },
  {
    id: "HS2",
    name: "HS2",
    className: "Lớp 3C",
    bus: "29B-12345",
    pickup: "07:15",
    eta: "15 phút",
    status: "arrived",
    statusLabel: "Đã đến trường"
  }
];

const noticesMock = [
  { id: 1, title: "Con của bạn đã đến trường", desc: "HS2 đã đến trường lúc 07:30", time: "15 phút trước", icon: "check" },
  { id: 2, title: "Con của bạn đã được đón", desc: "HS1 đã lên xe buýt 29A-12345 lúc 07:05", time: "25 phút trước", icon: "check" },
  { id: 3, title: "Xe buýt bị trễ", desc: "Xe buýt 29A-12345 dự kiến trễ 10 phút do tắc đường", time: "35 phút trước", icon: "warn" },
  { id: 4, title: "Lịch trình hôm nay", desc: "Xe buýt 29A-12345 sẽ đón con bạn vào 07:00", time: "45 phút trước", icon: "clock" }
];

const previousNoticesMock = [
  { id: 5, title: "Con của bạn đã đến trường", desc: "HS2 đã đến trường lúc 07:30", time: "15 phút trước", icon: "check" },
  { id: 6, title: "Con của bạn đã được đón", desc: "HS1 đã lên xe buýt 29A-12345 lúc 07:05", time: "25 phút trước", icon: "check" },
  { id: 7, title: "Xe buýt bị trễ", desc: "Xe buýt 29A-12345 dự kiến trễ 10 phút do tắc đường", time: "35 phút trước", icon: "warn" },
  { id: 8, title: "Lịch trình hôm nay", desc: "Xe buýt 29A-12345 sẽ đón con bạn vào 07:00", time: "45 phút trước", icon: "clock" }
];


export default function ParentHome() {
  return (
    <div className="parent-home">
      <div className="greeting">
        <h2>Xin chào, Phụ huynh A</h2>
        <div className="sub">Thứ Ba, 30 tháng 9, 2025</div>
      </div>

      <h3 className="section-title">Con của bạn</h3>

      <div className="students-list">
        {studentsMock.map((s) => (
          <StudentCard key={s.id} student={s} />
        ))}
      </div>

      <h3 className="section-title">Thông báo gần đây</h3>

      <div className="notifications-list">
        {noticesMock.map(n => (
          <NotificationItem key={n.id} notice={n} />
        ))}
      </div>

      <h3 className="section-title">Trước đó</h3>

      <div className="notifications-list">
        {previousNoticesMock.map(n => (
          <NotificationItem key={n.id} notice={n} />
        ))}
      </div>

    </div>
  );
}