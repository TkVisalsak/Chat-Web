
export const BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://127.0.0.1:5001"       // your local backend URL with port
  : "https://your-app.onrender.com"; // your production backend URL on Render
