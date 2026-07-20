import axios from "axios";

const instance = axios.create({
  baseURL: "https://study-room-server-4c0f.onrender.com/api",
});

instance.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  } catch (e) {
    console.error("Error reading user from localStorage", e);
  }
  return config;
});

export default instance;