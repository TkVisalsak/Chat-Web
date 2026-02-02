import { BASE_URL } from "../lib/config.js";

let socket = null;
let currentUserId = null;
let selectedUserId = null;

const sidebar = document.getElementById("sidebar");
const messagesContainer = document.getElementById("messages");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const imageInput = document.getElementById("image-input");

// Load users in sidebar
async function loadUsers() {
  const res = await fetch(`${BASE_URL}/api/messages/users`, {
    method: "GET",
    credentials: "include",
  });
  const users = await res.json();

  sidebar.innerHTML = "";
  users.forEach((user) => {
    const btn = document.createElement("button");
    btn.textContent = user.username || user.email;
    btn.onclick = () => {
      selectedUserId = user._id;
      loadMessages(user._id);
    };
    sidebar.appendChild(btn);
  });
}

// Load messages with selected user
async function loadMessages(userId) {
  const res = await fetch(`${BASE_URL}/api/messages/${userId}`, {
    credentials: "include",
  });
  const messages = await res.json();

  messagesContainer.innerHTML = "";
  messages.forEach((msg) => {
    appendMessage(msg);
  });
}

// Append a single message to messages container
function appendMessage(msg) {
  const el = document.createElement("div");
  el.className = "message";
  el.innerHTML = `
    <p>${msg.text || ""}</p>
    ${msg.image ? `<img src="${msg.image}" alt="sent image"/>` : ""}
  `;
  messagesContainer.appendChild(el);
  messagesContainer.scrollTop = messagesContainer.scrollHeight; // auto scroll down
}

// Send message handler
messageForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!selectedUserId) return;

  const text = messageInput.value.trim();
  const file = imageInput.files[0];

  if (!text && !file) return; // prevent empty messages

  if (file) {
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage(text, reader.result);
      resetForm();
    };
    reader.readAsDataURL(file);
  } else {
    await sendMessage(text, null);
    resetForm();
  }
});

function resetForm() {
  messageInput.value = "";
  imageInput.value = "";
}

// Send message via API
async function sendMessage(text, image) {
  const res = await fetch(`${BASE_URL}/api/messages/send/${selectedUserId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ text, image }),
  });

  if (!res.ok) {
    console.error("Failed to send message");
    return;
  }

  const msg = await res.json();
  // The server should also emit this message via socket,
  // but appendMessage here so sender sees instantly
  appendMessage(msg);
}

// Initialize socket with current user
async function initSocketConnection() {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/check`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Unauthorized");
    const user = await res.json();
    currentUserId = user._id;

    socket = io(BASE_URL, {
      query: { userId: currentUserId },
    });

    socket.on("newMessage", (msg) => {
      if (
        selectedUserId &&
        (msg.senderId === selectedUserId || msg.receiverId === selectedUserId)
      ) {
        appendMessage(msg);
      } else {
        // Optionally: notify user of message from other chat
        console.log("New message for another conversation:", msg);
      }
    });

  } catch (err) {
    console.error("Socket init failed:", err);
  }
}

// Run on page load
document.addEventListener("DOMContentLoaded", () => {
  loadUsers();
  initSocketConnection();
});
