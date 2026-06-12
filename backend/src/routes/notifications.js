const express = require('express');
const { sendToDevice, sendToDevices } = require('../services/notificationService');

const router = express.Router();

/**
 * POST /api/notifications/send
 * Body: { token, title, body, data? }
 */
router.post('/send', async (req, res) => {
  try {
    const { token, title, body, data } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'token is required' });
    }
    if (!title || !body) {
      return res.status(400).json({ error: 'title and body are required' });
    }

    const result = await sendToDevice({ token, title, body, data });
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Send notification failed:', error);
    res.status(500).json({
      error: 'Failed to send notification',
      details: error.message,
    });
  }
});

/**
 * POST /api/notifications/send-multicast
 * Body: { tokens: string[], title, body, data? }
 */
router.post('/send-multicast', async (req, res) => {
  try {
    const { tokens, title, body, data } = req.body;

    if (!Array.isArray(tokens) || tokens.length === 0) {
      return res.status(400).json({ error: 'tokens must be a non-empty array' });
    }
    if (!title || !body) {
      return res.status(400).json({ error: 'title and body are required' });
    }

    const result = await sendToDevices({ tokens, title, body, data });
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Multicast notification failed:', error);
    res.status(500).json({
      error: 'Failed to send notifications',
      details: error.message,
    });
  }
});

module.exports = router;
