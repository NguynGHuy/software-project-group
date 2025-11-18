// models/student-model.js
const { sql, poolPromise } = require('../config/database.js'); // <-- Đảm bảo đường dẫn này đúng!

class Student {
    // GET tất cả học sinh
    static async getAll() {
        const pool = await poolPromise;
        if (!pool) throw new Error('Không thể kết nối DB');

        const result = await pool.request()
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
        const pool = await poolPromise;
        if (!pool) throw new Error('Không thể kết nối DB');

        const result = await pool.request()
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
        return result.recordset[0]; // Trả về 1 object hoặc undefined
    }

    // POST thêm học sinh mới
    static async create(studentData) {
        console.log('[v0] Student.create called with:', studentData);
        
        const { hoTen, lop, ngaySinh, noiSinh, idTuyen, diemDon, trangThai } = studentData;
        const pool = await poolPromise;
        if (!pool) throw new Error('Không thể kết nối DB');

        if (idTuyen) {
            const routeCheck = await pool.request()
                .input('idTuyen', sql.Int, idTuyen)
                .query('SELECT idTuyenDuong FROM TUYENDUONG WHERE idTuyenDuong = @idTuyen');
            
            if (routeCheck.recordset.length === 0) {
                throw new Error(`Tuyến xe ID ${idTuyen} không tồn tại`);
            }
        }

        if (diemDon) {
            const stopCheck = await pool.request()
                .input('diemDon', sql.Int, diemDon)
                .query('SELECT idDiemDung FROM DIEMDUNG WHERE idDiemDung = @diemDon');
            
            if (stopCheck.recordset.length === 0) {
                throw new Error(`Điểm dừng ID ${diemDon} không tồn tại`);
            }
        }

        const request = pool.request()
            .input('hoTen', sql.NVarChar, hoTen)
            .input('lop', sql.NVarChar, lop)
            .input('trangThai', sql.Int, 1); // Always set active status

        if (idTuyen) {
            request.input('idTuyen', sql.Int, parseInt(idTuyen));
        }

        if (diemDon) {
            request.input('diemDon', sql.Int, parseInt(diemDon));
        }

        if (ngaySinh) {
            request.input('ngaySinh', sql.Date, ngaySinh);
        }

        if (noiSinh) {
            request.input('noiSinh', sql.NVarChar, noiSinh);
        }

        // Build dynamic INSERT query
        const fields = ['hoTen', 'lop', 'trangThai'];
        const values = ['@hoTen', '@lop', '@trangThai'];

        if (idTuyen) {
            fields.push('idTuyen');
            values.push('@idTuyen');
        }

        if (diemDon) {
            fields.push('diemDon');
            values.push('@diemDon');
        }

        if (ngaySinh) {
            fields.push('ngaySinh');
            values.push('@ngaySinh');
        }

        if (noiSinh) {
            fields.push('noiSinh');
            values.push('@noiSinh');
        }

        const query = `
            INSERT INTO HOCSINH (${fields.join(', ')})
            OUTPUT INSERTED.idHocSinh
            VALUES (${values.join(', ')})
        `;

        console.log('[v0] Executing query:', query);
        console.log('[v0] With parsed values:', { 
            hoTen, 
            lop, 
            idTuyen: idTuyen ? parseInt(idTuyen) : null, 
            diemDon: diemDon ? parseInt(diemDon) : null 
        });

        try {
            const result = await request.query(query);
            console.log('[v0] Insert result:', result.recordset[0]);
            return result.recordset[0];
        } catch (err) {
            console.error('[v0] Insert error:', err.message);
            throw err;
        }
    }

