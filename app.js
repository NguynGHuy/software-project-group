const express = require('express');
const { sql, poolPromise } = require('./connect-database.js');
const session = require('express-session');
const app = express();
const port = 5000;

app.listen(port, () => {
    console.log(`Server đang chạy ở http://localhost:${port}`);
});
app.use(express.json());

// Session (memory store - chỉ dùng cho dev)
app.use(session({
    secret: 'dev-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// LOGIN 
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Thiếu username hoặc password' });
    }

    try {
        const pool = await poolPromise;
        if (!pool) return res.status(500).json({ success: false, message: 'Không thể kết nối DB' });

        // Lấy tài khoản từ TAIKHOAN và kiểm tra mật khẩu
        const accResult = await pool.request()
            .input('username', sql.NVarChar, username)
            .input('password', sql.NVarChar, password)
            .query(`SELECT idTaiKhoan, taiKhoan, matKhau, trangThai, vaiTro, idPhuHuynh, idTaiXe, idQuanLy
                    FROM TAIKHOAN
                    WHERE taiKhoan = @username 
                    AND matKhau = @password 
                    AND trangThai = 1`);

        if (!accResult.recordset || accResult.recordset.length === 0) {
            console.log('Không tìm thấy tài khoản khớp:', username);
            return res.json({ success: false, message: 'Sai thông tin đăng nhập!' });
        }

        const account = accResult.recordset[0];
        const role = account.vaiTro; // Lấy vai trò từ DB

        // Lấy thông tin chi tiết theo vai trò
        let detail = null;
        if (role === 'PHU_HUYNH') {
            const r = await pool.request()
                .input('idPhuHuynh', sql.Int, account.idPhuHuynh)
                .query('SELECT idPhuHuynh, hoTen, soDienThoai, email, trangThai FROM PHUHUYNH WHERE idPhuHuynh = @idPhuHuynh');
            detail = r.recordset[0] || null;
        } else if (role === 'TAI_XE') {
            const r = await pool.request()
                .input('idTaiXe', sql.Int, account.idTaiXe)
                .query('SELECT idTaiXe, hoTen, soDienThoai, email, trangThai FROM TAIXE WHERE idTaiXe = @idTaiXe');
            detail = r.recordset[0] || null;
        } else if (role === 'QUAN_LY') {
            const r = await pool.request()
                .input('idQuanLy', sql.Int, account.idQuanLy)
                .query('SELECT idQuanLy, hoTen, email, trangThai FROM QUANLY WHERE idQuanLy = @idQuanLy');
            detail = r.recordset[0] || null;
        }

        // Xác định đường dẫn redirect theo vai trò (test)
        let redirectUrl = '';
        switch (role) {
            case 'PHU_HUYNH': redirectUrl = '/phuhuynh/dashboard.html'; break;
            case 'TAI_XE': redirectUrl = '/taixe/dashboard.html'; break;
            case 'QUAN_LY': redirectUrl = '/quanly/dashboard.html'; break;
            default: redirectUrl = '/login.html';
        }

        // Lưu session và trả về thông tin + đường dẫn redirect
        req.session.user = {
            accountId: account.idTaiKhoan,
            username: account.taiKhoan,
            role: account.vaiTro,
            detail
        };

        console.log('Đăng nhập thành công:', req.session.user);
        res.json({
            success: true,
            user: req.session.user,
            redirectUrl: redirectUrl,
            message: `Đăng nhập thành công với vai trò ${role}`
        });

    } catch (err) {
        console.error('Lỗi khi đăng nhập:', err);
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
});


//BUSES

// GET tất cả xe bus
app.get('/api/buses', async (req, res) => {
    try {
        const pool = await poolPromise;
        if (!pool) return res.status(500).json({ success: false, message: 'Không thể kết nối DB' });

        const result = await pool.request()
            .query(`
                SELECT idXe as idXeBus, bienSo, sucChua, trangThai
                FROM XEBUS 
                WHERE trangThai = 1
                ORDER BY idXe
            `);

        res.json({
            success: true,
            data: result.recordset
        });

    } catch (err) {
        console.error('Lỗi khi lấy danh sách xe bus:', err);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách xe bus: ' + err.message
        });
    }
});

