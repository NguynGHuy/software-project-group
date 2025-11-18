// router/route-router.js
const express = require('express');
const router = express.Router();
const routeController = require('../controllers/route-controller.js');

router.get('/', routeController.getAllRoutes);

// GET /api/routes/:id
router.get('/:id', routeController.getRouteById);

// POST /api/routes
router.post('/', routeController.createRoute);

// PUT /api/routes/:id
router.put('/:id', routeController.updateRoute);

// DELETE /api/routes/:id
router.delete('/:id', routeController.deleteRoute);

module.exports = router;
