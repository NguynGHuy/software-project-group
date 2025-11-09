// models/route-model.js
const { sql, poolPromise } = require('../config/database.js'); // <-- Đảm bảo đường dẫn này đúng!

class Route {
    // GET tất cả tuyến xe
    static async getAll() {
        const pool = await poolPromise;
        if (!pool) throw new Error('Không thể kết nối DB');

        const result = await pool.request()
            .query(`
                SELECT 
                    idTuyenDuong as idTuyen,
                    tenTuyen,
                    CONVERT(varchar(5), gioBatDau, 108) as gioBatDau,
                    CONVERT(varchar(5), gioKetThuc, 108) as gioKetThuc
                FROM TUYENDUONG
                ORDER BY idTuyenDuong
            `);
        return result.recordset;
    }

    // GET tuyến xe theo id với các điểm dừng
    static async getById(id) {
        const pool = await poolPromise;
        if (!pool) throw new Error('Không thể kết nối DB');

        // Lấy thông tin tuyến
        const routeResult = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT 
                    idTuyenDuong as idTuyen,
                    tenTuyen,
                    CONVERT(varchar(5), gioBatDau, 108) as gioBatDau,
                    CONVERT(varchar(5), gioKetThuc, 108) as gioKetThuc
                FROM TUYENDUONG
                WHERE idTuyenDuong = @id
            `);

        if (!routeResult.recordset || routeResult.recordset.length === 0) {
            return null; // Trả về null để controller xử lý 404
        }

        // Lấy các điểm dừng của tuyến
        const stopsResult = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT 
                    d.idDiemDung,
                    d.tenDiemDung,
                    d.kinhDo,
                    d.viDo,
                    td.thuTu
                FROM DIEMDUNG d
                JOIN TUYENDUONG_DIEMDUNG td ON d.idDiemDung = td.idDiemDung
                WHERE td.idTuyenDuong = @id
                ORDER BY td.thuTu
            `);

