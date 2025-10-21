import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database.js';
import { PLATFORMS_DATA } from './config/platforms.js';
import Platform from './models/Platform.js';

// Route imports
import authRoutes from './routes/auth.js';
import platformRoutes from './routes/platforms.js';
import userConfigRoutes from './routes/userConfig.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Improved CORS configuration for local dev and Railway production
const frontendUrl = process.env.FRONTEND_URL;
const allowedOrigins = [
  frontendUrl,  // Railway production frontend
  'http://localhost:4200',  // Local dev Angular
  'http://localhost:3000',  // Local dev backend
  // Add any other allowed origins here
].filter(url => url); // Remove empty/undefined entries

console.log('');
console.log('╔════════════════════════════════════════════════════╗');
console.log('║         CORS CONFIGURATION                         ║');
console.log('╚════════════════════════════════════════════════════╝');
console.log('FRONTEND_URL env var:', frontendUrl ? '✅ SET' : '❌ NOT SET');
if (frontendUrl) {
  console.log('  Value:', frontendUrl);
} else {
  console.warn('  ⚠️  FRONTEND_URL not set! Only localhost allowed.');
}
console.log('');
console.log('Allowed Origins:', allowedOrigins);
console.log('');

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or server requests)
    if (!origin) {
      console.log('✅ CORS: Request without origin (allowed)');
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      console.log(`✅ CORS: Origin allowed: ${origin}`);
      callback(null, true);
    } else {
      console.warn(`❌ CORS blocked origin: ${origin}`);
      console.warn(`   Allowed: ${allowedOrigins.join(', ')}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Connect to MongoDB
await connectDB();

// Initialize platforms in database
const initializePlatforms = async () => {
  try {
    const existingCount = await Platform.countDocuments();
    
    if (existingCount === 0) {
      await Platform.insertMany(PLATFORMS_DATA);
      console.log(`✅ ${PLATFORMS_DATA.length} platforms added`);
    }
  } catch (error) {
    console.error('Error initializing platforms:', error);
  }
};

await initializePlatforms();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/platforms', platformRoutes);
app.use('/api/config', userConfigRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 FastPass Backend running on http://localhost:${PORT}`);
});
