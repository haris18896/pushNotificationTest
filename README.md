# Push Notification Backend

Node.js server for sending Firebase Cloud Messaging (FCM) push notifications to your React Native app.

## Quick start

1. **Get your Firebase Admin SDK service account file** (see below).
2. Save it as `backend/config/firebase-service-account.json`.
3. Set up the backend:

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

4. Send a test notification (replace `YOUR_FCM_TOKEN` with the token from your mobile app):

```bash
curl -X POST http://localhost:3000/api/notifications/send \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_FCM_TOKEN",
    "title": "Hello",
    "body": "This is a test push notification",
    "data": { "screen": "Home" }
  }'
```

## How to get the backend configuration file from Firebase

The mobile files (`google-services.json` and `GoogleService-Info.plist`) are **client** config. The backend needs a different file: the **Firebase Admin SDK service account private key**.

### Steps

1. Open [Firebase Console](https://console.firebase.google.com/) and select your project.
2. Click the gear icon → **Project settings**.
3. Go to the **Service accounts** tab.
4. Click **Generate new private key** (or use an existing service account).
5. Confirm and download the JSON file.
6. Rename or copy it to:

   ```
   backend/config/firebase-service-account.json
   ```

7. Optionally set a custom path in `backend/.env`:

   ```
   FIREBASE_SERVICE_ACCOUNT_PATH=./config/firebase-service-account.json
   ```

### What the file looks like

The JSON contains fields like:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "client_email": "firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com",
  "client_id": "...",
  ...
}
```

**Important:** Never commit this file to git. It grants server-side access to your Firebase project.

## API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/notifications/send` | Send to one device token |
| POST | `/api/notifications/send-multicast` | Send to multiple device tokens |

### Send to one device

```json
POST /api/notifications/send
{
  "token": "fcm-device-token-from-mobile-app",
  "title": "Notification title",
  "body": "Notification body",
  "data": {
    "screen": "Details",
    "itemId": "123"
  }
}
```

### Send to multiple devices

```json
POST /api/notifications/send-multicast
{
  "tokens": ["token1", "token2"],
  "title": "Notification title",
  "body": "Notification body"
}
```

## Getting the FCM token from your React Native app

In your React Native app (using `@react-native-firebase/messaging` or similar), log or send the device token to your backend:

```javascript
import messaging from '@react-native-firebase/messaging';

async function getFcmToken() {
  const token = await messaging().getToken();
  console.log('FCM Token:', token);
  return token;
}
```

Use that token in the `curl` command or API request above.

## Client vs server Firebase files

| File | Used by | Purpose |
|------|---------|---------|
| `google-services.json` | Android app | Client SDK config |
| `GoogleService-Info.plist` | iOS app | Client SDK config |
| Service account JSON | **This backend** | Server-side FCM sending via Admin SDK |
