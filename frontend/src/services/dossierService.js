// services/dossierService.js
import api from "@/utils/api";

export const DossierService = {
  create: (dossier) => api.post("/dossiers/", dossier),
  getAll: () => api.get("/dossiers/"),
  getById: (id) => api.get(`/dossiers/${id}/`),
  update: (id, dossier) => api.put(`/dossiers/${id}/`, dossier),
  getForToday: () => api.get("/dossiers/today/"),
  getForYesterday: () => api.get("/dossiers/yesterday/"),
  getByDate: (date) => api.get(`/dossiers/date/${date}/`),
  count: () => api.get("/dossiers/count/"),
};

export const patientService = {
  create: (patient) => api.post("/patients/", patient),
  getAll: () => api.get("/patients/"),
  getById: (id) => api.get(`/patients/${id}/`),
  count: () => api.get("/patients/count/"),
};

export const serviceService = {
  create: (service) => api.post("/hospital/services/", service),
  getAll: () => api.get("/hospital/services/"),
  getById: (id) => api.get(`/hospital/services/${id}/`),
};

export const ticketService = {
  getAll: () => api.get("/hospital/tickets/"),
  update: (id, ticket) => api.put(`/hospital/tickets/${id}/`, ticket),
};

export const userAuthService = {
  create: (user) => api.post("/auth/signup/", user),
  getAll: () => api.get("/auth/users/"),
  getById: (id) => api.get(`/auth/users/${id}/`),
};

// ─── Facturation ────────────────────────────────────────────────────────────
export const factureService = {
  create: (data) => api.post("/factures/", data),
  getAll: () => api.get("/factures/"),
  getById: (id) => api.get(`/factures/${id}/`),
  update: (id, data) => api.put(`/factures/${id}/`, data),
};

// ─── Soins infirmiers ────────────────────────────────────────────────────────
export const soinsInfirmiersService = {
  create: (data) => api.post("/soins/infirmiers/", data),
  getAll: () => api.get("/soins/infirmiers/"),
};

// ─── Rendez-vous ─────────────────────────────────────────────────────────────
export const rendezVousService = {
  create: (data) => api.post("/rendez-vous/", data),
  getAll: () => api.get("/rendez-vous/"),
  getById: (id) => api.get(`/rendez-vous/${id}/`),
  update: (id, data) => api.put(`/rendez-vous/${id}/`, data),
  delete: (id) => api.delete(`/rendez-vous/${id}/`),
};

// ─── Laboratoire ─────────────────────────────────────────────────────────────
export const laboService = {
  create: (data) => api.post("/labo/", data),
  getAll: () => api.get("/labo/"),
  getById: (id) => api.get(`/labo/${id}/`),
  update: (id, data) => api.put(`/labo/${id}/`, data),
};

// ─── Imagerie ────────────────────────────────────────────────────────────────
export const imagerieService = {
  create: (data) => api.post("/imagerie/", data),
  getAll: () => api.get("/imagerie/"),
  getById: (id) => api.get(`/imagerie/${id}/`),
  update: (id, data) => api.put(`/imagerie/${id}/`, data),
};

// ─── Pharmacie ───────────────────────────────────────────────────────────────
export const pharmacieService = {
  getMedicaments: () => api.get("/pharmacie/medicaments/"),
  createMedicament: (data) => api.post("/pharmacie/medicaments/", data),
  updateMedicament: (id, data) => api.put(`/pharmacie/medicaments/${id}/`, data),
  deleteMedicament: (id) => api.delete(`/pharmacie/medicaments/${id}/`),
  getOrdonnances: () => api.get("/pharmacie/ordonnances/"),
  createOrdonnance: (data) => api.post("/pharmacie/ordonnances/", data),
  updateOrdonnance: (id, data) => api.put(`/pharmacie/ordonnances/${id}/`, data),
};

// ─── Chambres ────────────────────────────────────────────────────────────────
export const chambreService = {
  create: (data) => api.post("/chambres/", data),
  getAll: () => api.get("/chambres/"),
  getById: (id) => api.get(`/chambres/${id}/`),
  update: (id, data) => api.put(`/chambres/${id}/`, data),
  delete: (id) => api.delete(`/chambres/${id}/`),
};

// ─── Admissions ──────────────────────────────────────────────────────────────
export const admissionService = {
  create: (data) => api.post("/admissions/", data),
  getAll: () => api.get("/admissions/"),
  getById: (id) => api.get(`/admissions/${id}/`),
  update: (id, data) => api.put(`/admissions/${id}/`, data),
};

// ─── Finance ─────────────────────────────────────────────────────────────────
export const depenseService = {
  create: (data) => api.post("/finance/depenses/", data),
  getAll: () => api.get("/finance/depenses/"),
};

export const financeService = {
  getDashboard: () => api.get("/finance/dashboard/"),
  getRevenus: () => api.get("/finance/revenus/"),
};

// ─── Consultations médicales ─────────────────────────────────────────────────
export const consultationService = {
  create: (data) => api.post("/consultations/", data),
  getAll: () => api.get("/consultations/"),
  getById: (id) => api.get(`/consultations/${id}/`),
  update: (id, data) => api.put(`/consultations/${id}/`, data),
};

// ─── Employés ────────────────────────────────────────────────────────────────
export const employeService = {
  create: (data) => api.post("/employes/", data),
  getAll: () => api.get("/employes/"),
  getById: (id) => api.get(`/employes/${id}/`),
  update: (id, data) => api.put(`/employes/${id}/`, data),
  delete: (id) => api.delete(`/employes/${id}/`),
};

// ─── Services hospitaliers (CRUD) ─────────────────────────────────────────────
export const hospitalServicesCRUD = {
  create: (data) => api.post("/hospital/services/crud/", data),
  getAll: () => api.get("/hospital/services/crud/"),
  update: (id, data) => api.put(`/hospital/services/${id}/`, data),
  delete: (id) => api.delete(`/hospital/services/${id}/`),
};

// ─── Logs ────────────────────────────────────────────────────────────────────
export const logService = {
  getAll: () => api.get("/logs/"),
};
