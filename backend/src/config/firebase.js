const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

let initialized = false;

function resolveServiceAccountPath() {
  const configuredPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  if (!configuredPath) {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT_PATH is not set. Copy .env.example to .env and point it at your service account JSON file.'
    );
  }

  const absolutePath = path.isAbsolute(configuredPath)
    ? configuredPath
    : path.resolve(process.cwd(), configuredPath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(
      `Firebase service account file not found at: ${absolutePath}\n` +
        'Download it from Firebase Console → Project Settings → Service accounts → Generate new private key'
    );
  }

  return absolutePath;
}

function initializeFirebase() {
  if (initialized) {
    return admin;
  }

  const serviceAccountPath = resolveServiceAccountPath();
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  initialized = true;
  return admin;
}

function getMessaging() {
  return initializeFirebase().messaging();
}

module.exports = {
  initializeFirebase,
  getMessaging,
};
