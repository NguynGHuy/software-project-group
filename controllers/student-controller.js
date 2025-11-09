// controllers/student-controller.js
const Student = require('../models/student-model.js'); // <-- Import Model

// GET /api/students
exports.getAllStudents = async (req, res) => {
    try {
        const data = await Student.getAll();
        res.json({
            success: true,
            data: data
        });
    } catch (err) {
        console.error('Lỗi khi lấy danh sách học sinh:', err);
        res.status(500).json({
            success: false,
            message: 'Lỗi server: ' + err.message
        });
    }
};

// GET /api/students/:id
exports.getStudentById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const student = await Student.getById(id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy học sinh'
            });
        }

        res.json({
            success: true,
            data: student
        });
    } catch (err) {
        console.error('Lỗi khi lấy thông tin học sinh:', err);
        res.status(500).json({
            success: false,
            message: 'Lỗi server: ' + err.message
        });
    }
};

// POST /api/students
exports.createStudent = async (req, res) => {
    const { hoTen, lop, idTuyen, diemDon } = req.body || {};

    // Validate đầu vào
    if (!hoTen || !lop || !idTuyen || !diemDon) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin bắt buộc (hoTen, lop, idTuyen, diemDon)'
        });
    }

    try {
        const newStudent = await Student.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Thêm học sinh thành công!',
            data: {
                idHocSinh: newStudent.idHocSinh
            }
        });
    } catch (err) {
        console.error('Lỗi khi thêm học sinh:', err);
        res.status(500).json({
            success: false,
            message: 'Lỗi server: ' + err.message
        });
    }
};

// PUT /api/students/:id
exports.updateStudent = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await Student.update(id, req.body);

        res.json({
            success: true,
            message: result.message // "Cập nhật thành công" hoặc "Không có gì..."
        });

    } catch (err) {
        console.error('Lỗi khi cập nhật học sinh:', err);
        if (err.message === 'Không tìm thấy học sinh') {
            return res.status(404).json({ success: false, message: err.message });
        }
        res.status(500).json({
            success: false,
            message: 'Lỗi server: ' + err.message
        });
    }
};

// DELETE /api/students/:id
exports.deleteStudent = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await Student.remove(id);

        res.json({
            success: true,
            message: result.message
        });

    } catch (err) {
        console.error('Lỗi khi xóa học sinh:', err);
        if (err.message.includes('Không tìm thấy') || err.message.includes('đã bị vô hiệu hóa')) {
            return res.status(404).json({ success: false, message: err.message });
        }
        res.status(500).json({
            success: false,
            message: 'Lỗi server: ' + err.message
        });
    }
};

// GET /api/students/:id/parents
exports.getParentsForStudent = async (req, res) => {
    try {
        const studentId = parseInt(req.params.id);
        const parents = await Student.getLinkedParents(studentId);
        res.json({ success: true, data: parents });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
};