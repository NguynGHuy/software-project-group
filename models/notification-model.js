import { sql, pool } from "../config/database.js"

class Notification {
  // Get all notifications for a specific user
  static async getByUser(userId, userType) {
    const db = await pool
    const result = await db
      .request()
      .input("nguoiNhan", sql.Int, userId)
      .input("loaiNguoiNhan", sql.NVarChar, userType)
      .query(`
                SELECT 
                    idThongBao,
                    tieuDe,
                    noiDung,
                    loai,
                    nguoiGui,
                    loaiNguoiGui,
                    nguoiNhan,
                    loaiNguoiNhan,
                    daDoc,
                    thoiGian,
                    idLienQuan,
                    loaiLienQuan
                FROM THONGBAO 
                WHERE nguoiNhan = @nguoiNhan AND loaiNguoiNhan = @loaiNguoiNhan
                ORDER BY thoiGian DESC
            `)
    return result.recordset
  }

  // Get unread count for a user
  static async getUnreadCount(userId, userType) {
    const db = await pool
    const result = await db
      .request()
      .input("nguoiNhan", sql.Int, userId)
      .input("loaiNguoiNhan", sql.NVarChar, userType)
      .query(`
                SELECT COUNT(*) as count 
                FROM THONGBAO 
                WHERE nguoiNhan = @nguoiNhan 
                AND loaiNguoiNhan = @loaiNguoiNhan 
                AND daDoc = 0
            `)
    return result.recordset[0].count
  }

  // Create a new notification
  static async create(notificationData) {
    const { tieuDe, noiDung, loai, nguoiGui, loaiNguoiGui, nguoiNhan, loaiNguoiNhan, idLienQuan, loaiLienQuan } =
      notificationData
    const db = await pool

    const result = await db
      .request()
      .input("tieuDe", sql.NVarChar, tieuDe)
      .input("noiDung", sql.NVarChar, noiDung)
      .input("loai", sql.NVarChar, loai)
      .input("nguoiGui", sql.Int, nguoiGui || null)
      .input("loaiNguoiGui", sql.NVarChar, loaiNguoiGui || null)
      .input("nguoiNhan", sql.Int, nguoiNhan)
      .input("loaiNguoiNhan", sql.NVarChar, loaiNguoiNhan)
      .input("idLienQuan", sql.Int, idLienQuan || null)
      .input("loaiLienQuan", sql.NVarChar, loaiLienQuan || null)
      .query(`
                INSERT INTO THONGBAO (
                    tieuDe, noiDung, loai, nguoiGui, loaiNguoiGui, 
                    nguoiNhan, loaiNguoiNhan, idLienQuan, loaiLienQuan
                )
                OUTPUT INSERTED.*
                VALUES (
                    @tieuDe, @noiDung, @loai, @nguoiGui, @loaiNguoiGui,
                    @nguoiNhan, @loaiNguoiNhan, @idLienQuan, @loaiLienQuan
                )
            `)
    return result.recordset[0]
  }

  // Mark notification as read
  static async markAsRead(notificationId) {
    const db = await pool
    const result = await db
      .request()
      .input("id", sql.Int, notificationId)
      .query(`
                UPDATE THONGBAO 
                SET daDoc = 1 
                OUTPUT INSERTED.*
                WHERE idThongBao = @id
            `)
    return result.recordset[0]
  }

  // Mark all notifications as read for a user
  static async markAllAsRead(userId, userType) {
    const db = await pool
    await db
      .request()
      .input("nguoiNhan", sql.Int, userId)
      .input("loaiNguoiNhan", sql.NVarChar, userType)
      .query(`
                UPDATE THONGBAO 
                SET daDoc = 1 
                WHERE nguoiNhan = @nguoiNhan 
                AND loaiNguoiNhan = @loaiNguoiNhan 
                AND daDoc = 0
            `)
    return { success: true }
  }

  // Delete a notification
  static async remove(notificationId) {
    const db = await pool
    const result = await db
      .request()
      .input("id", sql.Int, notificationId)
      .query(`DELETE FROM THONGBAO WHERE idThongBao = @id`)
    return result.rowsAffected[0] > 0
  }
}

export default Notification
