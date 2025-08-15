// services/dossierService.js
import api from "@/utils/api";

export const DossierService = {
  create: (dossier) => api.post("/dossiers", dossier),
  getAll: () => api.get("/dossiers"),
  getById: (id) => api.get(`/dossiers/${id}`),
  update: (id, dossier) => api.put(`/dossiers/${id}`, dossier),
};

export const patientService = {
  create: (patient) => api.post("/patients", patient),
  getAll: () => api.get("/patients"),
  getById: (id) => api.get(`/patients/${id}`),
}

export const serviceService = {
  create: (service) => api.post("/hospital/services", service),
  getAll: () => api.get("/hospital/services"),
  getById: (id) => api.get(`/hospital/services/${id}`),
}

