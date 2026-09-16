/** Centralised API endpoint paths – always relative to baseURL `/api` */

export const endpoints = {
  // Auth
  auth: {
    signup: '/auth/signup/',
    token: '/auth/token/',
    tokenRefresh: '/auth/token/refresh/',
    users: '/auth/users/',
  },

  // Patients
  patients: {
    list: '/patients/',
    count: '/patients/count/',
  },

  // Dossiers
  dossiers: {
    list: '/dossiers/',
    detail: (id: number) => `/dossiers/${id}/`,
    today: '/dossiers/today/',
    yesterday: '/dossiers/yesterday/',
    count: '/dossiers/count/',
    byDate: (date: string) => `/dossiers/date/${date}/`,
  },

  // Hospital / Services
  hospital: {
    services: '/hospital/services/',
    servicesCrud: '/hospital/services/crud/',
    serviceDetail: (id: number) => `/hospital/services/${id}/`,
    tickets: '/hospital/tickets/',
    ticketDetail: (id: number) => `/hospital/tickets/${id}/`,
  },

  // Consultations
  consultations: {
    list: '/consultations/',
    detail: (id: number) => `/consultations/${id}/`,
  },

  // Soins infirmiers
  soins: {
    list: '/soins/infirmiers/',
  },

  // Rendez-vous
  rdv: {
    list: '/rendez-vous/',
    detail: (id: number) => `/rendez-vous/${id}/`,
  },

  // Laboratoire
  labo: {
    list: '/labo/',
    detail: (id: number) => `/labo/${id}/`,
  },

  // Imagerie
  imagerie: {
    list: '/imagerie/',
    detail: (id: number) => `/imagerie/${id}/`,
  },

  // Pharmacie
  pharmacie: {
    medicaments: '/pharmacie/medicaments/',
    medicamentDetail: (id: number) => `/pharmacie/medicaments/${id}/`,
    ordonnances: '/pharmacie/ordonnances/',
    ordonnanceDetail: (id: number) => `/pharmacie/ordonnances/${id}/`,
  },

  // Facturation
  factures: {
    list: '/factures/',
    detail: (id: number) => `/factures/${id}/`,
  },

  // Chambres
  chambres: {
    list: '/chambres/',
    detail: (id: number) => `/chambres/${id}/`,
  },

  // Admissions
  admissions: {
    list: '/admissions/',
    detail: (id: number) => `/admissions/${id}/`,
  },

  // Finance
  finance: {
    depenses: '/finance/depenses/',
    revenus: '/finance/revenus/',
    dashboard: '/finance/dashboard/',
  },

  // Employés
  employes: {
    list: '/employes/',
    detail: (id: number) => `/employes/${id}/`,
  },

  // Logs
  logs: '/logs/',

  // Health check
  health: '/health/',
} as const
