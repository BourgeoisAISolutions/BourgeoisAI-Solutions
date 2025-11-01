const express = require('express');
const path = require('path');
const cleoChat = require('./api/cleo-chat');
const sendEmail = require('./api/send-email');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static('public'));

app.post('/api/cleo-chat', cleoChat);
app.post('/api/send-email', sendEmail);

app.post('/api/verify-license', async (req, res) => {
  const { licenseKey } = req.body;

  if (!licenseKey) {
    return res.status(400).json({ error: 'License key required' });
  }

  const GUMROAD_API_ACCESS_TOKEN = process.env.GUMROAD_API_ACCESS_TOKEN;

  if (!GUMROAD_API_ACCESS_TOKEN) {
    console.error('GUMROAD_API_ACCESS_TOKEN not configured');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const gumroadResponse = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        license_key: licenseKey,
        increment_uses_count: false,
        product_id: 'cmhgom0ot000g04jo21qkh16a'
      }),
    });

    const json = await gumroadResponse.json();

    if (gumroadResponse.ok && json.success && json.purchase) {
      res.json({ verified: true });
    } else {
      res.json({ verified: false });
    }
  } catch (error) {
    console.error('Error verifying license:', error);
    res.status(500).json({ error: 'Server error verifying license' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
