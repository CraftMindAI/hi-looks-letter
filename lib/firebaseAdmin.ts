import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";

let adminAuth: Auth | undefined;

export function getAdminAuth(): Auth {
  if (adminAuth) return adminAuth;

  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!clientEmail || !privateKey || !projectId) {
    throw new Error(
      "Missing Firebase Admin credentials. Set FIREBASE_ADMIN_CLIENT_EMAIL and FIREBASE_ADMIN_PRIVATE_KEY."
    );
  }

  const adminApp =
    getApps()[0] || initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });

  adminAuth = getAuth(adminApp);
  return adminAuth;
}
