
document.addEventListener("DOMContentLoaded", () => {
  // Get form elements
  const loginForm = document.getElementById("login-form")
  const signupForm = document.getElementById("signup-form")
  const showLoginLink = document.getElementById("show-login")
  const showSignupLink = document.getElementById("show-signup")

  // Get Input
  const fullName = document.getElementById("signup-name")
  const email = document.getElementById("signup-email")
  const password = document.getElementById("signup-password")

  // Toggle between login and signup forms
  showLoginLink.addEventListener("click", (e) => {
    e.preventDefault()
    loginForm.classList.add("active")
    signupForm.classList.remove("active")
    clearAllErrors()
  })

  showSignupLink.addEventListener("click", (e) => {
    e.preventDefault()
    signupForm.classList.add("active")
    loginForm.classList.remove("active")
    clearAllErrors()
  })

  // Toggle password visibility
  const passwordToggles = document.querySelectorAll(".password-toggle")
  passwordToggles.forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const passwordInput = this.parentElement.querySelector("input")
      const eyeIcon = this.querySelector(".eye-icon")
      const eyeOffIcon = this.querySelector(".eye-off-icon")

      if (passwordInput.type === "password") {
        passwordInput.type = "text"
        eyeIcon.classList.add("hidden")
        eyeOffIcon.classList.remove("hidden")
      } else {
        passwordInput.type = "password"
        eyeIcon.classList.remove("hidden")
        eyeOffIcon.classList.add("hidden")
      }
    })
  })

  // Error handling functions
    function showError(inputId, message) {
    const input = document.getElementById(inputId)
    const formGroup = input.closest(".form-group")
    const errorElement = document.getElementById(inputId + "-error")

    // Add error class to form group
    formGroup.classList.add("error")
    formGroup.classList.remove("success")

    // Show error message
    errorElement.textContent = message
    errorElement.classList.add("show")

    // Auto-clear error after 4 seconds
    setTimeout(() => {
      clearError(inputId)
    }, 4000)
  }

  function clearError(inputId) {
    const input = document.getElementById(inputId)
    const formGroup = input.closest(".form-group")
    const errorElement = document.getElementById(inputId + "-error")

    formGroup.classList.remove("error")
    errorElement.classList.remove("show")
    errorElement.textContent = ""
  }

  function clearAllErrors() {
    const errorElements = document.querySelectorAll(".error-message")
    const formGroups = document.querySelectorAll(".form-group")

    errorElements.forEach((el) => {
      el.classList.remove("show")
      el.textContent = ""
    })

    formGroups.forEach((group) => {
      group.classList.remove("error", "success")
    })
  }

  function showSuccess(inputId) {
    const input = document.getElementById(inputId)
    const formGroup = input.closest(".form-group")

    formGroup.classList.add("success")
    formGroup.classList.remove("error")
  }

  // Input event listeners to clear errors on typing
  const inputs = document.querySelectorAll("input")
  inputs.forEach((input) => {
    input.addEventListener("input", function () {
      if (this.closest(".form-group").classList.contains("error")) {
        clearError(this.id)
      }
    })
  })

  // Signup form submission
  document.getElementById("signup-form").addEventListener("submit", async (event) => {
    event.preventDefault()
    clearAllErrors()

    const data = {
      userName: document.getElementById("signup-name").value,
      email: document.getElementById("signup-email").value,
      password: document.getElementById("signup-password").value,
    }
    
    // DEBUG: Log the form data
    console.log("=== SIGNUP FORM DEBUG ===")
    console.log("Form data being sent:", data)
    console.log("Full name:", `"${data.fullName}"`)
    console.log("Email:", `"${data.email}"`)
    console.log("Password:", `"${data.password}"`)
    console.log("Password length:", data.password.length)

    // Basic client-side validation
    if (!data.fullName.trim()) {
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
      const response = await fetch("http://127.0.0.1:5001/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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
      console.error("Network error:", error)
      showError("signup-email", "Network error. Please try again.")
    }
  })

  // Add password validation function
  function validatePassword(password) {
    const minLength = password.length >= 8
    const hasUppercase = /[A-Z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecial = /[^a-zA-Z0-9]/.test(password)

    console.log("Password validation:", {
      minLength,
      hasUppercase,
      hasNumber,
      hasSpecial,
      overall: minLength && hasUppercase && hasNumber && hasSpecial,
    })

    return minLength && hasUppercase && hasNumber && hasSpecial
    
  }
  
  // Add password requirements real-time validation
  document.getElementById("signup-password").addEventListener("input", function () {
    const password = this.value

    // Update requirement indicators
    updateRequirement("length-check", password.length >= 8)
    updateRequirement("uppercase-check", /[A-Z]/.test(password))
    updateRequirement("number-check", /[0-9]/.test(password))
    updateRequirement("special-check", /[^a-zA-Z0-9]/.test(password))
  })




  function updateRequirement(elementId, isValid) {
    const element = document.getElementById(elementId)
    if (element) {
      element.classList.remove("valid", "invalid")
      element.classList.add(isValid ? "valid" : "invalid")
    }
  }

  // Login form submission
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
      const response = await fetch("http://127.0.0.1:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        // Show success states
        showSuccess("login-email")
        showSuccess("login-password")

        setTimeout(() => {
          location.href = "https://www.w3schools.com"
        }, 1000)
      } else {
        // Show single error message under password field and make both fields red
        showLoginError()
      }
    } catch (error) {
      console.error("Request failed:", error)
      showLoginError()
    }
  })

  // Add new function for login errors
  function showLoginError() {
    const emailInput = document.getElementById("login-email")
    const passwordInput = document.getElementById("login-password")
    const emailFormGroup = emailInput.closest(".form-group")
    const passwordFormGroup = passwordInput.closest(".form-group")
    const passwordErrorElement = document.getElementById("login-password-error")

    // Make both fields red
    emailFormGroup.classList.add("error")
    passwordFormGroup.classList.add("error")
    emailFormGroup.classList.remove("success")
    passwordFormGroup.classList.remove("success")

    // Show error message only under password field
    passwordErrorElement.textContent = "Invalid password or email"
    passwordErrorElement.classList.add("show")

    // Auto-clear error after 4 seconds
    setTimeout(() => {
      clearError("login-email")
      clearError("login-password")
    }, 4000)
  }

  // Email validation helper
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
})
