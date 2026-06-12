require('dotenv').config();

const cors = require('cors');
const express = require('express');
const { initializeFirebase } = require('./config/firebase');
const notificationsRouter = require('./routes/notifications');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/notifications', notificationsRouter);

try {
  initializeFirebase();
  console.log('Firebase Admin SDK initialized');
} catch (error) {
  console.error('Firebase initialization failed:', error.message);
  process.exit(1);
}

app.listen(port, () => {
  console.log(`Push notification server running at http://localhost:${port}`);
  console.log('Endpoints:');
  console.log('  GET  /health');
  console.log('  POST /api/notifications/send');
  console.log('  POST /api/notifications/send-multicast');
});