// GET xe bus theo id
app.get('/api/buses/:id', async (req, res) => {
    try {
        const pool = await poolPromise;
        if (!pool) return res.status(500).json({ success: false, message: 'Không thể kết nối DB' });

        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query(`
                SELECT idXe as idXeBus, bienSo, sucChua, trangThai
                FROM XEBUS 
                WHERE idXe = @id
            `);

        if (!result.recordset || result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy xe bus'
            });
        }

        res.json({
            success: true,
            data: result.recordset[0]
        });

    } catch (err) {
        console.error('Lỗi khi lấy thông tin xe bus:', err);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin xe bus: ' + err.message
        });
    }
});

// POST thêm xe bus mới
app.post('/api/buses', async (req, res) => {
    const { bienSo, sucChua } = req.body || {};

    // Validate đầu vào
    if (!bienSo || !sucChua) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin bắt buộc (bienSo, sucChua)'
        });
    }

    try {
        const pool = await poolPromise;
        if (!pool) return res.status(500).json({ success: false, message: 'Không thể kết nối DB' });

        // Kiểm tra biển số tồn tại
        const checkResult = await pool.request()
            .input('bienSo', sql.NVarChar, bienSo)
            .query('SELECT COUNT(*) as count FROM XEBUS WHERE bienSo = @bienSo');

        if (checkResult.recordset[0].count > 0) {
            return res.status(400).json({
                success: false,
                message: 'Biển số xe đã tồn tại'
            });
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

        res.status(201).json({
            success: true,
            message: 'Thêm xe bus thành công!',
            data: result.recordset[0]
        });

    } catch (err) {
        console.error('Lỗi khi thêm xe bus:', err);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm xe bus: ' + err.message
        });
    }
});

// PUT cập nhật xe bus
app.put('/api/buses/:id', async (req, res) => {
    const { bienSo, sucChua, trangThai } = req.body || {};
    const id = parseInt(req.params.id);

    try {
        const pool = await poolPromise;
        if (!pool) return res.status(500).json({ success: false, message: 'Không thể kết nối DB' });

        // Kiểm tra xe tồn tại
        const checkResult = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT COUNT(*) as count FROM XEBUS WHERE idXe = @id');

        if (checkResult.recordset[0].count === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy xe bus'
            });
        }

        // Kiểm tra biển số trùng nếu có cập nhật biển số
        if (bienSo) {
            const bienSoCheck = await pool.request()
                .input('bienSo', sql.NVarChar, bienSo)
                .input('id', sql.Int, id)
                .query('SELECT COUNT(*) as count FROM XEBUS WHERE bienSo = @bienSo AND idXe != @id');

            if (bienSoCheck.recordset[0].count > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Biển số xe đã tồn tại'
                });
            }
        }

        // Xây dựng câu UPDATE động
        let updates = [];
        if (bienSo) updates.push('bienSo = @bienSo');
        if (sucChua) updates.push('sucChua = @sucChua');
        if (trangThai !== undefined) updates.push('trangThai = @trangThai');

        if (updates.length === 0) {
            return res.json({
                success: true,
                message: 'Không có thông tin cần cập nhật'
            });
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

        res.json({
            success: true,
            message: 'Cập nhật xe bus thành công!',
            data: result.recordset[0]
        });

    } catch (err) {
        console.error('Lỗi khi cập nhật xe bus:', err);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật xe bus: ' + err.message
        });
    }
});

