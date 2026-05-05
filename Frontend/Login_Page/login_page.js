import { db, messaging } from "../firebase.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getToken } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";

 // This function runs when Admin or Student button is clicked
window.selectRole = function(role) {
  const adminBtn   = document.getElementById('adminBtn');
  const studentBtn = document.getElementById('studentBtn');
  
  // make admin button active
  if (role === 'admin') {
    alert("Logged in as admin");
    adminBtn.classList.add('active');
    studentBtn.classList.remove('active');
  } else {
    //make student button active
    alert("Logged in as student");
    studentBtn.classList.add('active');
    adminBtn.classList.remove('active');
  }
}


window.handleLogin = async function() {
  const email = document.getElementById("email").value;
  const isAdmin = document.getElementById("adminBtn").classList.contains("active");

  alert("Login function triggered");

  if (!email.endsWith("@iitp.ac.in")) {
    alert("Only IITP emails allowed");
    return;
  }

  if (isAdmin) {
    window.location.href = "../Admin/admin_dashboard.html";
  } else {
    // ✅ Call BEFORE redirect
    await setupNotifications(email);

    setTimeout(() => {
      window.location.href = "../Student/student_dashboard.html";
    }, 1000)
  }
};

// Notification logic
async function setupNotifications(email) {

  //Registering Service worker 
  if('serviceWorker' in navigator) {
    await navigator.serviceWorker.register('/firebase-messaging-sw.js');
  }

  const permission = await Notification.requestPermission();

  if (permission === "granted") {

    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    
    const token = await getToken(messaging, {
      vapidKey: "BKj_xivHFw96kXaovKV-4KO3AF_GFcWcJRsi8QGmbZjRJ05TT9H_cQbHeNf-hzvsf7mnDDRGrSgz5hd96ROcxcg",
      serviceWorkerRegistration: registration
    });

    console.log("Token:", token);

    // store in firestore here
    await setDoc(doc(db, "users", email), {
      role: "student",
      fcmToken: token 
    });

    alert("Token stored in Firestore")

    if(!token) {
      console.log("No registration token available");
      return;
    }
  }
}

