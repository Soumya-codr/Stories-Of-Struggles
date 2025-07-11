import { getApps, initializeApp, cert, App } from 'firebase-admin/app';

let adminApp: App;

// This function initializes the Firebase Admin SDK.
// It's designed to be called from server-side code.
export function initAdminApp() {
  // Check if the default app is already initialized to prevent errors.
  // This is a common pattern in serverless environments like Next.js.
  if (getApps().some((app) => app.name === '[DEFAULT]')) {
    return;
  }

  const serviceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // The private key needs newlines to be correctly parsed.
    // Environment variables often escape them, so we replace them back.
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  initializeApp({
    credential: cert(serviceAccount),
  });
}
