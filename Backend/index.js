import cron from "node-cron";
import admin from "firebase-admin";
import { db } from "./firebase.js"; // your firestore instance

// run every 1 minute
cron.schedule("* * * * *", async () => {
  console.log("Checking events...");

  const now = new Date();

  const snapshot = await db.collection("events").get();

  snapshot.forEach(async (doc) => {
    const event = doc.data();

    const eventTime = new Date(`${event.date} ${event.time}`);

    const diffMin = (eventTime - now) / (1000 * 60);

    // 30 min check
    if (diffMin <= 30 && diffMin > 29) {
      await sendNotification(event, "30 minutes left for event!");
    }

    // 15 min check
    if (diffMin <= 15 && diffMin > 14) {
      await sendNotification(event, "15 minutes left for event!");
    }

    // 5 min check
    if (diffMin <= 5 && diffMin > 4) {
      await sendNotification(event, "5 minutes left for event!");
    }
  });
});

//Send notification function 
async function sendNotification(event, message) {
  const usersSnapshot = await db.collection("users").get();

  const tokens = [];

  usersSnapshot.forEach((doc) => {
    const user = doc.data();
    if (user.fcmToken) tokens.push(user.fcmToken);
  });

  if (tokens.length === 0) {
    console.log("No tokens Found");
    return;
  }

  const payload = {
    notification: {
      title: event.title,
      body: message,
    },
  };


  try {
    await admin.messaging().sendEachForMulticast({
      tokens,
      ...payload,
    });

    console.log("Notification sent:", message);
  } catch (err) {
    console.error("FCM Error:", err);
  }
}

