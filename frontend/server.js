import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

// Serve static files from Angular build
const distPath = path.join(__dirname, 'dist/fastpass-frontend');
app.use(express.static(distPath));

// API proxy middleware
app.use('/api', async (req, res) => {
  try {
    const url = new URL(req.url, BACKEND_URL);
    const response = await fetch(url.toString(), {
      method: req.method,
      headers: {
        ...req.headers,
        'Content-Type': 'application/json'
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined
    });

    const data = await response.text();
    res.status(response.status);
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
    res.send(data);
  } catch (error) {
    console.error('API proxy error:', error);
    res.status(500).json({ error: 'API request failed', details: error.message });
  }
});

// Fallback to index.html for Angular routing
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 FastPass Frontend running on http://localhost:${PORT}`);
  console.log(`📡 Backend URL: ${BACKEND_URL}`);
});
