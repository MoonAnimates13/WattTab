const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// Proxy route
app.get('/canvas', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).send('Missing URL');

  try {
    const decodedUrl = Buffer.from(q, 'base64').toString('utf-8');
    const response = await fetch(decodedUrl);
    const contentType = response.headers.get('content-type') || 'text/html';

    res.setHeader('Content-Type', contentType);
    const body = await response.text();
    res.status(200).send(body);
  } catch (err) {
    console.error('Proxy error:', err.message);
    res.status(500).send('Internal Proxy Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
