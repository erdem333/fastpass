import express from 'express';
import UserPlatformConfig from '../models/UserPlatformConfig.js';
import { authMiddleware } from '../middleware/auth.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Get all configurations for current user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

    const configs = await UserPlatformConfig.find({ userId: decoded.userId }).populate('platformId');
    res.json(configs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching configurations' });
  }
});

// Get configuration for a specific platform
router.get('/platform/:platformId', authMiddleware, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

    const config = await UserPlatformConfig.findOne({
      userId: decoded.userId,
      platformId: req.params.platformId
    }).populate('platformId');

    if (!config) {
      return res.status(404).json({ error: 'Configuration not found' });
    }

    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching configuration' });
  }
});

// Create or update a configuration
router.post('/platform/:platformId', authMiddleware, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const { eventIds, webhookConfig } = req.body;

    let config = await UserPlatformConfig.findOne({
      userId: decoded.userId,
      platformId: req.params.platformId
    });

    if (!config) {
      config = new UserPlatformConfig({
        userId: decoded.userId,
        platformId: req.params.platformId,
        eventIds: eventIds || [],
        webhookConfig: webhookConfig || null
      });
    } else {
      if (eventIds !== undefined) {
        config.eventIds = eventIds;
      }
      if (webhookConfig !== undefined) {
        config.webhookConfig = webhookConfig;
      }
    }

    await config.save();
    res.json(config);
  } catch (error) {
    console.error('Configuration error:', error);
    res.status(500).json({ error: 'Error saving configuration' });
  }
});

// Add event ID
router.post('/platform/:platformId/event', authMiddleware, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ error: 'Event ID required' });
    }

    let config = await UserPlatformConfig.findOne({
      userId: decoded.userId,
      platformId: req.params.platformId
    });

    if (!config) {
      config = new UserPlatformConfig({
        userId: decoded.userId,
        platformId: req.params.platformId,
        eventIds: [eventId]
      });
    } else {
      if (!config.eventIds.includes(eventId)) {
        config.eventIds.push(eventId);
      }
    }

    await config.save();
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Error adding event ID' });
  }
});

// Remove event ID
router.delete('/platform/:platformId/event/:eventId', authMiddleware, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

    const config = await UserPlatformConfig.findOne({
      userId: decoded.userId,
      platformId: req.params.platformId
    });

    if (!config) {
      return res.status(404).json({ error: 'Configuration not found' });
    }

    config.eventIds = config.eventIds.filter(id => id !== req.params.eventId);
    await config.save();
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Error deleting event ID' });
  }
});

// Update webhook configuration
router.post('/platform/:platformId/webhook', authMiddleware, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const { presetName, webhookUrl, color, footerText, logoUrl } = req.body;

    let config = await UserPlatformConfig.findOne({
      userId: decoded.userId,
      platformId: req.params.platformId
    });

    if (!config) {
      config = new UserPlatformConfig({
        userId: decoded.userId,
        platformId: req.params.platformId,
        webhookConfig: {
          presetName,
          webhookUrl,
          color,
          footerText,
          logoUrl
        }
      });
    } else {
      config.webhookConfig = {
        presetName,
        webhookUrl,
        color,
        footerText,
        logoUrl
      };
    }

    await config.save();
    res.json(config);
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Error saving webhook configuration' });
  }
});

export default router;
