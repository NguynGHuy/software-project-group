// controllers/auth-controller.js
const { sql, poolPromise } = require('../config/database.js');

exports.login = async (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Thiếu username hoặc password' });
    }

    try {
        const pool = await poolPromise;
        if (!pool) return res.status(500).json({ success: false, message: 'Không thể kết nối DB' });

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
        const role = account.vaiTro;

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

        let redirectUrl = '';
        switch (role) {
            case 'PHU_HUYNH': redirectUrl = '/phuhuynh/dashboard.html'; break;
            case 'TAI_XE': redirectUrl = '/taixe/dashboard.html'; break;
            case 'QUAN_LY': redirectUrl = '/quanly/dashboard.html'; break;
            default: redirectUrl = '/login.html';
        }

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
};

// Thêm hàm logout
exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Lỗi khi đăng xuất' });
        }
        res.clearCookie('connect.sid'); // Tên cookie session mặc định
        res.json({ success: true, message: 'Đăng xuất thành công' });
    });
};