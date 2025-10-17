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
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true
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