// DELETE xóa xe bus (cập nhật trạng thái)
app.delete('/api/buses/:id', async (req, res) => {
    try {
        const pool = await poolPromise;
        if (!pool) return res.status(500).json({ success: false, message: 'Không thể kết nối DB' });

        // Kiểm tra xe tồn tại và đang hoạt động
        const checkResult = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query(`
                SELECT idXe, bienSo 
                FROM XEBUS 
                WHERE idXe = @id AND trangThai = 1
            `);

        if (!checkResult.recordset || checkResult.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy xe bus hoặc xe đã bị vô hiệu hóa'
            });
        }

        // Kiểm tra xe có đang được sử dụng trong lịch trình
        const usageCheck = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query(`
                SELECT COUNT(*) as count
                FROM LICHTRINH
                WHERE idXe = @id AND trangThai NOT IN ('Đã hủy', 'Hoàn thành')
            `);

        if (usageCheck.recordset[0].count > 0) {
            return res.status(400).json({
                success: false,
                message: 'Không thể xóa xe bus đang được sử dụng trong lịch trình'
            });
        }

        // Vô hiệu hóa xe bus
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query(`
                UPDATE XEBUS 
                SET trangThai = 0
                OUTPUT INSERTED.idXe as idXeBus, INSERTED.bienSo, INSERTED.sucChua, INSERTED.trangThai
                WHERE idXe = @id
            `);

        res.json({
            success: true,
            message: 'Đã vô hiệu hóa xe bus thành công!',
            data: result.recordset[0]
        });

    } catch (err) {
        console.error('Lỗi khi xóa xe bus:', err);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa xe bus: ' + err.message
        });
    }
});

//ROUTES

// GET tất cả tuyến xe
app.get('/api/routes', async (req, res) => {
    try {
        const pool = await poolPromise;
        if (!pool) return res.status(500).json({ success: false, message: 'Không thể kết nối DB' });

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

        res.json({
            success: true,
            data: result.recordset
        });

    } catch (err) {
        console.error('Lỗi khi lấy danh sách tuyến:', err);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách tuyến: ' + err.message
        });
    }
});

// GET tuyến xe theo id với các điểm dừng
app.get('/api/routes/:id', async (req, res) => {
    try {
        const pool = await poolPromise;
        if (!pool) return res.status(500).json({ success: false, message: 'Không thể kết nối DB' });

        // Lấy thông tin tuyến
        const routeResult = await pool.request()
            .input('id', sql.Int, req.params.id)
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
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy tuyến xe'
            });
        }

        // Lấy các điểm dừng của tuyến
        const stopsResult = await pool.request()
            .input('id', sql.Int, req.params.id)
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

        res.json({
            success: true,
            data: route
        });

    } catch (err) {
        console.error('Lỗi khi lấy thông tin tuyến:', err);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin tuyến: ' + err.message
        });
    }
});

// Helper function để chuẩn hóa giờ
function normalizeTimeStr(t) {
    if (!t) return null;
    const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(t.trim());
    if (!m) return null;
    const hh = String(parseInt(m[1], 10)).padStart(2, '0');
    const mm = String(parseInt(m[2], 10)).padStart(2, '0');
    const ss = String(m[3] ? parseInt(m[3], 10) : 0).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
}

// POST thêm tuyến xe mới
app.post('/api/routes', async (req, res) => {
    const { tenTuyen, gioBatDau, gioKetThuc, diemDung } = req.body || {};

    // Validate đầu vào
    if (!tenTuyen || !gioBatDau || !gioKetThuc) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin bắt buộc (tenTuyen, gioBatDau, gioKetThuc)'
        });
    }

    // Chuẩn hóa giờ
    const gioBatDauStr = normalizeTimeStr(gioBatDau);
    const gioKetThucStr = normalizeTimeStr(gioKetThuc);
    if (!gioBatDauStr || !gioKetThucStr) {
        return res.status(400).json({
            success: false,
            message: 'Định dạng giờ không hợp lệ (HH:mm hoặc HH:mm:ss)'
        });
    }

    try {
        const pool = await poolPromise;
        if (!pool) return res.status(500).json({ success: false, message: 'Không thể kết nối DB' });

        // Bắt đầu transaction
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
                newRoute.diemDung = diemDung;
            }

            // Commit transaction
            await transaction.commit();

            res.status(201).json({
                success: true,
                message: 'Thêm tuyến xe thành công!',
                data: newRoute
            });

        } catch (err) {
            await transaction.rollback();
            throw err;
        }

    } catch (err) {
        console.error('Lỗi khi thêm tuyến xe:', err);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm tuyến xe: ' + err.message
        });
    }
});

