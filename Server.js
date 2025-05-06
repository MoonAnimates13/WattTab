const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.static('public'));

app.get('/canvas', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).send('Missing URL');

  try {
    const decodedUrl = Buffer.from(q, 'base64').toString('utf-8');
    const response = await fetch(decodedUrl);
    const contentType = response.headers.get('content-type');

    res.setHeader('Content-Type', contentType || 'text/html');
    const body = await response.text();
    res.status(200).send(body);
  } catch (error) {
    console.error('Error fetching URL:', error.message);
    res.status(500).send('Error fetching the requested URL');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
