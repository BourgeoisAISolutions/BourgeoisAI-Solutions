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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
