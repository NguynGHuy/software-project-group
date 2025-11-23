import { sql, pool } from '../config/database.js';

class Student {
    // GET tất cả học sinh
    static async getAll() {
        const db = await pool;
        if (!db) throw new Error('Không thể kết nối DB');

        const result = await db.request()
            .query(`
                SELECT 
                    idHocSinh, hoTen, lop, ngaySinh, noiSinh,
                    idTuyen, diemDon, trangThai
                FROM HOCSINH 
                WHERE trangThai = 1
            `);
        return result.recordset;
    }

    // GET học sinh theo id
    static async getById(id) {
        const db = await pool;
        if (!db) throw new Error('Không thể kết nối DB');

        const result = await db.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT 
                    h.idHocSinh, h.hoTen, h.lop, h.ngaySinh, h.noiSinh,
                    h.idTuyen, h.diemDon, h.trangThai,
                    t.tenTuyen,
                    d.tenDiemDung
                FROM HOCSINH h
                LEFT JOIN TUYENDUONG t ON h.idTuyen = t.idTuyenDuong
                LEFT JOIN DIEMDUNG d ON h.diemDon = d.idDiemDung
                WHERE h.idHocSinh = @id
            `);
        return result.recordset[0];
    }

    // POST thêm học sinh mới
    static async create(studentData) {
        const { hoTen, lop, ngaySinh, noiSinh, idTuyen, diemDon } = studentData;
        const db = await pool;
        if (!db) throw new Error('Không thể kết nối DB');

        if (idTuyen) {
            const routeCheck = await db.request()
                .input('idTuyen', sql.Int, idTuyen)
                .query('SELECT idTuyenDuong FROM TUYENDUONG WHERE idTuyenDuong = @idTuyen');
            
            if (routeCheck.recordset.length === 0) throw new Error(`Tuyến xe ID ${idTuyen} không tồn tại`);
        }

        if (diemDon) {
            const stopCheck = await db.request()
                .input('diemDon', sql.Int, diemDon)
                .query('SELECT idDiemDung FROM DIEMDUNG WHERE idDiemDung = @diemDon');
            
            if (stopCheck.recordset.length === 0) throw new Error(`Điểm dừng ID ${diemDon} không tồn tại`);
        }

        const request = db.request()
            .input('hoTen', sql.NVarChar, hoTen)
            .input('lop', sql.NVarChar, lop)
            .input('trangThai', sql.Int, 1);

        if (idTuyen) request.input('idTuyen', sql.Int, parseInt(idTuyen));
        if (diemDon) request.input('diemDon', sql.Int, parseInt(diemDon));
        if (ngaySinh) request.input('ngaySinh', sql.Date, ngaySinh);
        if (noiSinh) request.input('noiSinh', sql.NVarChar, noiSinh);

        const fields = ['hoTen', 'lop', 'trangThai'];
        const values = ['@hoTen', '@lop', '@trangThai'];

        if (idTuyen) { fields.push('idTuyen'); values.push('@idTuyen'); }
        if (diemDon) { fields.push('diemDon'); values.push('@diemDon'); }
        if (ngaySinh) { fields.push('ngaySinh'); values.push('@ngaySinh'); }
        if (noiSinh) { fields.push('noiSinh'); values.push('@noiSinh'); }

        const query = `
            INSERT INTO HOCSINH (${fields.join(', ')})
            OUTPUT INSERTED.idHocSinh
            VALUES (${values.join(', ')})
        `;

        const result = await request.query(query);
        return result.recordset[0];
    }

    // PUT cập nhật học sinh
    static async update(id, studentData) {
        const db = await pool;
        const checkResult = await db.request().input('id', sql.Int, id).query('SELECT idHocSinh FROM HOCSINH WHERE idHocSinh = @id');
        if (!checkResult.recordset.length) throw new Error('Không tìm thấy học sinh');

        const { hoTen, lop, ngaySinh, noiSinh, idTuyen, diemDon, trangThai } = studentData;
        let updates = [];

        if (hoTen !== undefined) updates.push('hoTen = @hoTen');
        if (lop !== undefined) updates.push('lop = @lop');
        if (ngaySinh !== undefined) updates.push('ngaySinh = @ngaySinh');
        if (noiSinh !== undefined) updates.push('noiSinh = @noiSinh');
        if (idTuyen !== undefined) updates.push('idTuyen = @idTuyen');
        if (diemDon !== undefined) updates.push('diemDon = @diemDon');
        if (trangThai !== undefined) updates.push('trangThai = @trangThai');

        if (updates.length === 0) return { message: 'Không có thông tin cần cập nhật' };

        const request = db.request().input('id', sql.Int, id);
        if (hoTen !== undefined) request.input('hoTen', sql.NVarChar, hoTen);
        if (lop !== undefined) request.input('lop', sql.NVarChar, lop);
        if (ngaySinh !== undefined) request.input('ngaySinh', sql.Date, ngaySinh);
        if (noiSinh !== undefined) request.input('noiSinh', sql.NVarChar, noiSinh);
        if (idTuyen !== undefined) request.input('idTuyen', sql.Int, idTuyen);
        if (diemDon !== undefined) request.input('diemDon', sql.Int, diemDon);
        if (trangThai !== undefined) request.input('trangThai', sql.Int, trangThai);

        await request.query(`UPDATE HOCSINH SET ${updates.join(', ')} WHERE idHocSinh = @id`);
        return { message: 'Cập nhật học sinh thành công!' };
    }

    // DELETE học sinh
    static async remove(id) {
        const db = await pool;
        const transaction = new sql.Transaction(db);
        await transaction.begin();

        try {
            const result = await transaction.request().input('id', sql.Int, id)
                .query(`UPDATE HOCSINH SET trangThai = 0 WHERE idHocSinh = @id AND trangThai = 1`);

            if (result.rowsAffected[0] === 0) throw new Error('Không tìm thấy học sinh');

            await transaction.request().input('idHocSinh', sql.Int, id).query(`DELETE FROM PHUHUYNH_HOCSINH WHERE idHocSinh = @idHocSinh`);

            await transaction.commit();
            return { message: 'Đã vô hiệu hóa học sinh' };
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }

    static async getLinkedParents(studentId) {
        const db = await pool;
        const result = await db.request().input('studentId', sql.Int, studentId)
            .query(`
                SELECT p.idPhuHuynh, p.hoTen, p.soDienThoai, p.email
                FROM PHUHUYNH p
                JOIN PHUHUYNH_HOCSINH ph ON p.idPhuHuynh = ph.idPhuHuynh
                WHERE ph.idHocSinh = @studentId AND p.trangThai = 1
            `);
        return result.recordset;
    }
}
export default Student;