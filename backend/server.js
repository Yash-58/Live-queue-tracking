import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, isConnectedToDB } from './config/db.js';
import { setupSocketIO } from './socket/socketHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();

// Connect to MongoDB
connectDB();

// Import Routes
import authRoutes from './routes/authRoutes.js';
import superAdminRoutes from './routes/superAdminRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import queueRoutes from './routes/queueRoutes.js';

const app = express();
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Attach io to req for controllers to emit events
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup Real-time Sockets
setupSocketIO(io);

// Root status routes so visiting in browser shows clean status instead of "Cannot GET /"
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: '🏥 MediQueue Backend API & Socket Server is Running',
    database: isConnectedToDB() ? 'MongoDB Connected' : 'Offline Demo Mode (Ready)',
    health: '/api/health',
    timestamp: new Date().toISOString()
  });
});

app.get('/api', (req, res) => {
  res.json({
    status: 'online',
    message: 'MediQueue API Root',
    endpoints: ['/api/health', '/api/auth', '/api/super-admin', '/api/admin', '/api/doctor', '/api/patient', '/api/queue']
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'MediQueue Backend API',
    database: isConnectedToDB() ? 'MongoDB Connected' : 'Offline Demo Mode (Ready)',
    socket: 'Active'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/queue', queueRoutes);

// Error Handling Middleware
app.use(errorHandler);

const DEFAULT_PORT = parseInt(process.env.PORT || '5001', 10);
let currentPort = DEFAULT_PORT;

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE' || err.code === 'EACCES') {
    currentPort += 1;
    console.warn(`⚠️ Port ${currentPort - 1} unavailable (${err.code}). Trying fallback port ${currentPort}...`);
    setTimeout(() => {
      server.listen(currentPort, '0.0.0.0');
    }, 500);
  } else {
    console.error('Server error:', err);
  }
});

server.on('listening', () => {
  const address = server.address();
  const port = typeof address === 'string' ? address : address?.port;
  console.log(`=======================================================`);
  console.log(`🏥 MediQueue Backend Server Running on Port ${port}`);
  console.log(`📡 Real-time Socket.IO Server Ready`);
  console.log(`🛡️  Super Admin & 1-to-1 Mapping Governance Active`);
  console.log(`=======================================================`);
});

server.listen(DEFAULT_PORT, '0.0.0.0');
