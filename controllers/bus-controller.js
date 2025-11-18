// controllers/bus-controller.js
const Bus = require('../models/bus-model.js'); // <-- Import Model

// GET /api/buses
exports.getAllBuses = async (req, res) => {
    try {
        const data = await Bus.getAll();
        res.json({
            success: true,
            data: data
        });
    } catch (err) {
        console.error('Lỗi khi lấy danh sách xe bus:', err);
        res.status(500).json({
            success: false,
            message: 'Lỗi server: ' + err.message
        });
    }
};

// GET /api/buses/:id
exports.getBusById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const bus = await Bus.getById(id);

        if (!bus) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy xe bus'
            });
        }

        res.json({
            success: true,
            data: bus
        });
    } catch (err) {
        console.error('Lỗi khi lấy thông tin xe bus:', err);
        res.status(500).json({
            success: false,
            message: 'Lỗi server: ' + err.message
        });
    }
};

// POST /api/buses
exports.createBus = async (req, res) => {
    const { bienSo, sucChua } = req.body || {};

    // Validate đầu vào
    if (!bienSo || !sucChua) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin bắt buộc (bienSo, sucChua)'
        });
    }

    try {
        const newBus = await Bus.create({ bienSo, sucChua });
        res.status(201).json({
            success: true,
            message: 'Thêm xe bus thành công!',
            data: newBus
        });
    } catch (err) {
        console.error('Lỗi khi thêm xe bus:', err);
        // Bắt lỗi cụ thể từ Model
        if (err.message === 'Biển số xe đã tồn tại') {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
        res.status(500).json({
            success: false,
            message: 'Lỗi server: ' + err.message
        });
    }
};

// PUT /api/buses/:id
exports.updateBus = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const updatedData = await Bus.update(id, req.body);

        // Trường hợp không có gì update
        if (updatedData.message) {
            return res.json({
                success: true,
                message: updatedData.message
            });
        }

        res.json({
            success: true,
            message: 'Cập nhật xe bus thành công!',
            data: updatedData
        });
    } catch (err) {
        console.error('Lỗi khi cập nhật xe bus:', err);
        if (err.message === 'Không tìm thấy xe bus') {
            return res.status(404).json({ success: false, message: err.message });
        }
        if (err.message === 'Biển số xe đã tồn tại') {
            return res.status(400).json({ success: false, message: err.message });
        }
        res.status(500).json({
            success: false,
            message: 'Lỗi server: ' + err.message
        });
    }
};

// DELETE /api/buses/:id
exports.deleteBus = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const deletedBus = await Bus.remove(id);

        res.json({
            success: true,
            message: 'Đã vô hiệu hóa xe bus thành công!',
            data: deletedBus
        });
    } catch (err) {
        console.error('Lỗi khi xóa xe bus:', err);
        if (err.message.includes('Không tìm thấy') || err.message.includes('đã bị vô hiệu hóa')) {
            return res.status(404).json({ success: false, message: err.message });
        }
        if (err.message.includes('đang được sử dụng')) {
            return res.status(400).json({ success: false, message: err.message });
        }
        res.status(500).json({
            success: false,
            message: 'Lỗi server: ' + err.message
        });
    }
};
