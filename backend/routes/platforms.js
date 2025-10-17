import express from 'express';
import Platform from '../models/Platform.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all platforms (with filtering)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { category, country } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }
    if (country) {
      filter.country = country;
    }

    const platforms = await Platform.find(filter).sort({ category: 1, country: 1 });
    res.json(platforms);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching platforms' });
  }
});

// Get platform by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const platform = await Platform.findById(req.params.id);

    if (!platform) {
      return res.status(404).json({ error: 'Platform not found' });
    }

    res.json(platform);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching platform' });
  }
});

// Get platforms by category
router.get('/category/:category', authMiddleware, async (req, res) => {
  try {
    const platforms = await Platform.find({ category: req.params.category }).sort({ country: 1 });
    res.json(platforms);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching platforms' });
  }
});

export default router;
