const express = require('express');
const router = express.Router();
const stopController = require('../controllers/stop-controller.js');

// GET /api/stops
router.get('/', stopController.getAllStops);

// GET /api/stops/:id
router.get('/:id', stopController.getStopById);

// POST /api/stops
router.post('/', stopController.createStop);

// PUT /api/stops/:id
router.put('/:id', stopController.updateStop);

// DELETE /api/stops/:id
router.delete('/:id', stopController.deleteStop);

module.exports = router;