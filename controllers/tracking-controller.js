const updateBusLocation = async (req, res) => {
    try {
        const { idXeBus, latitude, longitude, speed, heading } = req.body;

        if (!idXeBus || !latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: idXeBus, latitude, longitude'
            });
        }

        console.log('[v0] Received location update:', { idXeBus, latitude, longitude, speed, heading });

        const io = req.app.get('io');
        io.emit('bus:locationUpdate', {
            idXeBus,
            latitude,
            longitude,
            speed: speed || 0,
            heading: heading || 0,
            timestamp: new Date().toISOString()
        });

        res.json({
            success: true,
            message: 'Location updated successfully'
        });
    } catch (error) {
        console.error('[v0] Error updating location:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getBusLocation = async (req, res) => {
    try {
        const { idXeBus } = req.params;
        
        res.json({
            success: true,
            data: {
                idXeBus,
                latitude: 10.762622,
                longitude: 106.660172,
                speed: 0,
                heading: 0,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('[v0] Error getting location:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    updateBusLocation,
    getBusLocation
};
