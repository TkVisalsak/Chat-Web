
document.getElementById('login-google-btn').addEventListener('click', function () {
  window.location.href = "http://127.0.0.1:5001/api/auth/google";
});

document.getElementById('signup-google-btn').addEventListener('click', function () {
  window.location.href = "http://127.0.0.1:5001/api/auth/google";
});
async function loadUserInfo() {
      try {
        const response = await fetch('http://127.0.0.1:5001/api/auth/getUserEmail', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Not authorized or no user');

        const data = await response.json();
        document.getElementById('user-email').textContent = `${data.email}`;
      } catch (error) {
        document.getElementById('user-email').textContent = 'Please log in to see your info.';
        console.error(error);
      }
    }

    // Run on page load
    window.onload = loadUserInfo;

      document.getElementById('personal-info-form').addEventListener('submit', async function (event) {
      event.preventDefault(); // prevent form from refreshing the page

      const form = event.target;
      const data = {
         firstName: document.getElementById('first-name').value,
         lastName: document.getElementById('last-name').value,
         dob: document.getElementById('date-of-birth').value,
         gender: document.querySelector('input[name="gender"]:checked').value
      };

      try {
        
        const response = await fetch('http://127.0.0.1:5001/api/auth/oAuthPersonal_info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
          document.getElementById('message').textContent = 'personal info complete!!!';
          setTimeout(() => {
    window.location.href = 'main.html';
  }, 3000);
        } else {
          document.getElementById('message').textContent = 'Error: ' + (result.message || 'Signup failed.');
        }
      } catch (error) {
        console.error('Request failed:', error);
        document.getElementById('message').textContent = 'Network error. See console for details.';
      }

    
    });
    


//     import { BASE_URL } from "../lib/config.js";


// document.getElementById('login-google-btn').addEventListener('click', function () {
//   window.location.href = `${BASE_URL}/api/auth/google`;
// });

// document.getElementById('signup-google-btn').addEventListener('click', function () {
//   window.location.href =` ${BASE_URL}/api/auth/google`;
// });

// async function loadUserInfo() {
//       try {
//         const response = await fetch(`${BASE_URL}/api/auth/getUserEmail`, {
//           method: 'GET',
//           credentials: 'include',
//         });

//         if (!response.ok) throw new Error('Not authorized or no user');

//         const data = await response.json();
//         document.getElementById('user-email').textContent = `${data.email}`;
//       } catch (error) {
//         document.getElementById('user-email').textContent = 'Please log in to see your info.';
//         console.error(error);
//       }
//     }

//     // Run on page load
//     window.onload = loadUserInfo;

//       document.getElementById('personal-info-form').addEventListener('submit', async function (event) {
//       event.preventDefault(); // prevent form from refreshing the page

//       const form = event.target;
//       const data = {
//          firstName: document.getElementById('first-name').value,
//          lastName: document.getElementById('last-name').value,
//          dob: document.getElementById('date-of-birth').value,
//          gender: document.querySelector('input[name="gender"]:checked').value
//       };

//       try {
        
//         const response = await fetch(`${BASE_URL}/api/auth/oAuthPersonal_info`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           credentials: 'include',
//           body: JSON.stringify(data)
//         });

//         const result = await response.json();

//         if (response.ok) {
//           document.getElementById('message').textContent = 'personal info complete!!!';
//           setTimeout(() => {
//     window.location.href = 'main.html';
//   }, 3000);
//         } else {
//           document.getElementById('message').textContent = 'Error: ' + (result.message || 'Signup failed.');
//         }
//       } catch (error) {
//         console.error('Request failed:', error);
//         document.getElementById('message').textContent = 'Network error. See console for details.';
//       }

    
//     });
    
