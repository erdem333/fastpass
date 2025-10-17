import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getDiscordAuthUrl, exchangeCodeForToken, getDiscordUser } from '../config/discord.js';

const router = express.Router();

// Get Discord OAuth URL
router.get('/discord/login', (req, res) => {
  try {
    // Check if Discord credentials are set
    if (!process.env.DISCORD_CLIENT_ID) {
      console.error('DISCORD_CLIENT_ID not set in environment');
      return res.status(500).json({ error: 'Discord client ID not configured' });
    }
    if (!process.env.DISCORD_CLIENT_SECRET) {
      console.error('DISCORD_CLIENT_SECRET not set in environment');
      return res.status(500).json({ error: 'Discord client secret not configured' });
    }
    if (!process.env.DISCORD_REDIRECT_URI) {
      console.error('DISCORD_REDIRECT_URI not set in environment');
      return res.status(500).json({ error: 'Discord redirect URI not configured' });
    }

    const authUrl = getDiscordAuthUrl();
    console.log('Generated Discord Auth URL:', authUrl);
    res.json({ authUrl });
  } catch (error) {
    console.error('Error getting Discord auth URL:', error);
    res.status(500).json({ error: 'Error initiating Discord login' });
  }
});

// Discord OAuth Callback - GET (Discord redirects here with code as query param)
router.get('/discord/callback', async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).send('Authorization code missing. Please try logging in again.');
    }

    // Exchange code for access token
    const tokenData = await exchangeCodeForToken(code);

    // Get Discord user data
    const discordUser = await getDiscordUser(tokenData.access_token);

    // Find or create user
    let user = await User.findOne({ discordId: discordUser.id });

    if (!user) {
      user = new User({
        discordId: discordUser.id,
        username: discordUser.username,
        email: discordUser.email,
        avatar: discordUser.avatar,
        discriminator: discordUser.discriminator || '0',
        isAdmin: false
      });
      await user.save();
      console.log(`✅ New user created: ${discordUser.username}`);
    } else {
      // Update user information
      user.username = discordUser.username;
      user.email = discordUser.email;
      user.avatar = discordUser.avatar;
      user.discriminator = discordUser.discriminator || '0';
      await user.save();
      console.log(`✅ User logged in: ${discordUser.username}`);
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        discordId: user.discordId,
        isAdmin: user.isAdmin
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token as query parameter
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
    const redirectUrl = `${frontendUrl}/auth/login?token=${encodeURIComponent(token)}`;
    
    console.log(`✅ Token created for user ${discordUser.username}`);
    console.log(`✅ Redirecting to: ${redirectUrl}`);
    
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Discord OAuth error:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
    const errorHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Login Failed</title>
        </head>
        <body>
          <p>Authentication failed. Redirecting to login...</p>
          <script>
            window.location.href = '${frontendUrl}/auth/login?error=Authentication failed. Please try again.';
          </script>
        </body>
      </html>
    `;
    res.send(errorHtml);
  }
});

// Discord OAuth Callback - POST (for frontend to exchange code)
router.post('/discord/callback', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Authorization code required' });
    }

    // Exchange code for access token
    const tokenData = await exchangeCodeForToken(code);

    // Get Discord user data
    const discordUser = await getDiscordUser(tokenData.access_token);

    // Find or create user
    let user = await User.findOne({ discordId: discordUser.id });

    if (!user) {
      user = new User({
        discordId: discordUser.id,
        username: discordUser.username,
        email: discordUser.email,
        avatar: discordUser.avatar,
        discriminator: discordUser.discriminator || '0',
        isAdmin: false
      });
      await user.save();
      console.log(`✅ New user created: ${discordUser.username}`);
    } else {
      // Update user information
      user.username = discordUser.username;
      user.email = discordUser.email;
      user.avatar = discordUser.avatar;
      user.discriminator = discordUser.discriminator || '0';
      await user.save();
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        discordId: user.discordId,
        isAdmin: user.isAdmin
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        discordId: user.discordId,
        username: user.username,
        avatar: user.avatar,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Discord OAuth error:', error);
    res.status(500).json({ error: 'Authentication error. Please try again.' });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user._id,
      discordId: user.discordId,
      username: user.username,
      avatar: user.avatar,
      isAdmin: user.isAdmin
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
