import { sql, pool } from '../config/database.js';

class Schedule {
    /**
     * POST: Tạo lịch trình mới.
     * Khi tạo, tự động thêm tất cả học sinh của tuyến vào bảng điểm danh.
     */
    static async create(scheduleData) {
        const { idTaiXe, idXe, idQuanLy, ngayThucHien, idTuyen } = scheduleData;

        const db = await pool;
        if (!db) throw new Error('Không thể kết nối DB');

        const transaction = new sql.Transaction(db);
        await transaction.begin();

        try {
            // 1. Tạo lịch trình mới
            const scheduleResult = await transaction.request()
                .input('idTaiXe', sql.Int, idTaiXe)
                .input('idXe', sql.Int, idXe)
                .input('idQuanLy', sql.Int, idQuanLy)
                .input('ngayThucHien', sql.Date, ngayThucHien)
                .input('idTuyen', sql.Int, idTuyen)
                .input('trangThai', sql.NVarChar, 'READY') // Trạng thái ban đầu
                .query(`
                    INSERT INTO LICHTRINH (idTaiXe, idXe, idQuanLy, ngayThucHien, idTuyen, trangThai)
                    OUTPUT INSERTED.idLichTrinh
                    VALUES (@idTaiXe, @idXe, @idQuanLy, @ngayThucHien, @idTuyen, @trangThai)
                `);

            const newScheduleId = scheduleResult.recordset[0].idLichTrinh;

            // 2. Lấy tất cả học sinh thuộc tuyến này
            const students = await transaction.request()
                .input('idTuyen', sql.Int, idTuyen)
                .query(`
                    SELECT idHocSinh FROM HOCSINH 
                    WHERE idTuyen = @idTuyen AND trangThai = 1
                `);

            // 3. Thêm từng học sinh vào bảng DIEMDANH
            if (students.recordset.length > 0) {
                let queryInsert = 'INSERT INTO DIEMDANH (idLichTrinh, idHocSinh, trangThai) VALUES ';
                // Lưu ý: Request của mssql không hỗ trợ dynamic input param dễ dàng trong vòng lặp chuỗi
                // Nên ta sẽ loop insert từng cái hoặc tạo query string cẩn thận.
                // Để an toàn và đơn giản với Transaction, ta loop insert.
                
                for (const student of students.recordset) {
                     await transaction.request()
                        .input('idLichTrinh', sql.Int, newScheduleId)
                        .input('idHocSinh', sql.Int, student.idHocSinh)
                        .input('trangThai', sql.NVarChar, 'VANG')
                        .query(`INSERT INTO DIEMDANH (idLichTrinh, idHocSinh, trangThai) VALUES (@idLichTrinh, @idHocSinh, @trangThai)`);
                }
            }

            await transaction.commit();
            return { idLichTrinh: newScheduleId, soHocSinh: students.recordset.length };

        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }

    /**
     * GET: Lấy tất cả lịch trình (Thông tin chung)
     */
    static async getAll() {
        const db = await pool;
        if (!db) throw new Error('Không thể kết nối DB');

        const result = await db.request()
            .query(`
                SELECT 
                    l.idLichTrinh, l.ngayThucHien, l.trangThai, l.gioBatDau,
                    t.tenTuyen,
                    tx.hoTen as tenTaiXe, tx.hoTen as HoTenTaiXe,
                    x.bienSo, x.bienSo as BienSoXe
                FROM LICHTRINH l
                LEFT JOIN TUYENDUONG t ON l.idTuyen = t.idTuyenDuong
                LEFT JOIN TAIXE tx ON l.idTaiXe = tx.idTaiXe
                LEFT JOIN XEBUS x ON l.idXe = x.idXe
                ORDER BY l.ngayThucHien DESC, l.idLichTrinh DESC
            `);
        return result.recordset;
    }

    /**
     * GET: Lấy chi tiết 1 lịch trình (bao gồm danh sách điểm danh)
     */
    static async getById(id) {
        const db = await pool;
        if (!db) throw new Error('Không thể kết nối DB');

        // 1. Lấy thông tin lịch trình
        const scheduleResult = await db.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT 
                    l.idLichTrinh, l.ngayThucHien, l.trangThai, l.gioBatDau,
                    l.kinhDo, l.viDo,
                    t.idTuyenDuong, t.tenTuyen,
                    tx.idTaiXe, tx.hoTen as tenTaiXe,
                    x.idXe, x.bienSo
                FROM LICHTRINH l
                LEFT JOIN TUYENDUONG t ON l.idTuyen = t.idTuyenDuong
                LEFT JOIN TAIXE tx ON l.idTaiXe = tx.idTaiXe
                LEFT JOIN XEBUS x ON l.idXe = x.idXe
                WHERE l.idLichTrinh = @id
            `);

        if (!scheduleResult.recordset[0]) {
            return null; // Không tìm thấy
        }

        const schedule = scheduleResult.recordset[0];

        // 2. Lấy danh sách điểm danh của lịch trình
        const attendanceResult = await db.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT 
                    d.idHocSinh, d.trangThai,
                    h.hoTen, h.lop,
                    dd.tenDiemDung
                FROM DIEMDANH d
                JOIN HOCSINH h ON d.idHocSinh = h.idHocSinh
                LEFT JOIN DIEMDUNG dd ON h.diemDon = dd.idDiemDung
                WHERE d.idLichTrinh = @id
                ORDER BY h.hoTen
            `);

        schedule.danhSachDiemDanh = attendanceResult.recordset;
        return schedule;
    }

    /**
     * PUT: Cập nhật trạng thái lịch trình (VD: READY -> IN_PROGRESS -> DONE)
     */
    static async updateStatus(id, status) {
        const db = await pool;
        if (!db) throw new Error('Không thể kết nối DB');

        let query = 'UPDATE LICHTRINH SET trangThai = @status ';
        // Nếu bắt đầu, cập nhật luôn giờ bắt đầu
        if (status === 'IN_PROGRESS') {
            query += ', gioBatDau = CONVERT(time, GETDATE()) ';
        }
        query += ' OUTPUT INSERTED.idLichTrinh, INSERTED.trangThai WHERE idLichTrinh = @id';

        const result = await db.request()
            .input('id', sql.Int, id)
            .input('status', sql.NVarChar, status)
            .query(query);

        if (result.rowsAffected[0] === 0) {
            throw new Error('Không tìm thấy lịch trình');
        }
        return result.recordset[0];
    }

    /**
     * PUT: Cập nhật trạng thái điểm danh cho 1 học sinh
     */
    static async updateAttendance(scheduleId, studentId, status) {
        const db = await pool;
        if (!db) throw new Error('Không thể kết nối DB');

        const result = await db.request()
            .input('scheduleId', sql.Int, scheduleId)
            .input('studentId', sql.Int, studentId)
            .input('status', sql.NVarChar, status) // VD: 'DA_DON', 'DA_TRA', 'VANG'
            .query(`
                UPDATE DIEMDANH
                SET trangThai = @status
                OUTPUT INSERTED.idLichTrinh, INSERTED.idHocSinh, INSERTED.trangThai
                WHERE idLichTrinh = @scheduleId AND idHocSinh = @studentId
            `);

        if (result.rowsAffected[0] === 0) {
            throw new Error('Không tìm thấy học sinh trong lịch trình này');
        }
        return result.recordset[0];
    }
}

export default Schedule;