const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parent-controller.js');

// GET /api/parents
router.get('/', parentController.getAllParents);

// GET /api/parents/:id
router.get('/:id', parentController.getParentById);

// POST /api/parents
router.post('/', parentController.createParent);

// PUT /api/parents/:id
router.put('/:id', parentController.updateParent);

// DELETE /api/parents/:id
router.delete('/:id', parentController.deleteParent);

// GET /api/parents/:id/students (Lấy học sinh của 1 phụ huynh)
router.get('/:id/students', parentController.getStudentsForParent);

// POST /api/parents/:id/students (Gán học sinh cho phụ huynh)
router.post('/:id/students', parentController.linkStudentToParent);

// DELETE /api/parents/:parentId/students/:studentId (Hủy liên kết)
router.delete('/:parentId/students/:studentId', parentController.unlinkStudentFromParent);

module.exports = router;