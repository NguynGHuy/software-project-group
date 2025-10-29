// models/stop-model.js
const { sql, poolPromise } = require('../config/database.js');

class Stop {
    // GET tất cả điểm dừng
    static async getAll() {
        const pool = await poolPromise;
        if (!pool) throw new Error('Không thể kết nối DB');

        const result = await pool.request()
            .query(`
                SELECT idDiemDung, kinhDo, viDo, tenDiemDung 
                FROM DIEMDUNG 
                ORDER BY tenDiemDung
            `);
        return result.recordset;
    }

    // GET điểm dừng theo id
    static async getById(id) {
        const pool = await poolPromise;
        if (!pool) throw new Error('Không thể kết nối DB');

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT idDiemDung, kinhDo, viDo, tenDiemDung 
                FROM DIEMDUNG 
                WHERE idDiemDung = @id
            `);
        return result.recordset[0];
    }

    // POST tạo điểm dừng mới
    static async create(stopData) {
        const { idDiemDung, tenDiemDung, kinhDo, viDo } = stopData;
        const pool = await poolPromise;
        if (!pool) throw new Error('Không thể kết nối DB');

        // Phải cung cấp idDiemDung vì nó không phải là IDENTITY
        const result = await pool.request()
            .input('idDiemDung', sql.Int, idDiemDung)
            .input('tenDiemDung', sql.NVarChar, tenDiemDung)
            .input('kinhDo', sql.Float, kinhDo)
            .input('viDo', sql.Float, viDo)
            .query(`
                INSERT INTO DIEMDUNG (idDiemDung, tenDiemDung, kinhDo, viDo)
                OUTPUT INSERTED.idDiemDung, INSERTED.tenDiemDung, INSERTED.kinhDo, INSERTED.viDo
                VALUES (@idDiemDung, @tenDiemDung, @kinhDo, @viDo)
            `);
        return result.recordset[0];
    }

    // PUT cập nhật điểm dừng
    static async update(id, stopData) {
        const { tenDiemDung, kinhDo, viDo } = stopData;
        const pool = await poolPromise;
        if (!pool) throw new Error('Không thể kết nối DB');

        // 1. Kiểm tra tồn tại
        const check = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT COUNT(*) as count FROM DIEMDUNG WHERE idDiemDung = @id');

        if (check.recordset[0].count === 0) {
            throw new Error('Không tìm thấy điểm dừng');
        }

        // 2. Xây dựng câu update
        let updates = [];
        if (tenDiemDung !== undefined) updates.push('tenDiemDung = @tenDiemDung');
        if (kinhDo !== undefined) updates.push('kinhDo = @kinhDo');
        if (viDo !== undefined) updates.push('viDo = @viDo');

        if (updates.length === 0) {
            return { message: 'Không có thông tin cần cập nhật' };
        }

        const request = pool.request().input('id', sql.Int, id);
        if (tenDiemDung !== undefined) request.input('tenDiemDung', sql.NVarChar, tenDiemDung);
        if (kinhDo !== undefined) request.input('kinhDo', sql.Float, kinhDo);
        if (viDo !== undefined) request.input('viDo', sql.Float, viDo);

        const result = await request.query(`
            UPDATE DIEMDUNG
            SET ${updates.join(', ')}
            OUTPUT INSERTED.idDiemDung, INSERTED.tenDiemDung, INSERTED.kinhDo, INSERTED.viDo
            WHERE idDiemDung = @id
        `);
        return result.recordset[0];
    }

    // DELETE xóa điểm dừng
    static async remove(id) {
        const pool = await poolPromise;
        if (!pool) throw new Error('Không thể kết nối DB');

        // 1. Kiểm tra ràng buộc
        const checkUsage = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT 
                    (SELECT COUNT(*) FROM TUYENDUONG_DIEMDUNG WHERE idDiemDung = @id) as routeCount,
                    (SELECT COUNT(*) FROM HOCSINH WHERE diemDon = @id) as studentCount
            `);

        const { routeCount, studentCount } = checkUsage.recordset[0];
        if (routeCount > 0 || studentCount > 0) {
            throw new Error('Không thể xóa điểm dừng đang được sử dụng bởi tuyến đường hoặc học sinh');
        }

        // 2. Xóa
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                DELETE FROM DIEMDUNG 
                OUTPUT DELETED.idDiemDung, DELETED.tenDiemDung
                WHERE idDiemDung = @id
            `);

        if (result.rowsAffected[0] === 0) {
            throw new Error('Không tìm thấy điểm dừng');
        }
        return result.recordset[0];
    }
}

module.exports = Stop;