// timetable_backend.js
// Handles time-slot generation, storage, conflict checking, and grid rendering
// for the Smart Timetable Generator (ledger/ticket-stub theme).

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const HOURS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

let schedule = []; // { id, subject, day, startTime, room }

function populateStartTimeOptions() {
  const startTimeSelect = document.getElementById("startTime");
  HOURS.forEach(hour => {
    const option = document.createElement("option");
    option.value = hour;
    option.textContent = hour;
    startTimeSelect.appendChild(option);
  });
}

function addSlot() {
  const subjectInput = document.getElementById("subject");
  const daySelect = document.getElementById("day");
  const startTimeSelect = document.getElementById("startTime");
  const roomInput = document.getElementById("room");

  const subject = subjectInput.value.trim();
  const day = daySelect.value;
  const startTime = startTimeSelect.value;
  const room = roomInput.value.trim();

  if (subject === "") {
    alert("Enter a subject before stamping it in.");
    return;
  }

  const conflict = schedule.find(s => s.day === day && s.startTime === startTime);
  if (conflict) {
    alert(`Slot taken: ${conflict.subject} is already on ${day} at ${startTime}.`);
    return;
  }

  schedule.push({ id: Date.now(), subject, day, startTime, room });
  renderTimetable();

  subjectInput.value = "";
  roomInput.value = "";
  subjectInput.focus();
}

function deleteSlot(id) {
  schedule = schedule.filter(s => s.id !== id);
  renderTimetable();
}

function renderTimetable() {
  const table = document.getElementById("timetable");
  table.innerHTML = "";

  const headerRow = document.createElement("tr");
  const cornerCell = document.createElement("th");
  cornerCell.textContent = "Time";
  headerRow.appendChild(cornerCell);
  DAYS.forEach(day => {
    const th = document.createElement("th");
    th.textContent = day;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  HOURS.forEach(hour => {
    const row = document.createElement("tr");
    const timeCell = document.createElement("td");
    timeCell.textContent = hour;
    row.appendChild(timeCell);

    DAYS.forEach(day => {
      const cell = document.createElement("td");
      const matches = schedule.filter(s => s.day === day && s.startTime === hour);

      matches.forEach(slot => {
        const entry = document.createElement("div");
        entry.className = "slot-entry";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "×";
        deleteBtn.className = "delete-btn";
        deleteBtn.setAttribute("aria-label", `Remove ${slot.subject}`);
        deleteBtn.onclick = () => deleteSlot(slot.id);
        entry.appendChild(deleteBtn);

        entry.appendChild(document.createTextNode(slot.subject));

        if (slot.room) {
          const roomSpan = document.createElement("span");
          roomSpan.className = "slot-room";
          roomSpan.textContent = slot.room;
          entry.appendChild(roomSpan);
        }

        cell.appendChild(entry);
      });

      row.appendChild(cell);
    });

    table.appendChild(row);
  });
}

populateStartTimeOptions();
renderTimetable();
