require('dotenv').config();
require('./Controller/passportConfig');
require("./Scheduler/safetyCheckinJob");

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const DB = require('./DB/connection');
const router = require('./Routes/router');
const passport = require('passport');
const session = require('express-session');
const sosAlertController = require('./Controller/sosAlertController');

const serverApp = express();
const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(serverApp);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:8081',
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
      lat,
      lng,
      timestamp: Date.now()
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
  cookie: { secure: false },
}));

serverApp.use(express.json());
serverApp.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8081'
}));
serverApp.use(passport.initialize());
serverApp.use(passport.session());
serverApp.use(router);
serverApp.use('/Uploads', express.static('./Uploads'));

serverApp.get('/', (req, res) => {
  res.send("Welcome to NeoAegis Backend Server");
});

httpServer.listen(PORT, () => {
  console.log("NeoAegis Server running on PORT " + PORT);
});


