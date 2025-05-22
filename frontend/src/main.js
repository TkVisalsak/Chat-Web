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
  const lengthCheck = document.getElementById('length-check');
  const uppercaseCheck = document.getElementById('uppercase-check');
  const numberCheck = document.getElementById('number-check');
  const specialCheck = document.getElementById('special-check');

  // Add login password requirements container
  const loginFormPasswordField = loginPassword.parentElement;
  const loginRequirementsContainer = document.createElement('div');
  loginRequirementsContainer.className = 'password-requirements hidden';
  loginRequirementsContainer.id = 'login-password-requirements';
  // loginRequirementsContainer.innerHTML = `
  //   <p>Password must:</p>
  //   <div class="requirement" id="login-length-check">Be at least 8 characters</div>
  //   <div class="requirement" id="login-uppercase-check">Contain at least 1 uppercase letter</div>
  //   <div class="requirement" id="login-number-check">Contain at least 1 number</div>
  //   <div class="requirement" id="login-special-check">Contain at least 1 special character</div>
  // `;
  loginFormPasswordField.appendChild(loginRequirementsContainer);

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
    if (isValid) {
      element.classList.add('valid');
      element.classList.remove('invalid');
    } else {
      element.classList.add('invalid');
      element.classList.remove('valid');
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
      document.getElementById('login-password-requirements').classList.remove('hidden');
    });
    
    loginPassword.addEventListener('blur', function() {
      document.getElementById('login-password-requirements').classList.add('hidden');
    });
    
    loginPassword.addEventListener('input', function() {
      updatePasswordRequirements(this.value, true);
    });
  }
  
  // Check signup password as user types
  if (signupPassword) {
    signupPassword.addEventListener('focus', function() {
      document.getElementById('signup-password-requirements').classList.remove('hidden');
    });
    
    signupPassword.addEventListener('blur', function() {
      document.getElementById('signup-password-requirements').classList.add('hidden');
    });
    
    signupPassword.addEventListener('input', function() {
      updatePasswordRequirements(this.value, false);
    });
  }

  // Form submission for login
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Validate email
    if (!validateEmail(email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      let errorMessage = 'Password must:';
      if (!passwordValidation.requirements.length) errorMessage += '\n- Be at least 8 characters long';
      if (!passwordValidation.requirements.uppercase) errorMessage += '\n- Contain at least 1 uppercase letter';
      if (!passwordValidation.requirements.number) errorMessage += '\n- Contain at least 1 number';
      if (!passwordValidation.requirements.special) errorMessage += '\n- Contain at least 1 special character';
      
      // alert(errorMessage);
      return;
    }
    
    // // Here you would typically send the data to your server
    // console.log('Login form submitted:', { email, password });
    // alert('Login successful! (This is just a demo)');

     window.location.href = 'main.html';
  });

  // Form submission for signup
  signupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    // Validate form
    if (name.trim() === '') {
      alert('Please enter your name');
      return;
    }
    
    if (!validateEmail(email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      let errorMessage = 'Password must:';
      if (!passwordValidation.requirements.length) errorMessage += '\n- Be at least 8 characters long';
      if (!passwordValidation.requirements.uppercase) errorMessage += '\n- Contain at least 1 uppercase letter';
      if (!passwordValidation.requirements.number) errorMessage += '\n- Contain at least 1 number';
      if (!passwordValidation.requirements.special) errorMessage += '\n- Contain at least 1 special character';
      
      alert(errorMessage);
      return;
    }
    
    window.location.href = 'personal-info.html';
    
    // // Switch to login form after successful signup
    // loginForm.classList.add('active');
    // signupForm.classList.remove('active');
  });

  // Email validation helper function
  function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
});