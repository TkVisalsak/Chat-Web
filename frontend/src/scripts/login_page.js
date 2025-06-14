document.addEventListener('DOMContentLoaded', function() {
  // Get form elements
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const showLoginLink = document.getElementById('show-login');
  const showSignupLink = document.getElementById('show-signup');
  
  // Password toggle elements
  const passwordToggles = document.querySelectorAll('.password-toggle');
  
  // Password requirement elements
  const signupPassword = document.getElementById('signup-password');
  const loginPassword = document.getElementById('login-password');

  // Toggle between login and signup forms
  showLoginLink.addEventListener('click', function(e) {
    e.preventDefault();
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
  });

  showSignupLink.addEventListener('click', function(e) {
    e.preventDefault();
    signupForm.classList.add('active');
    loginForm.classList.remove('active');
  });
  
  // Toggle password visibility
  passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const passwordInput = this.parentElement.querySelector('input');
      const eyeIcon = this.querySelector('.eye-icon');
      const eyeOffIcon = this.querySelector('.eye-off-icon');
      
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.add('hidden');
        eyeOffIcon.classList.remove('hidden');
      } else {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('hidden');
        eyeOffIcon.classList.add('hidden');
      }
    });
  });
  
  // Password validation
  function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    return {
      isValid: password.length >= minLength && hasUpperCase && hasNumber && hasSpecial,
      requirements: {
        length: password.length >= minLength,
        uppercase: hasUpperCase,
        number: hasNumber,
        special: hasSpecial
      }
    };
  }

  
  
  // Update password requirement UI
  function updatePasswordRequirement(element, isValid) {
    if (element) {
      if (isValid) {
        element.classList.add('valid');
        element.classList.remove('invalid');
      } else {
        element.classList.add('invalid');
        element.classList.remove('valid');
      }
    }
  }
  
  // Update password requirements UI based on form type
  function updatePasswordRequirements(password, isLogin) {
    const validation = validatePassword(password);
    const prefix = isLogin ? 'login-' : '';
    
    updatePasswordRequirement(document.getElementById(`${prefix}length-check`), validation.requirements.length);
    updatePasswordRequirement(document.getElementById(`${prefix}uppercase-check`), validation.requirements.uppercase);
    updatePasswordRequirement(document.getElementById(`${prefix}number-check`), validation.requirements.number);
    updatePasswordRequirement(document.getElementById(`${prefix}special-check`), validation.requirements.special);
    
    return validation;
  }
  
  // Show password requirements on focus
  if (loginPassword) {
    loginPassword.addEventListener('focus', function() {
      const reqContainer = document.getElementById('login-password-requirements');
      if (reqContainer) {
        reqContainer.classList.remove('hidden');
      }
    });
    
    loginPassword.addEventListener('blur', function() {
      const reqContainer = document.getElementById('login-password-requirements');
      if (reqContainer) {
        reqContainer.classList.add('hidden');
      }
    });
    
    loginPassword.addEventListener('input', function() {
      updatePasswordRequirements(this.value, true);
    });
  }
  
  // Check signup password as user types
  if (signupPassword) {
    signupPassword.addEventListener('focus', function() {
      const reqContainer = document.getElementById('signup-password-requirements');
      if (reqContainer) {
        reqContainer.classList.remove('hidden');
      }
    });
    
    signupPassword.addEventListener('blur', function() {
      const reqContainer = document.getElementById('signup-password-requirements');
      if (reqContainer) {
        reqContainer.classList.add('hidden');
      }
    });
    
    signupPassword.addEventListener('input', function() {
      updatePasswordRequirements(this.value, false);
    });
  }

});


//       [Export Function]
//       [Used in login_api.js]

  // Email validation helper
  export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

  export function validatePassword(password) {
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

  export function clearError(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;

  const formGroup = input.closest(".form-group");
  const errorElement = document.getElementById(inputId + "-error");

  if (formGroup) formGroup.classList.remove("error");
  if (errorElement) {
    errorElement.classList.remove("show");
    errorElement.textContent = "";
  }
}

  export function clearAllErrors() {
  const errorElements = document.querySelectorAll(".error-message");
  const formGroups = document.querySelectorAll(".form-group");

  errorElements.forEach(el => {
    el.classList.remove("show");
    el.textContent = "";
  });

  formGroups.forEach(group => {
    group.classList.remove("error", "success");
  });
}

  export function showError(inputId, message) {
  const input = document.getElementById(inputId);
  if (!input) return;

  const formGroup = input.closest(".form-group");
  const errorElement = document.getElementById(inputId + "-error");

  if (formGroup) {
    formGroup.classList.add("error");
    formGroup.classList.remove("success");
  }

  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add("show");
  }
}

  export function showLoginError() {
  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-password");
  const emailFormGroup = emailInput.closest(".form-group");
  const passwordFormGroup = passwordInput.closest(".form-group");
  const passwordErrorElement = document.getElementById("login-password-error");

  // Add error styling to both email and password fields
  emailFormGroup.classList.add("error");
  passwordFormGroup.classList.add("error");

  // Remove success styling if any
  emailFormGroup.classList.remove("success");
  passwordFormGroup.classList.remove("success");

  // Show error message only under password input
  passwordErrorElement.textContent = "Invalid email or password";
  passwordErrorElement.classList.add("show");

  // Auto-clear error after 4 seconds
  setTimeout(() => {
    clearError("login-email");
    clearError("login-password");
  }, 4000);
}

  export function showSuccess(inputId) {
    const input = document.getElementById(inputId)
    const formGroup = input.closest(".form-group")

    formGroup.classList.add("success")
    formGroup.classList.remove("error")
}

