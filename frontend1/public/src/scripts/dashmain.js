// Chat data
const chatData = {
  alice: {
    name: "Alice Smith",
    avatar: "AS",
    status: "Online",
    messages: [
      {
        sender: "alice",
        content: "Hey! How's the project going?",
        time: "2:30 PM",
      },
      {
        sender: "me",
        content: "It's going well! Just finished the main features.",
        time: "2:32 PM",
      },
      {
        sender: "alice",
        content: "That's awesome! Can't wait to see it.",
        time: "2:33 PM",
      },
      {
        sender: "me",
        content: "I'll share the demo link with you shortly.",
        time: "2:35 PM",
      },
    ],
  },
  bob: {
    name: "Bob Johnson",
    avatar: "BJ",
    status: "Online",
    messages: [
      {
        sender: "bob",
        content: "Thanks for the help earlier!",
        time: "1:45 PM",
      },
      { sender: "me", content: "No problem! Happy to help.", time: "1:46 PM" },
      {
        sender: "bob",
        content: "The solution worked perfectly.",
        time: "1:47 PM",
      },
    ],
  },
  team: {
    name: "Team Chat",
    avatar: "TM",
    status: "5 members",
    messages: [
      { sender: "sarah", content: "Meeting at 3 PM today", time: "12:15 PM" },
      { sender: "mike", content: "I'll be there!", time: "12:16 PM" },
      {
        sender: "me",
        content: "Same here. What's the agenda?",
        time: "12:17 PM",
      },
      {
        sender: "sarah",
        content: "We'll discuss the new feature rollout",
        time: "12:18 PM",
      },
    ],
  },
  sarah: {
    name: "Sarah Wilson",
    avatar: "SW",
    status: "Away",
    messages: [
      {
        sender: "sarah",
        content: "Can you review the design?",
        time: "11:30 AM",
      },
      { sender: "me", content: "Send me the link.", time: "11:31 AM" },
      {
        sender: "sarah",
        content: "Here it is: figma.com/design123",
        time: "11:32 AM",
      },
    ],
  },
  mike: {
    name: "Mike Davis",
    avatar: "MD",
    status: "Offline",
    messages: [
      {
        sender: "mike",
        content: "Great work on the presentation!",
        time: "Yesterday",
      },
      {
        sender: "me",
        content: "Thank you! Your feedback was really helpful.",
        time: "Yesterday",
      },
    ],
  },
};

let currentChat = "alice";

// DOM elements
const chatItems = document.querySelectorAll(".chat-item");
const messagesContainer = document.getElementById("messagesContainer");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const currentChatName = document.getElementById("currentChatName");
const searchInput = document.getElementById("searchInput");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

// Settings elements
const settingsBtn = document.getElementById("settingsBtn");
const settingsDropdown = document.getElementById("settingsDropdown");
const themeToggle = document.getElementById("themeToggle");
const logoutBtn = document.getElementById("logoutBtn");
const accountBtn = document.getElementById("accountBtn");
const privacyBtn = document.getElementById("privacyBtn");
const notificationsBtn = document.getElementById("notificationsBtn");

// Modal elements
const logoutModal = document.getElementById("logoutModal");
const accountModal = document.getElementById("accountModal");
const privacyModal = document.getElementById("privacyModal");
const notificationsModal = document.getElementById("notificationsModal");

// Initialize
function init() {
  loadChat(currentChat);
  setupEventListeners();
  adjustTextareaHeight();
  loadTheme();
}