// PUT cập nhật tuyến xe
app.put('/api/routes/:id', async (req, res) => {
    const { tenTuyen, gioBatDau, gioKetThuc, diemDung } = req.body || {};
    const id = parseInt(req.params.id);

    try {
        const pool = await poolPromise;
        if (!pool) return res.status(500).json({ success: false, message: 'Không thể kết nối DB' });

        // Kiểm tra tuyến tồn tại
        const checkResult = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT COUNT(*) as count FROM TUYENDUONG WHERE idTuyenDuong = @id');

        if (checkResult.recordset[0].count === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy tuyến xe'
            });
        }

        // Chuẩn hóa giờ nếu có
        let gioBatDauStr = null, gioKetThucStr = null;
        if (gioBatDau) {
            gioBatDauStr = normalizeTimeStr(gioBatDau);
            if (!gioBatDauStr) {
                return res.status(400).json({
                    success: false,
                    message: 'Định dạng giờ bắt đầu không hợp lệ (HH:mm hoặc HH:mm:ss)'
                });
            }
        }
        if (gioKetThuc) {
            gioKetThucStr = normalizeTimeStr(gioKetThuc);
            if (!gioKetThucStr) {
                return res.status(400).json({
                    success: false,
                    message: 'Định dạng giờ kết thúc không hợp lệ (HH:mm hoặc HH:mm:ss)'
                });
            }
        }

        // Bắt đầu transaction
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // 1. Cập nhật thông tin tuyến
            let updates = [];
            if (tenTuyen) updates.push('tenTuyen = @tenTuyen');
            if (gioBatDauStr) updates.push('gioBatDau = CONVERT(time, @gioBatDau)');
            if (gioKetThucStr) updates.push('gioKetThuc = CONVERT(time, @gioKetThuc)');

            if (updates.length > 0) {
                const request = transaction.request()
                    .input('id', sql.Int, id);

                if (tenTuyen) request.input('tenTuyen', sql.NVarChar, tenTuyen);
                if (gioBatDauStr) request.input('gioBatDau', sql.VarChar, gioBatDauStr);
                if (gioKetThucStr) request.input('gioKetThuc', sql.VarChar, gioKetThucStr);

                await request.query(`
                    UPDATE TUYENDUONG 
                    SET ${updates.join(', ')}
                    WHERE idTuyenDuong = @id
                `);
            }

            // 2. Cập nhật điểm dừng nếu có
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

            // Lấy thông tin tuyến đã cập nhật
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

            // Commit transaction
            await transaction.commit();

            res.json({
                success: true,
                message: 'Cập nhật tuyến xe thành công!',
                data: result.recordset[0]
            });

        } catch (err) {
            await transaction.rollback();
            throw err;
        }

    } catch (err) {
        console.error('Lỗi khi cập nhật tuyến xe:', err);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật tuyến xe: ' + err.message
        });
    }
});

