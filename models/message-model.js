import { sql, pool } from "../config/database.js"

class Message {
  // Get conversation between two users
  static async getConversation(user1Id, user1Type, user2Id, user2Type) {
    const db = await pool
    const result = await db
      .request()
      .input("user1Id", sql.Int, user1Id)
      .input("user1Type", sql.NVarChar, user1Type)
      .input("user2Id", sql.Int, user2Id)
      .input("user2Type", sql.NVarChar, user2Type)
      .query(`
                SELECT 
                    idTinNhan,
                    nguoiGui,
                    loaiNguoiGui,
                    nguoiNhan,
                    loaiNguoiNhan,
                    noiDung,
                    daDoc,
                    thoiGian
                FROM TINNHAN 
                WHERE 
                    (nguoiGui = @user1Id AND loaiNguoiGui = @user1Type AND nguoiNhan = @user2Id AND loaiNguoiNhan = @user2Type)
                    OR
                    (nguoiGui = @user2Id AND loaiNguoiGui = @user2Type AND nguoiNhan = @user1Id AND loaiNguoiNhan = @user1Type)
                ORDER BY thoiGian ASC
            `)
    return result.recordset
  }

  // Get all conversations for a user (list of people they've messaged)
  static async getConversationList(userId, userType) {
    const db = await pool
    const result = await db
      .request()
      .input("userId", sql.Int, userId)
      .input("userType", sql.NVarChar, userType)
      .query(`
                SELECT DISTINCT
                    CASE 
                        WHEN nguoiGui = @userId AND loaiNguoiGui = @userType THEN nguoiNhan
                        ELSE nguoiGui
                    END as contactId,
                    CASE 
                        WHEN nguoiGui = @userId AND loaiNguoiGui = @userType THEN loaiNguoiNhan
                        ELSE loaiNguoiGui
                    END as contactType,
                    MAX(thoiGian) as lastMessageTime,
                    SUM(CASE WHEN nguoiNhan = @userId AND loaiNguoiNhan = @userType AND daDoc = 0 THEN 1 ELSE 0 END) as unreadCount
                FROM TINNHAN
                WHERE (nguoiGui = @userId AND loaiNguoiGui = @userType) 
                   OR (nguoiNhan = @userId AND loaiNguoiNhan = @userType)
                GROUP BY 
                    CASE 
                        WHEN nguoiGui = @userId AND loaiNguoiGui = @userType THEN nguoiNhan
                        ELSE nguoiGui
                    END,
                    CASE 
                        WHEN nguoiGui = @userId AND loaiNguoiGui = @userType THEN loaiNguoiNhan
                        ELSE loaiNguoiGui
                    END
                ORDER BY lastMessageTime DESC
            `)
    return result.recordset
  }

  // Send a message
  static async create(messageData) {
    const { nguoiGui, loaiNguoiGui, nguoiNhan, loaiNguoiNhan, noiDung } = messageData
    const db = await pool

    const result = await db
      .request()
      .input("nguoiGui", sql.Int, nguoiGui)
      .input("loaiNguoiGui", sql.NVarChar, loaiNguoiGui)
      .input("nguoiNhan", sql.Int, nguoiNhan)
      .input("loaiNguoiNhan", sql.NVarChar, loaiNguoiNhan)
      .input("noiDung", sql.NVarChar, noiDung)
      .query(`
                INSERT INTO TINNHAN (nguoiGui, loaiNguoiGui, nguoiNhan, loaiNguoiNhan, noiDung)
                OUTPUT INSERTED.*
                VALUES (@nguoiGui, @loaiNguoiGui, @nguoiNhan, @loaiNguoiNhan, @noiDung)
            `)
    return result.recordset[0]
  }

  // Mark message as read
  static async markAsRead(messageId) {
    const db = await pool
    const result = await db
      .request()
      .input("id", sql.Int, messageId)
      .query(`
                UPDATE TINNHAN 
                SET daDoc = 1 
                OUTPUT INSERTED.*
                WHERE idTinNhan = @id
            `)
    return result.recordset[0]
  }

  // Mark all messages in a conversation as read
  static async markConversationAsRead(userId, userType, contactId, contactType) {
    const db = await pool
    await db
      .request()
      .input("userId", sql.Int, userId)
      .input("userType", sql.NVarChar, userType)
      .input("contactId", sql.Int, contactId)
      .input("contactType", sql.NVarChar, contactType)
      .query(`
                UPDATE TINNHAN 
                SET daDoc = 1 
                WHERE nguoiNhan = @userId 
                AND loaiNguoiNhan = @userType
                AND nguoiGui = @contactId
                AND loaiNguoiGui = @contactType
                AND daDoc = 0
            `)
    return { success: true }
  }
}

export default Message
