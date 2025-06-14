  async function loadUserInfo() {
      try {
        const response = await fetch('http://127.0.0.1:5001/api/auth/getUserEmail', {
          method: 'GET',
          credentials: 'include', // send cookies
        });

        if (!response.ok) throw new Error('Not authorized or no user');

        const data = await response.json();
        document.getElementById('userName').textContent = `${data.userName}`;
      } catch (error) {
        document.getElementById('userName').textContent = 'Please log in to see your info.';
        console.error(error);
      }
    }

    // Run on page load
    window.onload = loadUserInfo;