import { sql, pool } from "../config/database.js"

class Incident {
  // Get all incidents
  static async getAll() {
    const db = await pool
    const result = await db.request().query(`
            SELECT 
                i.idBaoCao,
                i.idTaiXe,
                t.hoTen as tenTaiXe,
                i.idLichTrinh,
                i.loaiSuCo,
                i.moTa,
                i.viTri,
                i.kinhDo,
                i.viDo,
                i.thoiGian,
                i.trangThai,
                i.nguoiXuLy,
                q.hoTen as tenNguoiXuLy,
                i.ghiChu
            FROM BAOCAO_SUCO i
            LEFT JOIN TAIXE t ON i.idTaiXe = t.idTaiXe
            LEFT JOIN QUANLY q ON i.nguoiXuLy = q.idQuanLy
            ORDER BY i.thoiGian DESC
        `)
    return result.recordset
  }

  // Get incidents by driver
  static async getByDriver(driverId) {
    const db = await pool
    const result = await db
      .request()
      .input("idTaiXe", sql.Int, driverId)
      .query(`
                SELECT 
                    i.idBaoCao,
                    i.idTaiXe,
                    t.hoTen as tenTaiXe,
                    i.idLichTrinh,
                    i.loaiSuCo,
                    i.moTa,
                    i.viTri,
                    i.kinhDo,
                    i.viDo,
                    i.thoiGian,
                    i.trangThai,
                    i.nguoiXuLy,
                    q.hoTen as tenNguoiXuLy,
                    i.ghiChu
                FROM BAOCAO_SUCO i
                LEFT JOIN TAIXE t ON i.idTaiXe = t.idTaiXe
                LEFT JOIN QUANLY q ON i.nguoiXuLy = q.idQuanLy
                WHERE i.idTaiXe = @idTaiXe
                ORDER BY i.thoiGian DESC
            `)
    return result.recordset
  }

  // Create incident report
  static async create(incidentData) {
    const { idTaiXe, idLichTrinh, loaiSuCo, moTa, viTri, kinhDo, viDo } = incidentData
    const db = await pool

    const result = await db
      .request()
      .input("idTaiXe", sql.Int, idTaiXe)
      .input("idLichTrinh", sql.Int, idLichTrinh || null)
      .input("loaiSuCo", sql.NVarChar, loaiSuCo)
      .input("moTa", sql.NVarChar, moTa)
      .input("viTri", sql.NVarChar, viTri || null)
      .input("kinhDo", sql.Float, kinhDo || null)
      .input("viDo", sql.Float, viDo || null)
      .query(`
                INSERT INTO BAOCAO_SUCO (idTaiXe, idLichTrinh, loaiSuCo, moTa, viTri, kinhDo, viDo)
                OUTPUT INSERTED.*
                VALUES (@idTaiXe, @idLichTrinh, @loaiSuCo, @moTa, @viTri, @kinhDo, @viDo)
            `)
    return result.recordset[0]
  }

  // Update incident status
  static async updateStatus(incidentId, statusData) {
    const { trangThai, nguoiXuLy, ghiChu } = statusData
    const db = await pool

    const result = await db
      .request()
      .input("id", sql.Int, incidentId)
      .input("trangThai", sql.NVarChar, trangThai)
      .input("nguoiXuLy", sql.Int, nguoiXuLy || null)
      .input("ghiChu", sql.NVarChar, ghiChu || null)
      .query(`
                UPDATE BAOCAO_SUCO 
                SET 
                    trangThai = @trangThai,
                    nguoiXuLy = @nguoiXuLy,
                    ghiChu = @ghiChu
                OUTPUT INSERTED.*
                WHERE idBaoCao = @id
            `)
    return result.recordset[0]
  }

  // Get incident by ID
  static async getById(incidentId) {
    const db = await pool
    const result = await db
      .request()
      .input("id", sql.Int, incidentId)
      .query(`
                SELECT 
                    i.idBaoCao,
                    i.idTaiXe,
                    t.hoTen as tenTaiXe,
                    i.idLichTrinh,
                    i.loaiSuCo,
                    i.moTa,
                    i.viTri,
                    i.kinhDo,
                    i.viDo,
                    i.thoiGian,
                    i.trangThai,
                    i.nguoiXuLy,
                    q.hoTen as tenNguoiXuLy,
                    i.ghiChu
                FROM BAOCAO_SUCO i
                LEFT JOIN TAIXE t ON i.idTaiXe = t.idTaiXe
                LEFT JOIN QUANLY q ON i.nguoiXuLy = q.idQuanLy
                WHERE i.idBaoCao = @id
            `)
    return result.recordset[0]
  }
}

export default Incident
