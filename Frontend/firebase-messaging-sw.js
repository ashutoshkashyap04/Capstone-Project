importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyBUiLukCgSPH5zXKVlkZgK4S_ObXyX1JUY",
  authDomain: "capstone-project-7ac47.firebaseapp.com",
  projectId: "capstone-project-7ac47",
  storageBucket: "capstone-project-7ac47.firebasestorage.app",
  messagingSenderId: "290950195454",
  appId: "1:290950195454:web:0428722c113b0b1933ddaf",
  measurementId: "G-T863YN5G21"
};



firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log("Background message:", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body
  });
});