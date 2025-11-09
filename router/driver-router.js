// router/driver-router.js
const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driver-controller.js');

// GET /api/drivers
router.get('/', driverController.getAllDrivers);

// GET /api/drivers/:id
router.get('/:id', driverController.getDriverById);

// POST /api/drivers
router.post('/', driverController.createDriver);

// PUT /api/drivers/:id
router.put('/:id', driverController.updateDriver);

// DELETE /api/drivers/:id
router.delete('/:id', driverController.deleteDriver);

module.exports = router;