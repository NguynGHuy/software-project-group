import React from 'react';
import { FiCheckCircle, FiTool, FiUserPlus, FiSend } from 'react-icons/fi';
import './AdminPage.css';
import './ProfilePage.css';

const ProfilePage = () => {
  return (
    <div className="admin-page">
      <div className="profile-grid">
        
        <div className="profile-col-left">
          <div className="profile-card user-info-card">
            <div className="user-main-avatar">
              <img src="https://th.bing.com/th/id/OIP.Mt057HI-p4lZS7h2wtPCCgHaEK?w=236&h=150&c=6&o=7&cb=ucfimg2&dpr=1.7&pid=1.7&rm=3&ucfimg=1" alt="User Avatar" /> 
            </div>
            <h4 className="user-name">Adonis</h4>
            <span className="user-role">Quản trị viên</span>
            <ul className="user-details">
              <li>
                <span className="detail-label">Email: </span>
                <span className="detail-value"> admin@gmail.com</span>
              </li>
              <li>
                <span className="detail-label">Điện thoại: </span>
                <span className="detail-value"> 0123456789</span>
              </li>
              <li>
                <span className="detail-label">Địa chỉ: </span>
                <span className="detail-value"> Quận 5</span>
              </li>
            </ul>
            <button className="logout-btn">Đăng xuất</button>
          </div>

          <div className="profile-card activity-card">
            <div className="card-header">
              <h5>Hoạt động gần đây</h5>
              <a href="#" className="view-all-link">Xem 30 sự kiện gần nhất</a>
            </div>
            <ul className="activity-list">
              <li className="activity-item">
                <div className="activity-icon"><FiCheckCircle /></div>
                <div className="activity-text">
                  <span className="activity-desc">Cập nhật tuyến #12</span>
                  <span className="activity-subtext">Cập nhật lộ trình - 2 giờ trước</span>
                </div>
              </li>
              <li className="activity-item">
                <div className="activity-icon"><FiTool /></div>
                <div className="activity-text">
                  <span className="activity-desc">Phê duyệt báo cáo bảo trì</span>
                  <span className="activity-subtext">Báo cáo #R-442 - 5 giờ trước</span>
                </div>
              </li>
              <li className="activity-item">
                <div className="activity-icon"><FiUserPlus /></div>
                <div className="activity-text">
                  <span className="activity-desc">Thêm tài xế Nguyễn Văn A</span>
                  <span className="activity-subtext">Tạo tài khoản - 1 ngày trước</span>
                </div>
              </li>
              <li className="activity-item">
                <div className="activity-icon"><FiSend /></div>
                <div className="activity-text">
                  <span className="activity-desc">Gửi thông báo tới 120 học sinh</span>
                  <span className="activity-subtext">Chiến dịch thông báo - 2 ngày trước</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="profile-col-right">
          <div className="profile-card quick-settings-card">
            <h5>Cài đặt nhanh</h5>
            <div className="setting-row">
              <label htmlFor="email-toggle">Thông báo email</label>
              <label className="switch">
                <input type="checkbox" id="email-toggle" defaultChecked />
                <span className="slider round"></span>
              </label>
            </div>
            <span className="setting-desc">Nhận cảnh báo & báo cáo định kỳ</span>
            
            <div className="help-card">
              <h6>Trợ giúp & Liên hệ</h6>
              <p>Nếu có vấn đề kỹ thuật, liên hệ: support@smartbus.local - +84 24 3999 0000</p>
              <div className="help-buttons">
                <button className="help-btn primary">Gửi yêu cầu</button>
                <button className="help-btn secondary">Tài liệu</button>
              </div>
            </div>
          </div>

          <div className="profile-card account-info-card">
            <h5>Thông tin tài khoản</h5>
            <ul className="account-details">
              <li>
                <span className="detail-label">Ngày tạo:</span>
                <span className="detail-value">20/09/2024</span>
              </li>
              <li>
                <span className="detail-label">Lần đăng nhập gần nhất:</span>
                <span className="detail-value">13/10/2025 - 15:32</span>
              </li>
              <li>
                <span className="detail-label">Trạng thái:</span>
                <span className="detail-value status-active">Hoạt động</span>
              </li>
              <li>
                <span className="detail-label">Quyền hạn:</span>
                <span className="detail-value">Admin toàn quyền</span>
              </li>
            </ul>
          </div>

          <div className="profile-card quick-actions-card">
            <h5>Cài đặt nhanh</h5>
            <div className="action-buttons">
              <button className="action-btn">Đổi mật khẩu</button>
              <button className="action-btn">Cập nhật ảnh</button>
              <button className="action-btn">Bật thông báo</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;