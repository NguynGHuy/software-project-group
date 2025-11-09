// models/bus-model.js
const { sql, poolPromise } = require('../config/database.js'); // <-- Đảm bảo đường dẫn này đúng!

class Bus {
    // GET tất cả xe bus
    static async getAll() {
        const pool = await poolPromise;
        if (!pool) throw new Error('Không thể kết nối DB');

        const result = await pool.request()
            .query(`
                SELECT idXe as idXeBus, bienSo, sucChua, trangThai
                FROM XEBUS 
                WHERE trangThai = 1
                ORDER BY idXe
            `);
        return result.recordset;
    }

    // GET xe bus theo id
    static async getById(id) {
        const pool = await poolPromise;
        if (!pool) throw new Error('Không thể kết nối DB');

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT idXe as idXeBus, bienSo, sucChua, trangThai
                FROM XEBUS 
                WHERE idXe = @id
            `);
        return result.recordset[0]; // Trả về 1 object hoặc undefined
    }

    // POST thêm xe bus mới
    static async create(busData) {
        const { bienSo, sucChua } = busData;
        const pool = await poolPromise;
        if (!pool) throw new Error('Không thể kết nối DB');

        // Kiểm tra biển số tồn tại
        const checkResult = await pool.request()
            .input('bienSo', sql.NVarChar, bienSo)
            .query('SELECT COUNT(*) as count FROM XEBUS WHERE bienSo = @bienSo');

        if (checkResult.recordset[0].count > 0) {
            // Ném lỗi để controller bắt
            throw new Error('Biển số xe đã tồn tại');
        }

        // Thêm xe bus mới
        const result = await pool.request()
            .input('bienSo', sql.NVarChar, bienSo)
            .input('sucChua', sql.Int, sucChua)
            .input('trangThai', sql.Int, 1)
            .query(`
                INSERT INTO XEBUS (bienSo, sucChua, trangThai)
                OUTPUT INSERTED.idXe as idXeBus, INSERTED.bienSo, INSERTED.sucChua, INSERTED.trangThai
                VALUES (@bienSo, @sucChua, @trangThai)
            `);
        return result.recordset[0];
    }

    // PUT cập nhật xe bus
    static async update(id, busData) {
        const { bienSo, sucChua, trangThai } = busData;
        const pool = await poolPromise;
        if (!pool) throw new Error('Không thể kết nối DB');

        // 1. Kiểm tra xe tồn tại
        const checkResult = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT COUNT(*) as count FROM XEBUS WHERE idXe = @id');

        if (checkResult.recordset[0].count === 0) {
            throw new Error('Không tìm thấy xe bus');
        }

        // 2. Kiểm tra biển số trùng nếu có cập nhật biển số
        if (bienSo) {
            const bienSoCheck = await pool.request()
                .input('bienSo', sql.NVarChar, bienSo)
                .input('id', sql.Int, id)
                .query('SELECT COUNT(*) as count FROM XEBUS WHERE bienSo = @bienSo AND idXe != @id');

            if (bienSoCheck.recordset[0].count > 0) {
                throw new Error('Biển số xe đã tồn tại');
            }
        }

        // 3. Xây dựng câu UPDATE động
        let updates = [];
        if (bienSo) updates.push('bienSo = @bienSo');
        if (sucChua) updates.push('sucChua = @sucChua');
        if (trangThai !== undefined) updates.push('trangThai = @trangThai');

        if (updates.length === 0) {
            return { message: 'Không có thông tin cần cập nhật' };
        }

        const updateQuery = `
            UPDATE XEBUS 
            SET ${updates.join(', ')}
            OUTPUT INSERTED.idXe as idXeBus, INSERTED.bienSo, INSERTED.sucChua, INSERTED.trangThai
            WHERE idXe = @id
        `;

        const request = pool.request().input('id', sql.Int, id);
        if (bienSo) request.input('bienSo', sql.NVarChar, bienSo);
        if (sucChua) request.input('sucChua', sql.Int, sucChua);
        if (trangThai !== undefined) request.input('trangThai', sql.Int, trangThai);

        const result = await request.query(updateQuery);
        return result.recordset[0];
    }

    // DELETE xóa xe bus (vô hiệu hóa)
    static async remove(id) {
        const pool = await poolPromise;
        if (!pool) throw new Error('Không thể kết nối DB');

        // 1. Kiểm tra xe tồn tại và đang hoạt động
        const checkResult = await pool.request()
            .input('id', sql.Int, id)
            .query(`SELECT idXe FROM XEBUS WHERE idXe = @id AND trangThai = 1`);

        if (!checkResult.recordset || checkResult.recordset.length === 0) {
            throw new Error('Không tìm thấy xe bus hoặc xe đã bị vô hiệu hóa');
        }

        // 2. Kiểm tra xe có đang được sử dụng
        const usageCheck = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT COUNT(*) as count
                FROM LICHTRINH
                WHERE idXe = @id AND trangThai NOT IN ('Đã hủy', 'Hoàn thành')
            `);

        if (usageCheck.recordset[0].count > 0) {
            throw new Error('Không thể xóa xe bus đang được sử dụng trong lịch trình');
        }

        // 3. Vô hiệu hóa xe bus
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                UPDATE XEBUS 
                SET trangThai = 0
                OUTPUT INSERTED.idXe as idXeBus, INSERTED.bienSo, INSERTED.sucChua, INSERTED.trangThai
                WHERE idXe = @id
            `);
        return result.recordset[0];
    }
}

module.exports = Bus;