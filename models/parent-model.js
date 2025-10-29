// models/parent-model.js
const { sql, poolPromise } = require('../config/database.js');

class Parent {
    // GET tất cả phụ huynh
    static async getAll() {
        const pool = await poolPromise;
        if (!pool) throw new Error('Không thể kết nối DB');

        const result = await pool.request()
            .query(`
                SELECT 
                    p.idPhuHuynh, p.hoTen, p.soDienThoai, p.email, p.trangThai,
                    tk.taiKhoan 
                FROM PHUHUYNH p
                JOIN TAIKHOAN tk ON p.idPhuHuynh = tk.idPhuHuynh
                WHERE p.trangThai = 1
                ORDER BY p.hoTen
            `);
        return result.recordset;
    }

    // GET phụ huynh theo id
    static async getById(id) {
        const pool = await poolPromise;
        if (!pool) throw new Error('Không thể kết nối DB');

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT 
                    p.idPhuHuynh, p.hoTen, p.soDienThoai, p.email, p.trangThai,
                    tk.taiKhoan, tk.idTaiKhoan
                FROM PHUHUYNH p
                LEFT JOIN TAIKHOAN tk ON p.idPhuHuynh = tk.idPhuHuynh
                WHERE p.idPhuHuynh = @id
            `);
        return result.recordset[0];
    }

    // POST tạo phụ huynh mới (với transaction)
    static async create(parentData) {
        const { hoTen, soDienThoai, email, taiKhoan, matKhau } = parentData;

        const pool = await poolPromise;
        if (!pool) throw new Error('Không thể kết nối DB');

        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // 1. Kiểm tra username tồn tại
            const checkUser = await transaction.request()
                .input('taiKhoan', sql.NVarChar, taiKhoan)
                .query('SELECT COUNT(*) as count FROM TAIKHOAN WHERE taiKhoan = @taiKhoan');

            if (checkUser.recordset[0].count > 0) {
                throw new Error('Tên tài khoản (username) đã tồn tại');
            }

            // 2. Thêm vào PHUHUYNH
            const parentResult = await transaction.request()
                .input('hoTen', sql.NVarChar, hoTen)
                .input('soDienThoai', sql.NVarChar, soDienThoai)
                .input('email', sql.NVarChar, email)
                .input('trangThai', sql.Int, 1)
                .query(`
                    INSERT INTO PHUHUYNH (hoTen, soDienThoai, email, trangThai)
                    OUTPUT INSERTED.idPhuHuynh
                    VALUES (@hoTen, @soDienThoai, @email, @trangThai)
                `);

            const newParentId = parentResult.recordset[0].idPhuHuynh;

            // 3. Thêm vào TAIKHOAN
            const accountResult = await transaction.request()
                .input('taiKhoan', sql.NVarChar, taiKhoan)
                .input('matKhau', sql.NVarChar, matKhau) // !!! Cần mã hóa mật khẩu
                .input('trangThai', sql.Int, 1)
                .input('vaiTro', sql.NVarChar, 'PHU_HUYNH')
                .input('idPhuHuynh', sql.Int, newParentId)
                .query(`
                    INSERT INTO TAIKHOAN (taiKhoan, matKhau, trangThai, vaiTro, idPhuHuynh)
                    OUTPUT INSERTED.idTaiKhoan, INSERTED.taiKhoan
                    VALUES (@taiKhoan, @matKhau, @trangThai, @vaiTro, @idPhuHuynh)
                `);

            await transaction.commit();

            return {
                idPhuHuynh: newParentId,
                hoTen: hoTen,
                soDienThoai: soDienThoai,
                email: email,
                idTaiKhoan: accountResult.recordset[0].idTaiKhoan,
                taiKhoan: accountResult.recordset[0].taiKhoan
            };

        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }

    // PUT cập nhật phụ huynh
    static async update(id, parentData) {
        const { hoTen, soDienThoai, email, trangThai } = parentData;
        const pool = await poolPromise;
        if (!pool) throw new Error('Không thể kết nối DB');

        // Chỉ cập nhật bảng PHUHUYNH
        let updates = [];
        if (hoTen !== undefined) updates.push('hoTen = @hoTen');
        if (soDienThoai !== undefined) updates.push('soDienThoai = @soDienThoai');
        if (email !== undefined) updates.push('email = @email');
        if (trangThai !== undefined) updates.push('trangThai = @trangThai');

        if (updates.length === 0) {
            return { message: 'Không có thông tin cần cập nhật' };
        }

        const request = pool.request().input('id', sql.Int, id);
        if (hoTen !== undefined) request.input('hoTen', sql.NVarChar, hoTen);
        if (soDienThoai !== undefined) request.input('soDienThoai', sql.NVarChar, soDienThoai);
        if (email !== undefined) request.input('email', sql.NVarChar, email);
        if (trangThai !== undefined) request.input('trangThai', sql.Int, trangThai);

        const result = await request.query(`
            UPDATE PHUHUYNH
            SET ${updates.join(', ')}
            OUTPUT INSERTED.idPhuHuynh, INSERTED.hoTen, INSERTED.soDienThoai, INSERTED.email, INSERTED.trangThai
            WHERE idPhuHuynh = @id
        `);

        if (result.rowsAffected[0] === 0) {
            throw new Error('Không tìm thấy phụ huynh');
        }
        return result.recordset[0];
    }

    // DELETE (vô hiệu hóa) phụ huynh
    static async remove(id) {
        const pool = await poolPromise;
        if (!pool) throw new Error('Không thể kết nối DB');

        // 1. Kiểm tra ràng buộc (phụ huynh này còn học sinh không?)
        // Lưu ý: Logic xóa học sinh đã xử lý việc vô hiệu hóa phụ huynh
        // Logic ở đây dành cho việc admin chủ động vô hiệu hóa phụ huynh
        const checkUsage = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT COUNT(*) as count 
                FROM PHUHUYNH_HOCSINH ph
                JOIN HOCSINH h ON ph.idHocSinh = h.idHocSinh
                WHERE ph.idPhuHuynh = @id AND h.trangThai = 1
            `);

