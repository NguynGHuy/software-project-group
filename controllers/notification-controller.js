import Notification from "../models/notification-model.js"

export const getUserNotifications = async (req, res) => {
  try {
    const { userId, userType } = req.query
    if (!userId || !userType) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin userId hoặc userType" })
    }

    const notifications = await Notification.getByUser(Number.parseInt(userId), userType)
    res.json({ success: true, data: notifications })
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server: " + err.message })
  }
}

export const getUnreadCount = async (req, res) => {
  try {
    const { userId, userType } = req.query
    if (!userId || !userType) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin userId hoặc userType" })
    }

    const count = await Notification.getUnreadCount(Number.parseInt(userId), userType)
    res.json({ success: true, data: { count } })
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server: " + err.message })
  }
}

export const createNotification = async (req, res) => {
  try {
    const { tieuDe, noiDung, loai, nguoiGui, loaiNguoiGui, nguoiNhan, loaiNguoiNhan, idLienQuan, loaiLienQuan } =
      req.body

    if (!tieuDe || !noiDung || !loai || !nguoiNhan || !loaiNguoiNhan) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc" })
    }

    const notification = await Notification.create(req.body)
    res.status(201).json({ success: true, message: "Tạo thông báo thành công!", data: notification })
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server: " + err.message })
  }
}

export const markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = Number.parseInt(req.params.id)
    const notification = await Notification.markAsRead(notificationId)

    if (!notification) {
      return res.status(404).json({ success: false, message: "Không tìm thấy thông báo" })
    }

    res.json({ success: true, message: "Đã đánh dấu đã đọc", data: notification })
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server: " + err.message })
  }
}

export const markAllAsRead = async (req, res) => {
  try {
    const { userId, userType } = req.body

    if (!userId || !userType) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin userId hoặc userType" })
    }

    await Notification.markAllAsRead(Number.parseInt(userId), userType)
    res.json({ success: true, message: "Đã đánh dấu tất cả đã đọc" })
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server: " + err.message })
  }
}

export const deleteNotification = async (req, res) => {
  try {
    const notificationId = Number.parseInt(req.params.id)
    const deleted = await Notification.remove(notificationId)

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Không tìm thấy thông báo" })
    }

    res.json({ success: true, message: "Đã xóa thông báo" })
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server: " + err.message })
  }
}
