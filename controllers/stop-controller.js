// controllers/stop-controller.js
const Stop = require('../models/stop-model.js');

// GET /api/stops
exports.getAllStops = async (req, res) => {
    try {
        const data = await Stop.getAll();
        res.json({ success: true, data: data });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
};

// GET /api/stops/:id
exports.getStopById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const stop = await Stop.getById(id);
        if (!stop) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy điểm dừng' });
        }
        res.json({ success: true, data: stop });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
};

// POST /api/stops
exports.createStop = async (req, res) => {
    const { idDiemDung, tenDiemDung } = req.body;
    // Bảng DIEMDUNG có id không tự tăng, nên phải cung cấp
    if (idDiemDung === undefined || !tenDiemDung) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin bắt buộc (idDiemDung, tenDiemDung)'
        });
    }

    try {
        const newStop = await Stop.create(req.body);
        res.status(201).json({ success: true, data: newStop });
    } catch (err) {
        // Lỗi Primary Key (PK)
        if (err.message.includes('PRIMARY KEY')) {
            return res.status(400).json({ success: false, message: 'ID Điểm dừng đã tồn tại' });
        }
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
};

// PUT /api/stops/:id
exports.updateStop = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const updatedStop = await Stop.update(id, req.body);
        res.json({ success: true, message: 'Cập nhật thành công', data: updatedStop });
    } catch (err) {
        if (err.message === 'Không tìm thấy điểm dừng') {
            return res.status(404).json({ success: false, message: err.message });
        }
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
};

// DELETE /api/stops/:id
exports.deleteStop = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const deletedStop = await Stop.remove(id);
        res.json({ success: true, message: 'Xóa điểm dừng thành công', data: deletedStop });
    } catch (err) {
        if (err.message.includes('đang được sử dụng')) {
            return res.status(400).json({ success: false, message: err.message });
        }
        if (err.message === 'Không tìm thấy điểm dừng') {
            return res.status(404).json({ success: false, message: err.message });
        }
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
};
