require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
// In-memory store for shortened URLs
let urlDatabase = [];
let id = 1; // Simple ID to generate short URLs

// Helper function to validate URLs
const isValidUrl = (inputUrl) => {
  const urlPattern = /^https?:\/\/(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+\/?$/;
  return urlPattern.test(inputUrl);
};

// POST route to create a shortened URL
app.use(express.urlencoded({ extended: true }));
app.post('/api/shorturl', (req, res) => {
  console.log(req.body);
  const originalUrl = req.body.url;

  if (!isValidUrl(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  urlDatabase.push({ original_url: originalUrl, short_url: id });

  return res.json({
    original_url: originalUrl,
    short_url: id++
  });
});

// GET route to redirect to the original URL
app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = parseInt(req.params.short_url);

  // Look up the original URL by the short URL ID
  const urlEntry = urlDatabase.find(entry => entry.short_url === shortUrl);

  if (urlEntry) {
    // Redirect to the original URL
    res.redirect(urlEntry.original_url);
  } else {
    res.json({ error: 'No short URL found' });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