// Setup event listeners
function setupEventListeners() {
  // Chat item clicks
  chatItems.forEach((item) => {
    item.addEventListener("click", () => {
      const chatId = item.dataset.chat;
      switchChat(chatId);
      closeMobileSidebar();
    });
  });

  // Send message
  if (sendBtn) {
    sendBtn.addEventListener("click", sendMessage);
  }

  if (messageInput) {
    messageInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
    messageInput.addEventListener("input", adjustTextareaHeight);
  }

  // Search functionality
  if (searchInput) {
    searchInput.addEventListener("input", filterChats);
  }

  // Mobile menu
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", toggleMobileSidebar);
  }

  if (overlay) {
    overlay.addEventListener("click", closeMobileSidebar);
  }

  // Settings dropdown
  if (settingsBtn) {
    settingsBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleSettingsDropdown();
    });
  }

  // Theme toggle
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  // Modal buttons
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      closeSettingsDropdown();
      showModal("logoutModal");
    });
  }

  if (accountBtn) {
    accountBtn.addEventListener("click", () => {
      closeSettingsDropdown();
      showModal("accountModal");
    });
  }

  if (privacyBtn) {
    privacyBtn.addEventListener("click", () => {
      closeSettingsDropdown();
      showModal("privacyModal");
    });
  }

  if (notificationsBtn) {
    notificationsBtn.addEventListener("click", () => {
      closeSettingsDropdown();
      showModal("notificationsModal");
    });
  }

  // Modal close buttons
  const closeButtons = [
    { id: "closeLogoutModal", action: () => hideModal("logoutModal") },
    { id: "cancelLogout", action: () => hideModal("logoutModal") },
    { id: "confirmLogout", action: handleLogout },
    { id: "closeAccountModal", action: () => hideModal("accountModal") },
    { id: "closeAccount", action: () => hideModal("accountModal") },
    { id: "closePrivacyModal", action: () => hideModal("privacyModal") },
    { id: "closePrivacy", action: () => hideModal("privacyModal") },
    {
      id: "closeNotificationsModal",
      action: () => hideModal("notificationsModal"),
    },
    { id: "closeNotifications", action: () => hideModal("notificationsModal") },
  ];

  closeButtons.forEach((button) => {
    const element = document.getElementById(button.id);
    if (element) {
      element.addEventListener("click", button.action);
    }
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    if (
      settingsBtn &&
      settingsDropdown &&
      !settingsBtn.contains(e.target) &&
      !settingsDropdown.contains(e.target)
    ) {
      closeSettingsDropdown();
    }
  });

  // Close sidebar when clicking outside on mobile
  document.addEventListener("click", (e) => {
    if (
      window.innerWidth <= 768 &&
      sidebar &&
      !sidebar.contains(e.target) &&
      mobileMenuBtn &&
      !mobileMenuBtn.contains(e.target)
    ) {
      closeMobileSidebar();
    }
  });
}

// Settings dropdown functions
function toggleSettingsDropdown() {
  if (settingsDropdown) {
    settingsDropdown.classList.toggle("show");
  }
}

function closeSettingsDropdown() {
  if (settingsDropdown) {
    settingsDropdown.classList.remove("show");
  }
}

// Theme functions
function toggleTheme() {
  const body = document.body;
  const currentTheme = body.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";

  body.setAttribute("data-theme", newTheme);
  if (themeToggle) {
    themeToggle.classList.toggle("active", newTheme === "dark");
  }

  // Save theme preference
  localStorage.setItem("theme", newTheme);
}

function loadTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.body.setAttribute("data-theme", savedTheme);
  if (themeToggle) {
    themeToggle.classList.toggle("active", savedTheme === "dark");
  }
}

// Modal functions
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("show");
  }
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("show");
  }
}

function handleLogout() {
  hideModal("logoutModal");
  alert("Logged out successfully! Redirecting to login page...");
}

// Switch chat
function switchChat(chatId) {
  currentChat = chatId;

  // Update active chat item
  chatItems.forEach((item) => {
    item.classList.remove("active");
    if (item.dataset.chat === chatId) {
      item.classList.add("active");
      // Remove unread badge
      const badge = item.querySelector(".unread-badge");
      if (badge) badge.remove();
    }
  });

  loadChat(chatId);
}