// DELETE xóa tuyến xe
app.delete('/api/routes/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const pool = await poolPromise;
        if (!pool) return res.status(500).json({ success: false, message: 'Không thể kết nối DB' });

        // Kiểm tra tuyến có đang được sử dụng
        const usageCheck = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT 
                    (SELECT COUNT(*) FROM HOCSINH WHERE idTuyen = @id) as studentCount,
                    (SELECT COUNT(*) FROM LICHTRINH WHERE idTuyen = @id AND trangThai NOT IN ('Đã hủy', 'Hoàn thành')) as scheduleCount
            `);

        const { studentCount, scheduleCount } = usageCheck.recordset[0];

        if (studentCount > 0 || scheduleCount > 0) {
            return res.status(400).json({
                success: false,
                message: 'Không thể xóa tuyến đang được sử dụng bởi học sinh hoặc lịch trình'
            });
        }

        // Bắt đầu transaction
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // 1. Xóa các điểm dừng của tuyến
            await transaction.request()
                .input('id', sql.Int, id)
                .query('DELETE FROM TUYENDUONG_DIEMDUNG WHERE idTuyenDuong = @id');

            // 2. Xóa tuyến
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

            // Commit transaction
            await transaction.commit();

            res.json({
                success: true,
                message: 'Xóa tuyến xe thành công!',
                data: result.recordset[0]
            });

        } catch (err) {
            await transaction.rollback();
            throw err;
        }

    } catch (err) {
        console.error('Lỗi khi xóa tuyến xe:', err);
        res.status(500).json({
            success: false,
            message: err.message === 'Tuyến xe không tồn tại'
                ? err.message
                : 'Lỗi khi xóa tuyến xe: ' + err.message
        });
    }
});

//STUDENTS

// GET tất cả học sinh (đang hoạt động)
app.get('/api/students', async (req, res) => {
    try {
        const pool = await poolPromise;
        if (!pool) return res.status(500).json({ success: false, message: 'Không thể kết nối DB' });

        const result = await pool.request()
            .query(`
                SELECT 
                    idHocSinh, hoTen, lop, ngaySinh, noiSinh,
                    idTuyen, diemDon, trangThai
                FROM HOCSINH 
                WHERE trangThai = 1
            `);

        res.json({
            success: true,
            data: result.recordset
        });

    } catch (err) {
        console.error('Lỗi khi lấy danh sách học sinh:', err);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách học sinh: ' + err.message
        });
    }
});

// GET học sinh theo id
app.get('/api/students/:id', async (req, res) => {
    try {
        const pool = await poolPromise;
        if (!pool) return res.status(500).json({ success: false, message: 'Không thể kết nối DB' });

        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
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

        if (!result.recordset || result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy học sinh'
            });
        }

        res.json({
            success: true,
            data: result.recordset[0]
        });

    } catch (err) {
        console.error('Lỗi khi lấy thông tin học sinh:', err);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin học sinh: ' + err.message
        });
    }
});

// POST thêm học sinh mới
app.post('/api/students', async (req, res) => {
    const { hoTen, lop, ngaySinh, noiSinh, idTuyen, diemDon } = req.body || {};

    // Validate đầu vào
    if (!hoTen || !lop || !idTuyen || !diemDon) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin bắt buộc (hoTen, lop, idTuyen, diemDon)'
        });
    }

    try {
        const pool = await poolPromise;
        if (!pool) return res.status(500).json({ success: false, message: 'Không thể kết nối DB' });

        // Insert học sinh mới
        const result = await pool.request()
            .input('hoTen', sql.NVarChar, hoTen)
            .input('lop', sql.NVarChar, lop)
            .input('ngaySinh', sql.Date, ngaySinh)
            .input('noiSinh', sql.NVarChar, noiSinh)
            .input('idTuyen', sql.Int, idTuyen)
            .input('diemDon', sql.Int, diemDon)
            .input('trangThai', sql.Int, 1) // Mặc định là hoạt động
            .query(`
                INSERT INTO HOCSINH (hoTen, lop, ngaySinh, noiSinh, idTuyen, diemDon, trangThai)
                OUTPUT INSERTED.idHocSinh
                VALUES (@hoTen, @lop, @ngaySinh, @noiSinh, @idTuyen, @diemDon, @trangThai)
            `);

        res.json({
            success: true,
            message: 'Thêm học sinh thành công!',
            data: {
                idHocSinh: result.recordset[0].idHocSinh
            }
        });

    } catch (err) {
        console.error('Lỗi khi thêm học sinh:', err);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm học sinh: ' + err.message
        });
    }
});

// PUT cập nhật học sinh
app.put('/api/students/:id', async (req, res) => {
    const { hoTen, lop, ngaySinh, noiSinh, idTuyen, diemDon, trangThai } = req.body || {};

    try {
        const pool = await poolPromise;
        if (!pool) return res.status(500).json({ success: false, message: 'Không thể kết nối DB' });

        // Kiểm tra học sinh tồn tại
        const checkResult = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('SELECT idHocSinh FROM HOCSINH WHERE idHocSinh = @id');

        if (!checkResult.recordset || checkResult.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy học sinh'
            });
        }

        // Xây dựng câu lệnh UPDATE động
        let updates = [];
        let updateQuery = 'UPDATE HOCSINH SET ';

        if (hoTen !== undefined) {
            updates.push('hoTen = @hoTen');
        }
        if (lop !== undefined) {
            updates.push('lop = @lop');
        }
        if (ngaySinh !== undefined) {
            updates.push('ngaySinh = @ngaySinh');
        }
        if (noiSinh !== undefined) {
            updates.push('noiSinh = @noiSinh');
        }
        if (idTuyen !== undefined) {
            updates.push('idTuyen = @idTuyen');
        }
        if (diemDon !== undefined) {
            updates.push('diemDon = @diemDon');
        }
        if (trangThai !== undefined) {
            updates.push('trangThai = @trangThai');
        }

        if (updates.length === 0) {
            return res.json({
                success: true,
                message: 'Không có thông tin cần cập nhật'
            });
        }

        updateQuery += updates.join(', ') + ' WHERE idHocSinh = @id';

        // Thực hiện cập nhật
        const request = pool.request()
            .input('id', sql.Int, req.params.id);

        if (hoTen !== undefined) request.input('hoTen', sql.NVarChar, hoTen);
        if (lop !== undefined) request.input('lop', sql.NVarChar, lop);
        if (ngaySinh !== undefined) request.input('ngaySinh', sql.Date, ngaySinh);
        if (noiSinh !== undefined) request.input('noiSinh', sql.NVarChar, noiSinh);
        if (idTuyen !== undefined) request.input('idTuyen', sql.Int, idTuyen);
        if (diemDon !== undefined) request.input('diemDon', sql.Int, diemDon);
        if (trangThai !== undefined) request.input('trangThai', sql.Int, trangThai);

        await request.query(updateQuery);

        res.json({
            success: true,
            message: 'Cập nhật học sinh thành công!'
        });

    } catch (err) {
        console.error('Lỗi khi cập nhật học sinh:', err);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật học sinh: ' + err.message
        });
    }
});

// DELETE học sinh (cập nhật trạng thái)
app.delete('/api/students/:id', async (req, res) => {
    try {
        const pool = await poolPromise;
        if (!pool) return res.status(500).json({ success: false, message: 'Không thể kết nối DB' });

        // 1. Vô hiệu hóa học sinh (cập nhật trạng thái = 0)
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query(`
                UPDATE HOCSINH 
                SET trangThai = 0 
                WHERE idHocSinh = @id AND trangThai = 1
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy học sinh hoặc học sinh đã bị vô hiệu hóa'
            });
        }

        // 2. Vô hiệu hóa liên kết với phụ huynh (nếu có)
        await pool.request()
            .input('idHocSinh', sql.Int, req.params.id)
            .query(`
                -- Lấy các idPhuHuynh liên quan
                DECLARE @phuhuynhs TABLE (idPhuHuynh INT);
                INSERT INTO @phuhuynhs
                SELECT DISTINCT idPhuHuynh 
                FROM PHUHUYNH_HOCSINH
                WHERE idHocSinh = @idHocSinh;

                -- Xóa liên kết trong bảng mapping
                DELETE FROM PHUHUYNH_HOCSINH
                WHERE idHocSinh = @idHocSinh;

                -- Vô hiệu hóa phụ huynh không còn học sinh nào
                UPDATE PHUHUYNH
                SET trangThai = 0
                WHERE idPhuHuynh IN (
                    SELECT ph.idPhuHuynh
                    FROM @phuhuynhs ph
                    LEFT JOIN PHUHUYNH_HOCSINH phs ON ph.idPhuHuynh = phs.idPhuHuynh
                    WHERE phs.idPhuHuynh IS NULL
                );

                -- Vô hiệu hóa tài khoản của phụ huynh không còn học sinh
                UPDATE TAIKHOAN
                SET trangThai = 0
                WHERE idPhuHuynh IN (
                    SELECT idPhuHuynh
                    FROM PHUHUYNH
                    WHERE trangThai = 0
                );
            `);

        res.json({
            success: true,
            message: 'Đã vô hiệu hóa học sinh và cập nhật liên quan!'
        });

    } catch (err) {
        console.error('Lỗi khi xóa học sinh:', err);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa học sinh: ' + err.message
        });
    }
});

