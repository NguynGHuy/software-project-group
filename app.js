const express = require('express');
const { sql, poolPromise } = require('./config/database.js');
const session = require('express-session');
const app = express();
const port = 5000;

app.use(express.json());

// Session
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

app.use('/api/auth', authRouter);
app.use('/api/buses', busRouter);
app.use('/api/routes', routeRouter);
app.use('/api/students', studentRouter);
app.use('/api/stops', stopRouter);
app.use('/api/drivers', driverRouter);
app.use('/api/parents', parentRouter);
app.use('/api/schedules', scheduleRouter);


app.listen(port, () => {
    console.log(`Server đang chạy ở http://localhost:${port}`);
});

