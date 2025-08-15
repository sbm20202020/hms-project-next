// utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Tu peux mettre l'URL de ton API
  timeout: 20000,  // Timeout de 10 secondes
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response.data, // on retourne directement data
  (error) => {
    if (error.code === "ECONNABORTED") {
      return Promise.reject(new Error("Requête annulée : délai dépassé"));
    }
    return Promise.reject(error);
  }
);

export default api;




// // utils/api.js
// export async function apiFetch(url, data = null, method = "GET") {
//     const options = {
//       method,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     };
//     if (data) {
//       options.body = JSON.stringify(data);
//     }
  
//     const response = await fetch(url, options);
  
//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(errorText || "Une erreur est survenue");
//     }
  
//     return response.json();
//   }
  