import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';

import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { initSocket, attachIoToRequest } from './socket/index.js';

import authRoutes from './routes/authRoutes.js';
import disasterRoutes from './routes/disasterRoutes.js';
import userRoutes from './routes/userRoutes.js';
import emergencyContactRoutes from './routes/emergencyContactRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

const allowedOrigins = [
  "http://localhost:5173",
  "https://real-time-disaster-alert-platform-cgxc-lsuz9u8sk.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

connectDB();
initSocket(io);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(attachIoToRequest(io));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'DisasterWatch API is running' });
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'DisasterWatch Backend Running'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/disasters', disasterRoutes);
app.use('/api/users', userRoutes);
app.use('/api/emergency-contacts', emergencyContactRoutes);
app.use('/api/stats', statsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { io };
