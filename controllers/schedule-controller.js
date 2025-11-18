// controllers/schedule-controller.js
const Schedule = require('../models/schedule-model.js');

// POST /api/schedules
exports.createSchedule = async (req, res) => {
    // Giả sử idQuanLy lấy từ session người dùng đăng nhập
    // const idQuanLy = req.session.user.detail.idQuanLy; 
    const idQuanLy = 1; // Tạm thời hardcode, bạn PHẢI thay bằng session
    const { idTaiXe, idXe, ngayThucHien, idTuyen } = req.body;

    if (!idTaiXe || !idXe || !ngayThucHien || !idTuyen || !idQuanLy) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin bắt buộc (idTaiXe, idXe, ngayThucHien, idTuyen)'
        });
    }

    try {
        const scheduleData = { ...req.body, idQuanLy };
        const newSchedule = await Schedule.create(scheduleData);
        res.status(201).json({
            success: true,
            message: `Tạo lịch trình thành công, đã thêm ${newSchedule.soHocSinh} học sinh.`,
            data: newSchedule
        });
    } catch (err) {
        console.error(err);
        if (err.message.includes('FOREIGN KEY')) {
            return res.status(400).json({ success: false, message: 'Tài xế, Xe, hoặc Tuyến không tồn tại' });
        }
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
};

// GET /api/schedules
exports.getAllSchedules = async (req, res) => {
    try {
        const data = await Schedule.getAll();
        res.json({ success: true, data: data });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
};

// GET /api/schedules/:id
exports.getScheduleById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const schedule = await Schedule.getById(id);
        if (!schedule) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy lịch trình' });
        }
        res.json({ success: true, data: schedule });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
};

// PUT /api/schedules/:id/status
exports.updateScheduleStatus = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { status } = req.body; // VD: "IN_PROGRESS", "DONE", "CANCELLED"

        if (!status) {
            return res.status(400).json({ success: false, message: 'Thiếu trạng thái (status)' });
        }

        const updated = await Schedule.updateStatus(id, status);
        res.json({ success: true, message: 'Cập nhật trạng thái thành công', data: updated });
    } catch (err) {
        if (err.message.includes('Không tìm thấy')) {
            return res.status(404).json({ success: false, message: err.message });
        }
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
};

// PUT /api/schedules/:scheduleId/students/:studentId/attendance
exports.updateStudentAttendance = async (req, res) => {
    try {
        const { scheduleId, studentId } = req.params;
        const { status } = req.body; // VD: "DA_DON", "DA_TRA", "VANG"

        if (!status) {
            return res.status(400).json({ success: false, message: 'Thiếu trạng thái (status)' });
        }

        const updated = await Schedule.updateAttendance(
            parseInt(scheduleId),
            parseInt(studentId),
            status
        );

        res.json({ success: true, message: 'Cập nhật điểm danh thành công', data: updated });
    } catch (err) {
        if (err.message.includes('Không tìm thấy')) {
            return res.status(404).json({ success: false, message: err.message });
        }
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
};