        const route = routeResult.recordset[0];
        route.diemDung = stopsResult.recordset;
        return route;
    }

    // POST thêm tuyến xe mới (với transaction)
    static async create(routeData) {
        const { tenTuyen, gioBatDauStr, gioKetThucStr, diemDung } = routeData;
        const pool = await poolPromise;
        if (!pool) throw new Error('Không thể kết nối DB');

        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // 1. Thêm tuyến đường
            const routeResult = await transaction.request()
                .input('tenTuyen', sql.NVarChar, tenTuyen)
                .input('gioBatDau', sql.VarChar, gioBatDauStr)
                .input('gioKetThuc', sql.VarChar, gioKetThucStr)
                .query(`
                    INSERT INTO TUYENDUONG (tenTuyen, gioBatDau, gioKetThuc)
                    OUTPUT 
                        INSERTED.idTuyenDuong as idTuyen,
                        INSERTED.tenTuyen,
                        CONVERT(varchar(5), INSERTED.gioBatDau, 108) as gioBatDau,
                        CONVERT(varchar(5), INSERTED.gioKetThuc, 108) as gioKetThuc
                    VALUES (@tenTuyen, CONVERT(time, @gioBatDau), CONVERT(time, @gioKetThuc))
                `);

            const newRoute = routeResult.recordset[0];

            // 2. Thêm điểm dừng nếu có
            if (diemDung && Array.isArray(diemDung) && diemDung.length > 0) {
                for (let i = 0; i < diemDung.length; i++) {
                    const diem = diemDung[i];
                    await transaction.request()
                        .input('idTuyen', sql.Int, newRoute.idTuyen)
                        .input('idDiem', sql.Int, diem.idDiemDung)
                        .input('thuTu', sql.Int, i + 1)
                        .query(`
                            INSERT INTO TUYENDUONG_DIEMDUNG (idTuyenDuong, idDiemDung, thuTu)
                            VALUES (@idTuyen, @idDiem, @thuTu)
                        `);
                }
                newRoute.diemDung = diemDung; // Trả về thông tin điểm dừng đã thêm
            }

            await transaction.commit();
            return newRoute;

        } catch (err) {
            await transaction.rollback();
            throw err; // Ném lỗi để controller bắt
        }
    }

    // PUT cập nhật tuyến xe (với transaction)
    static async update(id, routeData) {
        const { tenTuyen, gioBatDauStr, gioKetThucStr, diemDung } = routeData;
        const pool = await poolPromise;
        if (!pool) throw new Error('Không thể kết nối DB');

        // Kiểm tra tuyến tồn tại
        const checkResult = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT COUNT(*) as count FROM TUYENDUONG WHERE idTuyenDuong = @id');

        if (checkResult.recordset[0].count === 0) {
            throw new Error('Không tìm thấy tuyến xe');
        }

        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // 1. Cập nhật thông tin tuyến
            let updates = [];
            if (tenTuyen) updates.push('tenTuyen = @tenTuyen');
            if (gioBatDauStr) updates.push('gioBatDau = CONVERT(time, @gioBatDau)');
            if (gioKetThucStr) updates.push('gioKetThuc = CONVERT(time, @gioKetThuc)');

            if (updates.length > 0) {
                const request = transaction.request().input('id', sql.Int, id);
                if (tenTuyen) request.input('tenTuyen', sql.NVarChar, tenTuyen);
                if (gioBatDauStr) request.input('gioBatDau', sql.VarChar, gioBatDauStr);
                if (gioKetThucStr) request.input('gioKetThuc', sql.VarChar, gioKetThucStr);

                await request.query(`
                    UPDATE TUYENDUONG 
                    SET ${updates.join(', ')}
                    WHERE idTuyenDuong = @id
                `);
            }

            // 2. Cập nhật điểm dừng nếu có (xóa cũ, thêm mới)
            if (diemDung && Array.isArray(diemDung)) {
                // Xóa điểm dừng cũ
                await transaction.request()
                    .input('id', sql.Int, id)
                    .query('DELETE FROM TUYENDUONG_DIEMDUNG WHERE idTuyenDuong = @id');

                // Thêm điểm dừng mới
                for (let i = 0; i < diemDung.length; i++) {
                    const diem = diemDung[i];
                    await transaction.request()
                        .input('idTuyen', sql.Int, id)
                        .input('idDiem', sql.Int, diem.idDiemDung)
                        .input('thuTu', sql.Int, i + 1)
                        .query(`
                            INSERT INTO TUYENDUONG_DIEMDUNG (idTuyenDuong, idDiemDung, thuTu)
                            VALUES (@idTuyen, @idDiem, @thuTu)
                        `);
                }
            }

            // Lấy thông tin tuyến đã cập nhật để trả về
            const result = await transaction.request()
                .input('id', sql.Int, id)
                .query(`
                    SELECT 
                        idTuyenDuong as idTuyen,
                        tenTuyen,
                        CONVERT(varchar(5), gioBatDau, 108) as gioBatDau,
                        CONVERT(varchar(5), gioKetThuc, 108) as gioKetThuc
                    FROM TUYENDUONG
                    WHERE idTuyenDuong = @id
                `);

            await transaction.commit();
            return result.recordset[0];

        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }

    // DELETE xóa tuyến xe (với transaction)
    static async remove(id) {
        const pool = await poolPromise;
        if (!pool) throw new Error('Không thể kết nối DB');

        // 1. Kiểm tra tuyến có đang được sử dụng
        const usageCheck = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT 
                    (SELECT COUNT(*) FROM HOCSINH WHERE idTuyen = @id) as studentCount,
                    (SELECT COUNT(*) FROM LICHTRINH WHERE idTuyen = @id AND trangThai NOT IN ('Đã hủy', 'Hoàn thành')) as scheduleCount
            `);

        const { studentCount, scheduleCount } = usageCheck.recordset[0];

        if (studentCount > 0 || scheduleCount > 0) {
            throw new Error('Không thể xóa tuyến đang được sử dụng bởi học sinh hoặc lịch trình');
        }

        // 2. Bắt đầu transaction
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // 2a. Xóa các điểm dừng của tuyến
            await transaction.request()
                .input('id', sql.Int, id)
                .query('DELETE FROM TUYENDUONG_DIEMDUNG WHERE idTuyenDuong = @id');

            // 2b. Xóa tuyến
            const result = await transaction.request()
                .input('id', sql.Int, id)
                .query(`
                    DELETE FROM TUYENDUONG 
                    OUTPUT 
                        DELETED.idTuyenDuong as idTuyen,
                        DELETED.tenTuyen,
                        CONVERT(varchar(5), DELETED.gioBatDau, 108) as gioBatDau,
                        CONVERT(varchar(5), DELETED.gioKetThuc, 108) as gioKetThuc
                    WHERE idTuyenDuong = @id
                `);

            if (!result.recordset || result.recordset.length === 0) {
                throw new Error('Tuyến xe không tồn tại');
            }

            await transaction.commit();
            return result.recordset[0];

        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }
}

module.exports = Route;