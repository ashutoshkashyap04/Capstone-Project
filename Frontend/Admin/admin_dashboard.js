import { db } from "../firebase.js";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } 
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function openModal(modalId) {
  document.getElementById(modalId).classList.add('active');
}

/* Closes a modal by removing the "active" class */
function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

/* Close any modal when user clicks the dark overlay background */
document.querySelectorAll('.modal-overlay').forEach(function(overlay) {
  overlay.addEventListener('click', function(e) {
    /* Only close if the click was directly on the overlay,
       NOT on the white card inside */
    if (e.target === overlay) {
      overlay.classList.remove('active');
    }
  });
});


/* ============================================================
   ADD EVENT MODAL
   ============================================================ */

/* Opens the Add Event modal and clears all fields */
function openAddModal() {
  // Clear all input fields before opening
  document.getElementById('add-title').value = '';
  document.getElementById('add-date').value  = '';
  document.getElementById('add-time').value  = '';
  document.getElementById('add-venue').value = '';
  document.getElementById('add-desc').value  = '';

  openModal('add-modal');
}

/* Called when "Save Event" is clicked in the Add Event modal */
async function saveEvent() {
  // Read the values from the form fields
  var title = document.getElementById('add-title').value.trim();
  var date  = document.getElementById('add-date').value;
  var time  = document.getElementById('add-time').value;
  var venue = document.getElementById('add-venue').value.trim();
  var desc  = document.getElementById('add-desc').value.trim();

  // Simple validation: title must not be empty
  if (title === '') {
    alert('Please enter an event title.');
    return;
  }

  try {
    //  Save to Firebase
    await addDoc(collection(db, "events"), {
      title: title,
      date: date,
      time: time,
      venue: venue,
      description: desc
    });

    console.log("Saved to Firebase");

    //Reload from database
    loadEvents();

    alert("Event added successfully");

    // Close the modal
    closeModal('add-modal');

  } catch (error) {
    console.error("Error adding event:", error);
    alert(error.message);
  }
}


/* ============================================================
   EDIT EVENT MODAL
   ============================================================ */

/* Opens the Edit modal and pre-fills all fields with current values */
function openEditModal(cardId, title, date, time, venue, desc) {
  // Store the ID of the card (this is Firebase doc.id)
  document.getElementById('edit-card-id').value = cardId;

  // Pre-fill form fields with existing values
  document.getElementById('edit-title').value = title;
  document.getElementById('edit-date').value  = date;
  document.getElementById('edit-time').value  = time;
  document.getElementById('edit-venue').value = venue;
  document.getElementById('edit-desc').value  = desc;

  // Open the edit modal
  openModal('edit-modal');
}


/* Called when "Update Event" is clicked */
async function updateEvent() {

  // Get updated values from form
  var cardId = document.getElementById('edit-card-id').value;
  var title  = document.getElementById('edit-title').value.trim();
  var date   = document.getElementById('edit-date').value;
  var time   = document.getElementById('edit-time').value;
  var venue  = document.getElementById('edit-venue').value.trim();
  var desc   = document.getElementById('edit-desc').value.trim();

  // Basic validation
  if (title === '') {
    alert('Please enter an event title.');
    return;
  }

  try {
    // 🔥 STEP 1: Update data in Firebase
    await updateDoc(doc(db, "events", cardId), {
      title: title,
      date: date,
      time: time,
      venue: venue,
      description: desc
    });

    console.log("Event updated in Firebase");

    // 🔥 STEP 2: Format date for UI display
    var displayDate = date ? new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    }) : 'TBD';

    // 🔥 STEP 3: Format time for UI display
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

    // 🔥 STEP 4: Update UI instantly (without refresh)
    var card = document.getElementById(cardId);
    if (card) {

      // Update title
      card.querySelector('.event-title').textContent = title;

      // Update date + time + venue
      card.querySelector('.event-meta').innerHTML =
        '📅 ' + displayDate + ' | ' + displayTime +
        (venue ? ' &nbsp;•&nbsp; ' + venue : '');

      // Update description
      card.querySelector('.event-desc').textContent = desc || 'No description.';

      // 🔥 STEP 5: Update button onclick data (VERY IMPORTANT)
      // So next edit uses latest values

      var editBtn = card.querySelector('.btn-outline-edit');
      if (editBtn) {
        editBtn.setAttribute('onclick',
          `openEditModal('${cardId}', '${title}', '${date}', '${time}', '${venue}', '${desc}')`);
      }

      var delBtn = card.querySelector('.btn-blue-delete');
      if (delBtn) {
        delBtn.setAttribute('onclick',
          `openDeleteModal('${cardId}', '${title}')`);
      }
    }

    // Close modal after update
    closeModal('edit-modal');

  } catch (error) {
    console.error("Error updating event:", error);
    alert(error.message);
  }
}


/* ============================================================
   DELETE CONFIRMATION MODAL
   ============================================================ */

function openDeleteModal(cardId, eventName) {
  document.getElementById('delete-event-name').textContent = '"' + eventName + '"';
  document.getElementById('delete-card-id').value = cardId;

  openModal('delete-modal');
}

async function confirmDelete() {
  var cardId = document.getElementById('delete-card-id').value;
  var card   = document.getElementById(cardId);

  try {
    //  Delete from Firebase
    await deleteDoc(doc(db, "events", cardId));
    console.log("Deleted from Firebase");

    
    if (card) {
      card.style.transition = 'opacity 0.3s, transform 0.3s';
      card.style.opacity    = '0';
      card.style.transform  = 'scale(0.95)';

      setTimeout(function() {
        card.remove();

        var totalEl = document.querySelector('.stat-card:nth-child(1) .stat-number');
        if (totalEl) {
          var current = parseInt(totalEl.textContent);
          if (current > 0) totalEl.textContent = current - 1;
        }
      }, 300);
    }

    closeModal('delete-modal');

  } catch (error) {
    console.error("Error deleting event:", error);
    alert(error.message);
  }
}

window.openAddModal = openAddModal;
window.openEditModal = openEditModal;
window.openDeleteModal = openDeleteModal;
window.saveEvent = saveEvent;
window.updateEvent = updateEvent;
window.confirmDelete = confirmDelete;


// Getting saved events from datbase to UI
async function loadEvents() {
  try {
    const querySnapshot = await getDocs(collection(db, "events"));

    const infoSection = document.querySelector('.info-section');

    // Remove old UI events (including pseudo ones)
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

      const cardId = doc.id;  // Firebase document id

      const cardHTML = `
        <div class="event-card" id="${cardId}">
          <div class="event-header">
            <h3 class="event-title">${title}</h3>
            <span class="status-badge upcoming">Upcoming</span>
          </div>
          <p class="event-meta">📅 ${displayDate} | ${displayTime}${venue ? ' &nbsp;•&nbsp; ' + venue : ''}</p>
          <hr class="divider" />
          <p class="event-desc">${desc || 'No description.'}</p>

          <div class="btn-row">
            <button class="btn btn-outline-edit"
              onclick="openEditModal('${cardId}', '${title}', '${date}', '${time}', '${venue}', '${desc}')">
              ✏️ Edit
            </button>

            <button class="btn btn-blue-delete"
              onclick="openDeleteModal('${cardId}', '${title}')">
              🗑️ Delete
            </button>
          </div>
        </div>
      `;

      infoSection.insertAdjacentHTML('beforeend', cardHTML);
    });

  } catch (error) {
    console.error("Error loading events:", error);
  }
}

window.addEventListener('DOMContentLoaded', loadEvents);