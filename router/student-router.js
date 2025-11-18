const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student-controller.js');

// GET /api/students
router.get('/', studentController.getAllStudents);

// GET /api/students/:id
router.get('/:id', studentController.getStudentById);

// POST /api/students
router.post('/', studentController.createStudent);

// PUT /api/students/:id
router.put('/:id', studentController.updateStudent);

// DELETE /api/students/:id
router.delete('/:id', studentController.deleteStudent);

// GET /api/students/:id/parents (Lấy phụ huynh của 1 học sinh)
router.get('/:id/parents', studentController.getParentsForStudent);

module.exports = router;
