const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { sql, poolPromise } = require('./config/database.js');
const session = require('express-session');
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const port = 5000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

app.use(session({
    secret: 'dev-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

const busRouter = require('./router/bus-router.js');
const routeRouter = require('./router/route-router.js');
const studentRouter = require('./router/student-router.js');
const authRouter = require('./router/auth-router.js');
const stopRouter = require('./router/stop-router.js');
const driverRouter = require('./router/driver-router.js');
const parentRouter = require('./router/parent-router.js');
const scheduleRouter = require('./router/schedule-router.js');
const trackingRouter = require('./router/tracking-router.js');

app.use('/api/auth', authRouter);
app.use('/api/buses', busRouter);
app.use('/api/routes', routeRouter);
app.use('/api/students', studentRouter);
app.use('/api/stops', stopRouter);
app.use('/api/drivers', driverRouter);
app.use('/api/parents', parentRouter);
app.use('/api/schedules', scheduleRouter);
app.use('/api/tracking', trackingRouter);

app.get('/', (req, res) => {
    res.json({ 
        message: 'SSB Backend API is running',
        version: '1.0.0',
        endpoints: [
            '/api/auth',
            '/api/buses',
            '/api/routes',
            '/api/students',
            '/api/stops',
            '/api/drivers',
            '/api/parents',
            '/api/schedules',
            '/api/tracking'
        ]
    });
});

app.use((err, req, res, next) => {
    console.error('[v0] Error:', err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.set('io', io);

io.on('connection', (socket) => {
    console.log(`[v0] Socket connected: ${socket.id}`);

    socket.on('driver:updateLocation', (data) => {
        console.log(`[v0] Location update from driver:`, data);
        io.emit('bus:locationUpdate', data);
    });

    socket.on('disconnect', () => {
        console.log(`[v0] Socket disconnected: ${socket.id}`);
    });
});

server.listen(port, () => {
    console.log(`Server đang chạy ở http://localhost:${port}`);
    console.log(`Kiểm tra API: http://localhost:${port}/`);
    console.log(`Socket.IO ready for real-time tracking`);
});
