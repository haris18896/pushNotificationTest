const express = require('express');
const { sendToDevice, sendToDevices } = require('../services/notificationService');

const router = express.Router();

/**
 * @openapi
 * /api/notifications/send:
 *   post:
 *     tags:
 *       - Notifications
 *     summary: Send a push notification to one device
 *     description: Sends an FCM notification to a single device using its FCM token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendNotificationRequest'
 *     responses:
 *       200:
 *         description: Notification sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SendNotificationResponse'
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Failed to send notification
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @openapi
 * /api/notifications/send-multicast:
 *   post:
 *     tags:
 *       - Notifications
 *     summary: Send a push notification to multiple devices
 *     description: Sends the same FCM notification to multiple device tokens at once.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendMulticastRequest'
 *     responses:
 *       200:
 *         description: Multicast send completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SendMulticastResponse'
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Failed to send notifications
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
