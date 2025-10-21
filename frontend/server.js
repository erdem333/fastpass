import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

// Middleware to parse JSON bodies - MUST be BEFORE API proxy!
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// API proxy middleware - MUST be BEFORE static files!
app.use('/api', async (req, res) => {
  try {
    // Construct the backend URL correctly
    const backendUrl = `${BACKEND_URL}${req.originalUrl}`;
    
    console.log(`[PROXY] ${req.method} ${req.originalUrl}`);
    console.log(`[PROXY] URL: ${backendUrl}`);
    
    const fetchOptions = {
      method: req.method,
      headers: {
        // Forward headers but remove host to avoid issues
        ...Object.fromEntries(
          Object.entries(req.headers).filter(([key]) => 
            !['host', 'connection'].includes(key.toLowerCase())
          )
        )
      }
    };

    // Add body for POST/PUT/PATCH requests
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      if (req.body && Object.keys(req.body).length > 0) {
        const bodyString = JSON.stringify(req.body);
        fetchOptions.body = bodyString;
        fetchOptions.headers['Content-Type'] = 'application/json';
        console.log(`[PROXY] Request Body: ${bodyString}`);
      } else {
        console.log(`[PROXY] No request body`);
      }
    }

    const response = await fetch(backendUrl, fetchOptions);
    const contentType = response.headers.get('content-type');
    const data = contentType?.includes('application/json') 
      ? await response.json() 
      : await response.text();

    res.status(response.status);
    res.set('Content-Type', contentType || 'application/json');
    res.send(data);
    
    console.log(`[PROXY] Response: ${response.status}`);
  } catch (error) {
    console.error('[PROXY] Error:', error.message);
    res.status(502).json({ 
      error: 'Bad Gateway', 
      details: error.message,
      backend: BACKEND_URL 
    });
  }
});

// Serve static files from Angular build (AFTER API proxy!)
const distPath = path.join(__dirname, 'dist/fastpass-frontend');
app.use(express.static(distPath));

// Fallback to index.html for Angular routing (MUST be LAST!)
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  console.log(`[STATIC] Serving ${req.path}`);
  res.sendFile(indexPath);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 FastPass Frontend running on http://localhost:${PORT}`);
  console.log(`📡 Backend URL: ${BACKEND_URL}`);
  console.log(`📂 Static files: ${distPath}`);
});
