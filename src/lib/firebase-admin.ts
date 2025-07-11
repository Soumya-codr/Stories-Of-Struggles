import { getApps, initializeApp, cert, App } from 'firebase-admin/app';

let adminApp: App;

export async function initAdminApp() {
  if (getApps().length > 0 && adminApp) {
    return;
  }

  const serviceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  adminApp = initializeApp({
    credential: cert(serviceAccount),
  });
}