    // PUT cập nhật học sinh
    static async update(id, studentData) {
        const pool = await poolPromise;
        if (!pool) throw new Error('Không thể kết nối DB');

        // 1. Kiểm tra học sinh tồn tại
        const checkResult = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT idHocSinh FROM HOCSINH WHERE idHocSinh = @id');

        if (!checkResult.recordset || checkResult.recordset.length === 0) {
            throw new Error('Không tìm thấy học sinh');
        }

        // 2. Xây dựng câu lệnh UPDATE động
        const { hoTen, lop, ngaySinh, noiSinh, idTuyen, diemDon, trangThai } = studentData;
        let updates = [];

        if (hoTen !== undefined) updates.push('hoTen = @hoTen');
        if (lop !== undefined) updates.push('lop = @lop');
        if (ngaySinh !== undefined) updates.push('ngaySinh = @ngaySinh');
        if (noiSinh !== undefined) updates.push('noiSinh = @noiSinh');
        if (idTuyen !== undefined) updates.push('idTuyen = @idTuyen');
        if (diemDon !== undefined) updates.push('diemDon = @diemDon');
        if (trangThai !== undefined) updates.push('trangThai = @trangThai');

        if (updates.length === 0) {
            return { message: 'Không có thông tin cần cập nhật' };
        }

        const updateQuery = `UPDATE HOCSINH SET ${updates.join(', ')} WHERE idHocSinh = @id`;

        // 3. Thực hiện cập nhật
        const request = pool.request().input('id', sql.Int, id);
        if (hoTen !== undefined) request.input('hoTen', sql.NVarChar, hoTen);
        if (lop !== undefined) request.input('lop', sql.NVarChar, lop);
        if (ngaySinh !== undefined) request.input('ngaySinh', sql.Date, ngaySinh);
        if (noiSinh !== undefined) request.input('noiSinh', sql.NVarChar, noiSinh);
        if (idTuyen !== undefined) request.input('idTuyen', sql.Int, idTuyen);
        if (diemDon !== undefined) request.input('diemDon', sql.Int, diemDon);
        if (trangThai !== undefined) request.input('trangThai', sql.Int, trangThai);

        await request.query(updateQuery);
        return { message: 'Cập nhật học sinh thành công!' }; // PUT thường trả về 200 OK hoặc 204 No Content
    }

    // DELETE học sinh (vô hiệu hóa học sinh và phụ huynh liên quan nếu cần)
    static async remove(id) {
        const pool = await poolPromise;
        if (!pool) throw new Error('Không thể kết nối DB');

        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // 1. Vô hiệu hóa học sinh
            const result = await transaction.request()
                .input('id', sql.Int, id)
                .query(`
                    UPDATE HOCSINH 
                    SET trangThai = 0 
                    WHERE idHocSinh = @id AND trangThai = 1
                `);

            if (result.rowsAffected[0] === 0) {
                throw new Error('Không tìm thấy học sinh hoặc học sinh đã bị vô hiệu hóa');
            }

            // 2. Vô hiệu hóa liên kết với phụ huynh (nếu có)
            await transaction.request()
                .input('idHocSinh', sql.Int, id)
                .query(`
                    DECLARE @phuhuynhs TABLE (idPhuHuynh INT);
                    INSERT INTO @phuhuynhs
                    SELECT DISTINCT idPhuHuynh 
                    FROM PHUHUYNH_HOCSINH
                    WHERE idHocSinh = @idHocSinh;

                    DELETE FROM PHUHUYNH_HOCSINH
                    WHERE idHocSinh = @idHocSinh;

                    UPDATE PHUHUYNH
                    SET trangThai = 0
                    WHERE idPhuHuynh IN (
                        SELECT ph.idPhuHuynh
                        FROM @phuhuynhs ph
                        LEFT JOIN PHUHUYNH_HOCSINH phs ON ph.idPhuHuynh = phs.idPhuHuynh
                        WHERE phs.idPhuHuynh IS NULL
                    );

                    UPDATE TAIKHOAN
                    SET trangThai = 0
                    WHERE idPhuHuynh IN (
                        SELECT idPhuHuynh
                        FROM PHUHUYNH
                        WHERE trangThai = 0 
                        AND idPhuHuynh IN (SELECT idPhuHuynh FROM @phuhuynhs)
                    );
                `);

            await transaction.commit();
            return { message: 'Đã vô hiệu hóa học sinh và cập nhật liên quan!' };

        } catch (err) {
            await transaction.rollback();
            throw err; // Ném lỗi để controller bắt
        }
    }
    //
    // Lấy danh sách phụ huynh của 1 học sinh
    static async getLinkedParents(studentId) {
        const pool = await poolPromise;
        if (!pool) throw new Error('Không thể kết nối DB');

        const result = await pool.request()
            .input('studentId', sql.Int, studentId)
            .query(`
                SELECT p.idPhuHuynh, p.hoTen, p.soDienThoai, p.email
                FROM PHUHUYNH p
                JOIN PHUHUYNH_HOCSINH ph ON p.idPhuHuynh = ph.idPhuHuynh
                WHERE ph.idHocSinh = @studentId AND p.trangThai = 1
            `);
        return result.recordset;
    }
}

module.exports = Student;