// Load chat messages
function loadChat(chatId) {
  const chat = chatData[chatId];
  if (!chat) return;

  // Update header
  if (currentChatName) {
    currentChatName.textContent = chat.name;
  }

  const statusElement = document.querySelector(".chat-header-info p");
  if (statusElement) {
    statusElement.textContent = chat.status;
  }

  const headerAvatar = document.querySelector(".chat-header-left .chat-avatar");
  if (headerAvatar) {
    headerAvatar.textContent = chat.avatar;
  }

  // Clear and load messages
  if (messagesContainer) {
    messagesContainer.innerHTML = "";
    chat.messages.forEach((message) => {
      addMessageToDOM(message);
    });
    scrollToBottom();
  }
}

// Add message to DOM
function addMessageToDOM(message) {
  if (!messagesContainer) return;

  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${message.sender === "me" ? "sent" : ""}`;

  const avatar = message.sender === "me" ? "JD" : chatData[currentChat].avatar;

  messageDiv.innerHTML = `
                <div class="message-avatar">${avatar}</div>
                <div>
                    <div class="message-content">${message.content}</div>
                    <div class="message-time">${message.time}</div>
                </div>
            `;

  messagesContainer.appendChild(messageDiv);
}

// Send message
function sendMessage() {
  if (!messageInput) return;

  const content = messageInput.value.trim();
  if (!content) {
    messageInput.classList.add("shake");
    setTimeout(() => messageInput.classList.remove("shake"), 500);
    return;
  }

  const now = new Date();
  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const message = {
    sender: "me",
    content: content,
    time: time,
  };

  // Add to chat data
  chatData[currentChat].messages.push(message);

  // Add to DOM
  addMessageToDOM(message);

  // Clear input
  messageInput.value = "";
  adjustTextareaHeight();

  // Scroll to bottom
  scrollToBottom();

  // Update chat preview in sidebar
  updateChatPreview(currentChat, content, time);

  // Simulate response
  setTimeout(() => {
    simulateResponse();
  }, 1000 + Math.random() * 2000);
}

// Simulate response
function simulateResponse() {
  const responses = [
    "That sounds great!",
    "I agree with you.",
    "Let me think about it.",
    "Thanks for letting me know.",
    "I'll get back to you on that.",
    "Sounds good to me!",
    "Perfect timing!",
    "I was just thinking the same thing.",
  ];

  const now = new Date();
  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const message = {
    sender: currentChat,
    content: responses[Math.floor(Math.random() * responses.length)],
    time: time,
  };

  chatData[currentChat].messages.push(message);
  addMessageToDOM(message);
  scrollToBottom();
  updateChatPreview(currentChat, message.content, time);
}

// Update chat preview in sidebar
function updateChatPreview(chatId, content, time) {
  const chatItem = document.querySelector(`[data-chat="${chatId}"]`);
  if (chatItem) {
    const previewElement = chatItem.querySelector(".chat-preview");
    const timeElement = chatItem.querySelector(".chat-time");

    if (previewElement) previewElement.textContent = content;
    if (timeElement) timeElement.textContent = time;

    // Move to top of list
    const chatList = document.getElementById("chatList");
    if (chatList) {
      chatList.insertBefore(chatItem, chatList.firstChild);
    }
  }
}

// Adjust textarea height
function adjustTextareaHeight() {
  if (messageInput) {
    messageInput.style.height = "auto";
    messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + "px";
  }
}

// Scroll to bottom
function scrollToBottom() {
  if (messagesContainer) {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

// Filter chats
function filterChats() {
  if (!searchInput) return;

  const query = searchInput.value.toLowerCase();
  chatItems.forEach((item) => {
    const nameElement = item.querySelector(".chat-name");
    const previewElement = item.querySelector(".chat-preview");

    if (nameElement && previewElement) {
      const name = nameElement.textContent.toLowerCase();
      const preview = previewElement.textContent.toLowerCase();

      if (name.includes(query) || preview.includes(query)) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    }
  });
}

// Mobile sidebar functions
function toggleMobileSidebar() {
  if (sidebar && overlay) {
    sidebar.classList.toggle("open");
    overlay.classList.toggle("show");
  }
}

function closeMobileSidebar() {
  if (sidebar && overlay) {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", init);

// Also initialize immediately in case DOM is already loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

