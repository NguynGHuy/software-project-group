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
    console.log('[v0] Received student data:', req.body);
    
    const { hoTen, lop, idTuyen, diemDon } = req.body || {};

    if (!hoTen || !lop || !idTuyen) {
        console.log('[v0] Validation failed:', { hoTen, lop, idTuyen });
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin bắt buộc (hoTen, lop, idTuyen)'
        });
    }

    try {
        console.log('[v0] Creating student with data:', req.body);
        const newStudent = await Student.create(req.body);
        console.log('[v0] Student created successfully:', newStudent);
        res.status(201).json({
            success: true,
            message: 'Thêm học sinh thành công!',
            data: {
                idHocSinh: newStudent.idHocSinh
            }
        });
    } catch (err) {
        console.error('[v0] Lỗi khi thêm học sinh:', err);
        console.error('[v0] Stack trace:', err.stack);
        res.status(500).json({
            success: false,
            message: 'Lỗi server: ' + err.message
        });
    }
};

// PUT /api/students/:id
exports.updateStudent = async (req, res) => {
    console.log('[v0] Update student request:', {
        id: req.params.id,
        body: req.body
    });

    const { hoTen, lop, idTuyen } = req.body || {};

    if (!hoTen || !lop || !idTuyen) {
        console.log('[v0] Update validation failed:', { hoTen, lop, idTuyen });
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin bắt buộc (hoTen, lop, idTuyen)'
        });
    }

    try {
        const id = parseInt(req.params.id);
        const result = await Student.update(id, req.body);

        res.json({
            success: true,
            message: result.message,
            data: {
                idHocSinh: id
            }
        });

    } catch (err) {
        console.error('[v0] Lỗi khi cập nhật học sinh:', err);
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
