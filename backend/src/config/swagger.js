const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Push Notification API',
      version: '1.0.0',
      description:
        'Send Firebase Cloud Messaging (FCM) push notifications to React Native devices.',
    },
    servers: [
      {
        url: 'http://localhost:{port}',
        description: 'Local development server',
        variables: {
          port: {
            default: '3000',
          },
        },
      },
    ],
    tags: [
      {
        name: 'Health',
        description: 'Server health checks',
      },
      {
        name: 'Notifications',
        description: 'FCM push notification endpoints',
      },
    ],
    components: {
      schemas: {
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'ok',
            },
          },
        },
        NotificationData: {
          type: 'object',
          additionalProperties: {
            type: 'string',
          },
          description: 'Optional key-value payload delivered with the notification',
          example: {
            screen: 'Home',
            itemId: '123',
          },
        },
        SendNotificationRequest: {
          type: 'object',
          required: ['token', 'title', 'body'],
          properties: {
            token: {
              type: 'string',
              description: 'FCM device token from the mobile app',
              example: 'fcm-device-token-from-mobile-app',
            },
            title: {
              type: 'string',
              example: 'Hello',
            },
            body: {
              type: 'string',
              example: 'This is a test push notification',
            },
            data: {
              $ref: '#/components/schemas/NotificationData',
            },
          },
        },
        SendMulticastRequest: {
          type: 'object',
          required: ['tokens', 'title', 'body'],
          properties: {
            tokens: {
              type: 'array',
              items: {
                type: 'string',
              },
              minItems: 1,
              example: ['token-1', 'token-2'],
            },
            title: {
              type: 'string',
              example: 'Hello everyone',
            },
            body: {
              type: 'string',
              example: 'Multicast test notification',
            },
            data: {
              $ref: '#/components/schemas/NotificationData',
            },
          },
        },
        SendNotificationResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            messageId: {
              type: 'string',
              example: 'projects/your-project/messages/0:1234567890',
            },
          },
        },
        MulticastResultItem: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
            },
            success: {
              type: 'boolean',
            },
            messageId: {
              type: 'string',
            },
            error: {
              type: 'string',
            },
          },
        },
        SendMulticastResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            successCount: {
              type: 'integer',
              example: 2,
            },
            failureCount: {
              type: 'integer',
              example: 0,
            },
            responses: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/MulticastResultItem',
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'token is required',
            },
            details: {
              type: 'string',
              example: 'Requested entity was not found.',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js', './src/index.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
