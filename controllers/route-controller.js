const Route = require('../models/route-model.js');
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

// GET /api/routes
exports.getAllRoutes = async (req, res) => {
    try {
        const data = await Route.getAll();
        res.json({
            success: true,
            data: data
        });
    } catch (err) {
        console.error('Lỗi khi lấy danh sách tuyến:', err);
        res.status(500).json({
            success: false,
            message: 'Lỗi server: ' + err.message
        });
    }
};

// GET /api/routes/:id
exports.getRouteById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const route = await Route.getById(id);

        if (!route) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy tuyến xe'
            });
        }

        res.json({
            success: true,
            data: route
        });
    } catch (err) {
        console.error('Lỗi khi lấy thông tin tuyến:', err);
        res.status(500).json({
            success: false,
            message: 'Lỗi server: ' + err.message
        });
    }
};

// POST /api/routes
exports.createRoute = async (req, res) => {
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
        const routeData = { tenTuyen, gioBatDauStr, gioKetThucStr, diemDung };
        const newRoute = await Route.create(routeData);

        res.status(201).json({
            success: true,
            message: 'Thêm tuyến xe thành công!',
            data: newRoute
        });
    } catch (err) {
        console.error('Lỗi khi thêm tuyến xe:', err);
        res.status(500).json({
            success: false,
            message: 'Lỗi server: ' + err.message
        });
    }
};

// PUT /api/routes/:id
exports.updateRoute = async (req, res) => {
    const { tenTuyen, gioBatDau, gioKetThuc, diemDung } = req.body || {};
    const id = parseInt(req.params.id);

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

    try {
        const routeData = { tenTuyen, gioBatDauStr, gioKetThucStr, diemDung };
        const updatedRoute = await Route.update(id, routeData);

        res.json({
            success: true,
            message: 'Cập nhật tuyến xe thành công!',
            data: updatedRoute
        });
    } catch (err) {
        console.error('Lỗi khi cập nhật tuyến xe:', err);
        if (err.message === 'Không tìm thấy tuyến xe') {
            return res.status(404).json({ success: false, message: err.message });
        }
        res.status(500).json({
            success: false,
            message: 'Lỗi server: ' + err.message
        });
    }
};

// DELETE /api/routes/:id
exports.deleteRoute = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const deletedRoute = await Route.remove(id);
        res.json({
            success: true,
            message: 'Xóa tuyến xe thành công!',
            data: deletedRoute
        });
    } catch (err) {
        console.error('Lỗi khi xóa tuyến xe:', err);
        if (err.message.includes('đang được sử dụng')) {
            return res.status(400).json({ success: false, message: err.message });
        }
        if (err.message === 'Tuyến xe không tồn tại') {
            return res.status(404).json({ success: false, message: err.message });
        }
        res.status(500).json({
            success: false,
            message: 'Lỗi server: ' + err.message
        });
    }
};