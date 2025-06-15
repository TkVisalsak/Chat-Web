import { BASE_URL } from "../src/lib/config.js";
const socket = io(`${BASE_URL}`);

let selectedUserId = null;

const sidebar = document.getElementById("sidebar");
const messagesContainer = document.getElementById("messages");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const imageInput = document.getElementById("image-input");

// Fetch sidebar users
async function loadUsers() {
  const res = await fetch(`${BASE_URL}/api/messages/users`, {
    method: 'GET',
    credentials: "include"
  });
  const users = await res.json();

  sidebar.innerHTML = "";
  users.forEach(user => {
    const btn = document.createElement("button");
    btn.textContent = user.username || user.email;
    btn.onclick = () => {
      selectedUserId = user._id;
      loadMessages(user._id);
    };
    sidebar.appendChild(btn);
  });
}

// Fetch chat history
async function loadMessages(userId) {
  const res = await fetch(`${BASE_URL}/api/messages/${userId}`, {
    credentials: "include"
  });
  const messages = await res.json();

  messagesContainer.innerHTML = "";
  messages.forEach(msg => {
    const el = document.createElement("div");
    el.className = "message";
    el.innerHTML = `
      <p>${msg.text || ""}</p>
      ${msg.image ? `<img src="${msg.image}" alt="sent image"/>` : ""}
    `;
    messagesContainer.appendChild(el);
  });
}

// Send message
messageForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!selectedUserId) return;

  const text = messageInput.value;
  const file = imageInput.files[0];

  let base64Image = null;
  if (file) {
    const reader = new FileReader();
    reader.onloadend = async () => {
      base64Image = reader.result;

      await sendMessage(text, base64Image);
    };
    reader.readAsDataURL(file);
  } else {
    await sendMessage(text, null);
  }

  messageInput.value = "";
  imageInput.value = "";
});

async function sendMessage(text, image) {
  const res = await fetch(`${BASE_URL}/api/messages/send/${selectedUserId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ text, image }),
  });

  const msg = await res.json();
  appendMessage(msg);
}

function appendMessage(msg) {
  const el = document.createElement("div");
  el.className = "message";
  el.innerHTML = `
    <p>${msg.text || ""}</p>
    ${msg.image ? `<img src="${msg.image}" alt="sent image"/>` : ""}
  `;
  messagesContainer.appendChild(el);
}

// Listen for real-time messages
socket.on("newMessage", (msg) => {
  if (msg.senderId === selectedUserId || msg.receiverId === selectedUserId) {
    appendMessage(msg);
  }
});

loadUsers();
