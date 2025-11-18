// controllers/parent-controller.js
const Parent = require('../models/parent-model.js');

// GET /api/parents
exports.getAllParents = async (req, res) => {
    try {
        const data = await Parent.getAll();
        res.json({ success: true, data: data });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
};

// GET /api/parents/:id
exports.getParentById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const parent = await Parent.getById(id);
        if (!parent) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy phụ huynh' });
        }
        res.json({ success: true, data: parent });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
};

// POST /api/parents
exports.createParent = async (req, res) => {
    const { hoTen, taiKhoan, matKhau } = req.body;

    // Validate thông tin cơ bản
    if (!hoTen || !taiKhoan || !matKhau) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin bắt buộc (hoTen, taiKhoan, matKhau)'
        });
    }

    try {
        const newParent = await Parent.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Tạo phụ huynh và tài khoản thành công',
            data: newParent
        });
    } catch (err) {
        if (err.message.includes('đã tồn tại')) {
            return res.status(400).json({ success: false, message: err.message });
        }
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
};

// PUT /api/parents/:id
exports.updateParent = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const updatedParent = await Parent.update(id, req.body);
        res.json({
            success: true,
            message: 'Cập nhật thông tin phụ huynh thành công',
            data: updatedParent
        });
    } catch (err) {
        if (err.message === 'Không tìm thấy phụ huynh') {
            return res.status(404).json({ success: false, message: err.message });
        }
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
};

// DELETE /api/parents/:id
exports.deleteParent = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await Parent.remove(id);
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

// GET /api/parents/:id/students
exports.getStudentsForParent = async (req, res) => {
    try {
        const parentId = parseInt(req.params.id);
        const students = await Parent.getLinkedStudents(parentId);
        res.json({ success: true, data: students });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
};

// POST /api/parents/:id/students
exports.linkStudentToParent = async (req, res) => {
    try {
        const parentId = parseInt(req.params.id);
        const { studentId } = req.body; // Lấy studentId từ body

        if (!studentId) {
            return res.status(400).json({ success: false, message: 'Thiếu studentId' });
        }

        const result = await Parent.linkStudent(parentId, parseInt(studentId));
        res.status(201).json({ success: true, message: result.message });
    } catch (err) {
        if (err.message.includes('đã được liên kết')) {
            return res.status(400).json({ success: false, message: err.message });
        }
        // Lỗi Foreign Key (nếu parentId hoặc studentId không tồn tại)
        if (err.message.includes('FOREIGN KEY')) {
            return res.status(404).json({ success: false, message: 'Phụ huynh hoặc Học sinh không tồn tại' });
        }
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
};

// DELETE /api/parents/:parentId/students/:studentId
exports.unlinkStudentFromParent = async (req, res) => {
    try {
        const parentId = parseInt(req.params.parentId);
        const studentId = parseInt(req.params.studentId);

        const result = await Parent.unlinkStudent(parentId, studentId);
        res.json({ success: true, message: result.message });
    } catch (err) {
        if (err.message.includes('Không tìm thấy')) {
            return res.status(404).json({ success: false, message: err.message });
        }
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
};
