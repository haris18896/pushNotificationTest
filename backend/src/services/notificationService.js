const { getMessaging } = require('../config/firebase');

/**
 * Send a push notification to a single device token.
 */
async function sendToDevice({ token, title, body, data = {} }) {
  const messaging = getMessaging();

  const message = {
    token,
    notification: {
      title,
      body,
    },
    data: stringifyData(data),
    android: {
      priority: 'high',
      notification: {
        channelId: 'default',
        sound: 'default',
      },
    },
    apns: {
      payload: {
        aps: {
          sound: 'default',
        },
      },
    },
  };

  const messageId = await messaging.send(message);
  return { messageId };
}

/**
 * Send a push notification to multiple device tokens.
 */
async function sendToDevices({ tokens, title, body, data = {} }) {
  const messaging = getMessaging();

  const message = {
    tokens,
    notification: {
      title,
      body,
    },
    data: stringifyData(data),
    android: {
      priority: 'high',
      notification: {
        channelId: 'default',
        sound: 'default',
      },
    },
    apns: {
      payload: {
        aps: {
          sound: 'default',
        },
      },
    },
  };

  const response = await messaging.sendEachForMulticast(message);

  return {
    successCount: response.successCount,
    failureCount: response.failureCount,
    responses: response.responses.map((item, index) => ({
      token: tokens[index],
      success: item.success,
      messageId: item.messageId,
      error: item.error ? item.error.message : undefined,
    })),
  };
}

/**
 * FCM data payloads must be string key-value pairs.
 */
function stringifyData(data) {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, String(value)])
  );
}

module.exports = {
  sendToDevice,
  sendToDevices,
};