        if (checkUsage.recordset[0].count > 0) {
            throw new Error('Không thể vô hiệu hóa phụ huynh đang có học sinh hoạt động. Vui lòng vô hiệu hóa học sinh trước.');
        }

        // 2. Bắt đầu transaction
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // 2a. Vô hiệu hóa PHUHUYNH
            const parentResult = await transaction.request()
                .input('id', sql.Int, id)
                .query(`
                    UPDATE PHUHUYNH SET trangThai = 0 
                    OUTPUT DELETED.idPhuHuynh
                    WHERE idPhuHuynh = @id AND trangThai = 1
                `);

            if (parentResult.rowsAffected[0] === 0) {
                throw new Error('Không tìm thấy phụ huynh hoặc phụ huynh đã bị vô hiệu hóa');
            }

            // 2b. Vô hiệu hóa TAIKHOAN
            await transaction.request()
                .input('id', sql.Int, id)
                .query('UPDATE TAIKHOAN SET trangThai = 0 WHERE idPhuHuynh = @id');

            await transaction.commit();
            return { idPhuHuynh: id, message: 'Vô hiệu hóa phụ huynh thành công' };

        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }
    //
    // Lấy danh sách học sinh của 1 phụ huynh
    static async getLinkedStudents(parentId) {
        const pool = await poolPromise;
        if (!pool) throw new Error('Không thể kết nối DB');

        const result = await pool.request()
            .input('parentId', sql.Int, parentId)
            .query(`
                SELECT h.idHocSinh, h.hoTen, h.lop
                FROM HOCSINH h
                JOIN PHUHUYNH_HOCSINH ph ON h.idHocSinh = ph.idHocSinh
                WHERE ph.idPhuHuynh = @parentId AND h.trangThai = 1
            `);
        return result.recordset;
    }

    // Gán 1 học sinh cho 1 phụ huynh
    static async linkStudent(parentId, studentId) {
        const pool = await poolPromise;
        if (!pool) throw new Error('Không thể kết nối DB');

        // Kiểm tra liên kết đã tồn tại chưa
        const check = await pool.request()
            .input('parentId', sql.Int, parentId)
            .input('studentId', sql.Int, studentId)
            .query('SELECT COUNT(*) as count FROM PHUHUYNH_HOCSINH WHERE idPhuHuynh = @parentId AND idHocSinh = @studentId');

        if (check.recordset[0].count > 0) {
            throw new Error('Học sinh này đã được liên kết với phụ huynh');
        }

        // Tạo liên kết mới
        await pool.request()
            .input('parentId', sql.Int, parentId)
            .input('studentId', sql.Int, studentId)
            .query('INSERT INTO PHUHUYNH_HOCSINH (idPhuHuynh, idHocSinh) VALUES (@parentId, @studentId)');

        return { message: 'Liên kết thành công' };
    }

    // Hủy liên kết học sinh - phụ huynh
    static async unlinkStudent(parentId, studentId) {
        const pool = await poolPromise;
        if (!pool) throw new Error('Không thể kết nối DB');

        const result = await pool.request()
            .input('parentId', sql.Int, parentId)
            .input('studentId', sql.Int, studentId)
            .query('DELETE FROM PHUHUYNH_HOCSINH WHERE idPhuHuynh = @parentId AND idHocSinh = @studentId');

        if (result.rowsAffected[0] === 0) {
            throw new Error('Không tìm thấy liên kết để xóa');
        }

        return { message: 'Hủy liên kết thành công' };
    }
}

module.exports = Parent;