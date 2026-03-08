require('dotenv').config();
require('./Controller/passportConfig');
require("./Scheduler/safetyCheckinJob");

const express    = require('express');
const cors       = require('cors');
const http       = require('http');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');
const { Server } = require('socket.io');
const DB         = require('./DB/connection');
const router     = require('./Routes/router');
const passport   = require('passport');
const session    = require('express-session');
const sosAlertController = require('./Controller/sosAlertController');

const serverApp = express();
const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(serverApp);

// Security headers
serverApp.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST']
  }
});

sosAlertController.setIO(io);

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join-sos-room', (userId) => {
    socket.join(`sos-${userId}`);
    console.log(`User ${userId} joined SOS room`);
  });

  socket.on('location-update', ({ userId, lat, lng }) => {
    io.to(`sos-${userId}`).emit('user-location', {
      lat, lng, timestamp: Date.now()
    });
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

serverApp.use(session({
  secret: process.env.SESSION_SECRET || 'NeoAegis_2024',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' },
}));

serverApp.use(express.json());
serverApp.use(cors({
  origin: process.env.FRONTEND_URL
}));

// Rate limiting on auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many attempts. Please try again after 15 minutes." }
});
serverApp.use('/api/login',    authLimiter);
serverApp.use('/api/register', authLimiter);

serverApp.use(passport.initialize());
serverApp.use(passport.session());

serverApp.use('/auth', require('./Routes/authRouter'));
// ✅ All routes now under /api prefix
serverApp.use('/api', router);

serverApp.use('/Uploads', express.static('./Uploads'));

serverApp.get('/', (req, res) => {
  res.send("Welcome to NeoAegis Backend Server");
});

httpServer.listen(PORT, () => {
  console.log("NeoAegis Server running on PORT " + PORT);
});