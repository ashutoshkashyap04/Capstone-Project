 console.log("Student Dashboard loaded");
 
 import {db, messaging} from "../firebase.js";
 import {collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
 import { onMessage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";

 console.log("Registering onMessage listener");

onMessage(messaging, (payload) => {
  console.log("Message received:", payload);

  const title = payload.notification?.title || payload.data?.title;
  const body = payload.notification?.body || payload.data?.body;

  if (Notification.permission === "granted") {
    navigator.serviceWorker.getRegistration().then(reg => {
      if (reg) {
        reg.showNotification(payload.notification.title, {
          body: payload.notification.body
      });
    }
    });
  }
});

 /* --- Tab Switching ---
       When a tab is clicked, remove "active" from all tabs
       and add it only to the clicked tab */
function switchTab(tabName) {
      // Get all tab buttons
      const tabs = document.querySelectorAll('.tab-btn');

      // Remove "active" class from every tab
      tabs.forEach(function(tab) {
        tab.classList.remove('active');
      });

      // Add "active" class to the clicked tab
      const selected = document.getElementById('tab-' + tabName);
      selected.classList.add('active');
}


    /* --- Mark as Completed ---
       When "Mark as Completed" is clicked, change the button
       to a green "Completed" button */
function markCompleted(button) {
      button.textContent = '✔ Completed';       // Change text
      button.classList.remove('btn-outline');    // Remove white style
      button.classList.add('btn-green');         // Add green style
      button.onclick = null;                     // Disable further clicks
}


    /* --- Toggle Notifications ---
       Show or hide the notification list when header is clicked */
function toggleNotifications() {
      const list  = document.getElementById('notif-list');
      const arrow = document.getElementById('notif-arrow');

      // If currently visible, hide it; otherwise show it
      if (list.style.display === 'none') {
        list.style.display = 'block';
        arrow.style.transform = 'rotate(0deg)';
      } else {
        list.style.display = 'none';
        arrow.style.transform = 'rotate(-90deg)';
      }
}

async function loadEvents() {
  console.log("loadEvents running...")
  try {
    const querySnapshot = await getDocs(collection(db, "events"));
    console.log(querySnapshot.size);

    const infoSection = document.querySelector('.events-container');

    // Clear existing events (optional but recommended)
    document.querySelectorAll('.event-card').forEach(el => el.remove());

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      const title = data.title;
      const date  = data.date;
      const time  = data.time;
      const venue = data.venue;
      const desc  = data.description;

      // Format date
      var displayDate = date ? new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
      }) : 'TBD';

      // Format time
      var displayTime = '';
      if (time) {
        var t = time.split(':');
        var h = parseInt(t[0]);
        var m = t[1];
        var ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        displayTime = h + ':' + m + ' ' + ampm;
      } else {
        displayTime = 'TBD';
      }

      const cardHTML = `
        <div class="event-card">
          <div class="event-header">
            <h3 class="event-title">${title}</h3>
            <span class="status-badge upcoming">Upcoming</span>
          </div>
          <p class="event-meta">📅 ${displayDate} | ${displayTime}${venue ? ' &nbsp;•&nbsp; ' + venue : ''}</p>
          <hr class="divider" />
          <p class="event-desc">${desc || 'No description.'}</p>
        </div>
      `;

      infoSection.insertAdjacentHTML('beforeend', cardHTML);
    });

  } catch (error) {
    console.error("Error loading events:", error);
  }

  
}

window.addEventListener('DOMContentLoaded', loadEvents);