const express = require('express');
const router = express.Router();
const busController = require('../controllers/bus-controller.js');

// GET /api/buses
router.get('/', busController.getAllBuses);

// GET /api/buses/:id
router.get('/:id', busController.getBusById);

// POST /api/buses
router.post('/', busController.createBus);

// PUT /api/buses/:id
router.put('/:id', busController.updateBus);

// DELETE /api/buses/:id
router.delete('/:id', busController.deleteBus);

module.exports = router;
