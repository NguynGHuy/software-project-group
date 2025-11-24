import Message from "../models/message-model.js"

export const getConversation = async (req, res) => {
  try {
    const { user1Id, user1Type, user2Id, user2Type } = req.query

    if (!user1Id || !user1Type || !user2Id || !user2Type) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin" })
    }

    const messages = await Message.getConversation(
      Number.parseInt(user1Id),
      user1Type,
      Number.parseInt(user2Id),
      user2Type,
    )
    res.json({ success: true, data: messages })
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server: " + err.message })
  }
}

export const getConversationList = async (req, res) => {
  try {
    const { userId, userType } = req.query

    if (!userId || !userType) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin userId hoặc userType" })
    }

    const conversations = await Message.getConversationList(Number.parseInt(userId), userType)
    res.json({ success: true, data: conversations })
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server: " + err.message })
  }
}

export const sendMessage = async (req, res) => {
  try {
    const { nguoiGui, loaiNguoiGui, nguoiNhan, loaiNguoiNhan, noiDung } = req.body

    if (!nguoiGui || !loaiNguoiGui || !nguoiNhan || !loaiNguoiNhan || !noiDung) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc" })
    }

    const message = await Message.create(req.body)
    res.status(201).json({ success: true, message: "Gửi tin nhắn thành công!", data: message })
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server: " + err.message })
  }
}

export const markMessageAsRead = async (req, res) => {
  try {
    const messageId = Number.parseInt(req.params.id)
    const message = await Message.markAsRead(messageId)

    if (!message) {
      return res.status(404).json({ success: false, message: "Không tìm thấy tin nhắn" })
    }

    res.json({ success: true, message: "Đã đánh dấu đã đọc", data: message })
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server: " + err.message })
  }
}

export const markConversationAsRead = async (req, res) => {
  try {
    const { userId, userType, contactId, contactType } = req.body

    if (!userId || !userType || !contactId || !contactType) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin" })
    }

    await Message.markConversationAsRead(Number.parseInt(userId), userType, Number.parseInt(contactId), contactType)
    res.json({ success: true, message: "Đã đánh dấu cuộc trò chuyện đã đọc" })
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server: " + err.message })
  }
}
