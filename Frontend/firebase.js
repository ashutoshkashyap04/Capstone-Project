// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getMessaging } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBUiLukCgSPH5zXKVlkZgK4S_ObXyX1JUY",
  authDomain: "capstone-project-7ac47.firebaseapp.com",
  projectId: "capstone-project-7ac47",
  storageBucket: "capstone-project-7ac47.firebasestorage.app",
  messagingSenderId: "290950195454",
  appId: "1:290950195454:web:0428722c113b0b1933ddaf",
  measurementId: "G-T863YN5G21"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);

export const messaging = getMessaging(app);