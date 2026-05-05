import admin from "firebase-admin";
import fs from "fs";

// Read JSON manually (safe method)
const serviceAccount = JSON.parse(
  fs.readFileSync(new URL("./serviceAccountKey.json", import.meta.url))
);

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Firestore database
export const db = admin.firestore();

// Export admin (needed for FCM)
export default admin;