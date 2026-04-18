// utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Django JWT from the next-auth session if available
api.interceptors.request.use(async (config) => {
  try {
    // getSession works in both browser and server components
    const { getSession } = await import("next-auth/react");
    const session = await getSession();
    if (session?.djangoAccessToken) {
      config.headers["Authorization"] = `Bearer ${session.djangoAccessToken}`;
    }
  } catch {
    // running in an environment where next-auth is not available – skip
  }
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.code === "ECONNABORTED") {
      return Promise.reject(new Error("Requête annulée : délai dépassé"));
    }
    return Promise.reject(error);
  }
);

export default api;

  