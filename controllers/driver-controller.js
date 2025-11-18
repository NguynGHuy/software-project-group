// controllers/driver-controller.js
const Driver = require('../models/driver-model.js');

// GET /api/drivers
exports.getAllDrivers = async (req, res) => {
    try {
        const data = await Driver.getAll();
        res.json({ success: true, data: data });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
};

// GET /api/drivers/:id
exports.getDriverById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const driver = await Driver.getById(id);
        if (!driver) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy tài xế' });
        }
        res.json({ success: true, data: driver });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
};

// POST /api/drivers
exports.createDriver = async (req, res) => {
    const { hoTen, taiKhoan, matKhau } = req.body;

    // Validate thông tin cơ bản
    if (!hoTen || !taiKhoan || !matKhau) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin bắt buộc (hoTen, taiKhoan, matKhau)'
        });
    }

    try {
        const newDriver = await Driver.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Tạo tài xế và tài khoản thành công',
            data: newDriver
        });
    } catch (err) {
        // Lỗi từ model
        if (err.message.includes('đã tồn tại')) {
            return res.status(400).json({ success: false, message: err.message });
        }
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
};

// PUT /api/drivers/:id
exports.updateDriver = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const updatedDriver = await Driver.update(id, req.body);
        res.json({
            success: true,
            message: 'Cập nhật thông tin tài xế thành công',
            data: updatedDriver
        });
    } catch (err) {
        if (err.message === 'Không tìm thấy tài xế') {
            return res.status(404).json({ success: false, message: err.message });
        }
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
};

// DELETE /api/drivers/:id
exports.deleteDriver = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await Driver.remove(id);
        res.json({ success: true, message: result.message });
    } catch (err) {
        if (err.message.includes('Không thể vô hiệu hóa')) {
            return res.status(400).json({ success: false, message: err.message });
        }
        if (err.message.includes('Không tìm thấy')) {
            return res.status(404).json({ success: false, message: err.message });
        }
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
};
