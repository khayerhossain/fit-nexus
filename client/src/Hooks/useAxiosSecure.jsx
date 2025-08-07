import axios from "axios";
import { getAuth } from "firebase/auth";

const useAxiosSecure = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

useAxiosSecure.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const user = auth.currentUser;
console.log("Backend baseURL:", import.meta.env.VITE_BASE_URL);

  if (user) {
    const token = await user.getIdToken(); 
    console.log("Sending token:", token); // DEBUG
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log("No user logged in");
  }

  return config;
});

export default useAxiosSecure;
