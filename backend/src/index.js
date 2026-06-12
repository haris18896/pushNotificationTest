require('dotenv').config();

const cors = require('cors');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { initializeFirebase } = require('./config/firebase');
const swaggerSpec = require('./config/swagger');
const notificationsRouter = require('./routes/notifications');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'Push Notification API',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
  },
}));

app.get('/api-docs.json', (_req, res) => {
  res.json(swaggerSpec);
});

/**
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Health check
 *     description: Returns server status.
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
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
  console.log(`Swagger UI: http://localhost:${port}/api-docs`);
  console.log('Endpoints:');
  console.log('  GET  /health');
  console.log('  POST /api/notifications/send');
  console.log('  POST /api/notifications/send-multicast');
});
