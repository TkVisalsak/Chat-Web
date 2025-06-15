import { validatePassword, isValidEmail, showLoginError, showError, clearError, clearAllErrors, showSuccess } from "../scripts/login_page.js";
import { BASE_URL } from "../lib/config.js";

document.addEventListener('DOMContentLoaded', function() {

   document.getElementById('signup-form').addEventListener('submit', async function (event) {
      event.preventDefault();
      clearAllErrors()
      const form = event.target;
      const data = {
         userName: document.getElementById('signup-name').value,
         email: document.getElementById('signup-email').value,
         password: document.getElementById('signup-password').value
      };
      if (!data.userName.trim()) {
      console.log("Validation failed: fullName is empty")
      showError("signup-name", "Username is required")
      return
    }

    if (!data.email.trim()) {
      console.log("Validation failed: email is empty")
      showError("signup-email", "Email is required")
      return
    }

    if (!isValidEmail(data.email)) {
      console.log("Validation failed: invalid email format")
      showError("signup-email", "Invalid email format")
      return
    }

    if (!data.password.trim()) {
      console.log("Validation failed: password is empty")
      showError("signup-password", "Password is required")
      return
    }

    // Password validation
    if (!validatePassword(data.password)) {
      console.log("Validation failed: password doesn't meet requirements")
      showError("signup-password", "Password does not meet requirements")
      return
    }

    console.log("All client-side validation passed, sending to server...")
      try {
        const response = await fetch(`${BASE_URL}/api/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(data)
           
        })

        console.log("Response status:", response.status)
        console.log("Response ok:", response.ok)

        const result = await response.json()
        console.log("Server response:", result)

      if (response.ok) {
        console.log("Signup successful!")
        // Show success states
        showSuccess("signup-name")
        showSuccess("signup-email")
        showSuccess("signup-password")

        setTimeout(() => {
          window.location.href = "personal-info.html"
        }, 1000)
        } else {
          console.log("Server returned error:", result.message)
        // Handle different error types with specific messages
        if (result.message && result.message.toLowerCase().includes("email")) {
          showError("signup-email", result.message)
        } else if (result.message && result.message.toLowerCase().includes("username")) {
          showError("signup-name", result.message)
        } else if (result.message && result.message.toLowerCase().includes("password")) {
          showError("signup-password", result.message)
        } else {
          // Show error on email field as fallback
          showError("signup-email", result.message || "Signup failed")
        }
      }
      } catch (error) {
        console.error('Request failed:', error);
        document.getElementById('message').textContent = 'Network error. See console for details.';
      }
    });


  document.getElementById("login-form").addEventListener("submit", async (event) => {
    event.preventDefault()
    clearAllErrors()

    const data = {
      email: document.getElementById("login-email").value,
      password: document.getElementById("login-password").value,
    }

    // Basic client-side validation
    if (!data.email.trim()) {
      showError("login-email", "Email is required")
      return
    }

    if (!isValidEmail(data.email)) {
      showError("login-email", "Invalid email format")
      return
    }

    if (!data.password.trim()) {
      showError("login-password", "Password is required")
      return
    }

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        // Show success states
        showSuccess("login-email")
        showSuccess("login-password")

        setTimeout(() => {
        window.location.href='/frontend/test/index.html'
        }, 1000)
      } else {
        // Show single error message under password field and make both fields red
        showLoginError()
      }
    } catch (error) {
      console.error("Request failed:", error)
      showLoginError()
    }
  });
});
