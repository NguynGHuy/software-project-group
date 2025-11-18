// controllers/auth-controller.js
const { sql, poolPromise } = require('../config/database.js');

exports.login = async (req, res) => {
    const { username, password } = req.body || {};
    
    console.log('[v0] Login attempt:', { username });
    
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Thiếu username hoặc password' });
    }

    try {
        const pool = await poolPromise;
        
        const result = await pool.request()
            .input('username', sql.NVarChar, username)
            .input('password', sql.NVarChar, password)
            .query(`
                SELECT 
                    tk.idTaiKhoan,
                    tk.taiKhoan,
                    tk.vaiTro,
                    tk.idPhuHuynh,
                    tk.idTaiXe,
                    tk.idQuanLy,
                    ph.hoTen AS phuHuynhName,
                    ph.soDienThoai AS phuHuynhPhone,
                    tx.hoTen AS taiXeName,
                    tx.soDienThoai AS taiXePhone,
                    ql.hoTen AS quanLyName
                FROM TAIKHOAN tk
                LEFT JOIN PHUHUYNH ph ON tk.idPhuHuynh = ph.idPhuHuynh
                LEFT JOIN TAIXE tx ON tk.idTaiXe = tx.idTaiXe
                LEFT JOIN QUANLY ql ON tk.idQuanLy = ql.idQuanLy
                WHERE tk.taiKhoan = @username 
                  AND tk.matKhau = @password
                  AND tk.trangThai = 1
            `);
        
        console.log('[v0] Query result:', result.recordset.length, 'user(s) found');
        
        if (result.recordset.length === 0) {
            return res.json({ success: false, message: 'Sai thông tin đăng nhập!' });
        }

        const user = result.recordset[0];
        const role = user.vaiTro;
        
        let detail = {};
        if (role === 'PHU_HUYNH') {
            detail = {
                idPhuHuynh: user.idPhuHuynh,
                hoTen: user.phuHuynhName,
                soDienThoai: user.phuHuynhPhone
            };
        } else if (role === 'TAI_XE') {
            detail = {
                idTaiXe: user.idTaiXe,
                hoTen: user.taiXeName,
                soDienThoai: user.taiXePhone
            };
        } else if (role === 'QUAN_LY') {
            detail = {
                idQuanLy: user.idQuanLy,
                hoTen: user.quanLyName
            };
        }
        
        let redirectUrl = '';
        switch (role) {
            case 'PHU_HUYNH': redirectUrl = '/parent'; break;
            case 'TAI_XE': redirectUrl = '/driver'; break;
            case 'QUAN_LY': redirectUrl = '/admin'; break;
            default: redirectUrl = '/login';
        }

        req.session.user = {
            idTaiKhoan: user.idTaiKhoan,
            username: user.taiKhoan,
            role: user.vaiTro,
            detail: detail
        };

        console.log('[v0] Login successful:', req.session.user);
        
        res.json({
            success: true,
            user: req.session.user,
            redirectUrl: redirectUrl,
            message: `Đăng nhập thành công với vai trò ${role}`
        });

    } catch (err) {
        console.error('[v0] Login error:', err);
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Lỗi khi đăng xuất' });
        }
        res.clearCookie('connect.sid');
        res.json({ success: true, message: 'Đăng xuất thành công' });
    });
};
