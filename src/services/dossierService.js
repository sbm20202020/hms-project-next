// services/dossierService.js
import api from "@/utils/api";

export const DossierService = {
  create: (dossier) => api.post("/dossiers", dossier),
  getAll: () => api.get("/dossiers"),
  getById: (id) => api.get(`/dossiers/${id}`),
  update: (id, dossier) => api.put(`/dossiers/${id}`, dossier),
  getForToday: () => api.get("/dossiers/today"),
  getForYesterday: () => api.get("/dossiers/yesterday"),
  getByDate: (date) => api.get(`/dossiers/date/${date}`),
  getByMonth: (month) => api.get(`/dossiers/month/${month}`),
  count: () => api.get("/dossiers/count"),
};

export const patientService = {
  create: (patient) => api.post("/patients", patient),
  getAll: () => api.get("/patients"),
  getById: (id) => api.get(`/patients/${id}`),
  count: () => api.get("/patients/count"),
}

export const serviceService = {
  create: (service) => api.post("/hospital/services", service),
  getAll: () => api.get("/hospital/services"),
  getById: (id) => api.get(`/hospital/services/${id}`),
}

export const ticketService = {
  // create: (ticket) => api.post("/tickets", ticket),
  // getById: (id) => api.get(`/tickets/${id}`),
  getAll: () => api.get("/hospital/tickets"),
  update: (id, ticket) => api.put(`/hospital/tickets/${id}`, ticket),
}


