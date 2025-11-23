import Schedule from '../models/schedule-model.js';

export const createSchedule = async (req, res) => {
    const idQuanLy = 1; // Tạm thời hardcode, sau này lấy từ req.session.user
    const { idTaiXe, idXe, ngayThucHien, idTuyen } = req.body;

    if (!idTaiXe || !idXe || !ngayThucHien || !idTuyen) {
        return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
    }

    try {
        const newSchedule = await Schedule.create({ ...req.body, idQuanLy });
        res.status(201).json({ success: true, message: 'Tạo lịch trình thành công', data: newSchedule });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
};

export const getAllSchedules = async (req, res) => {
    try {
        const data = await Schedule.getAll();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
};

export const getScheduleById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const schedule = await Schedule.getById(id);
        if (!schedule) return res.status(404).json({ success: false, message: 'Không tìm thấy lịch trình' });
        res.json({ success: true, data: schedule });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
};

export const updateScheduleStatus = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { status } = req.body;
        if (!status) return res.status(400).json({ success: false, message: 'Thiếu status' });

        const updated = await Schedule.updateStatus(id, status);
        res.json({ success: true, message: 'Cập nhật trạng thái thành công', data: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
};

export const updateStudentAttendance = async (req, res) => {
    try {
        const { scheduleId, studentId } = req.params;
        const { status } = req.body;
        if (!status) return res.status(400).json({ success: false, message: 'Thiếu status' });

        const updated = await Schedule.updateAttendance(parseInt(scheduleId), parseInt(studentId), status);
        res.json({ success: true, message: 'Cập nhật điểm danh thành công', data: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
};