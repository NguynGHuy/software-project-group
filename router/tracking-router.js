const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/tracking-controller.js');

router.post('/location', trackingController.updateBusLocation);
router.get('/location/:idXeBus', trackingController.getBusLocation);

module.exports = router;
