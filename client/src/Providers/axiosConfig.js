
import axios from "axios";
import { getAuth } from "firebase/auth";

// Set base URL
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

// Add request interceptor for authentication
axios.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  console.log("Backend baseURL:", import.meta.env.VITE_BASE_URL);
  
  if (user) {
    const token = await user.getIdToken();
    console.log("Sending token:", token);
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log("No user logged in");
  }
  
  return config;
});

// Optional: Add response interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
); 
