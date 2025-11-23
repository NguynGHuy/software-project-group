import Student from '../models/student-model.js';

export const getAllStudents = async (req, res) => {
    try {
        const data = await Student.getAll();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
};

export const getStudentById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const student = await Student.getById(id);
        if (!student) return res.status(404).json({ success: false, message: 'Không tìm thấy học sinh' });
        res.json({ success: true, data: student });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
};

export const createStudent = async (req, res) => {
    const { hoTen, lop, idTuyen } = req.body || {};
    if (!hoTen || !lop || !idTuyen) return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });

    try {
        const newStudent = await Student.create(req.body);
        res.status(201).json({ success: true, message: 'Thêm học sinh thành công!', data: newStudent });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
};

export const updateStudent = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await Student.update(id, req.body);
        res.json({ success: true, message: result.message, data: { idHocSinh: id } });
    } catch (err) {
        if (err.message === 'Không tìm thấy học sinh') return res.status(404).json({ success: false, message: err.message });
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
};

export const deleteStudent = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await Student.remove(id);
        res.json({ success: true, message: result.message });
    } catch (err) {
        if (err.message.includes('Không tìm thấy')) return res.status(404).json({ success: false, message: err.message });
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
};

export const getParentsForStudent = async (req, res) => {
    try {
        const studentId = parseInt(req.params.id);
        const parents = await Student.getLinkedParents(studentId);
        res.json({ success: true, data: parents });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
    }
};