// ─── Organisation ──────────────────────────────────────────────────────────
export interface Organisation {
  id: number
  nom: string | null
  description: string | null
  created_at: string
  updated_at: string
}

// ─── Contact ───────────────────────────────────────────────────────────────
export interface Contact {
  id: number
  nom: string | null
  prenom: string | null
  email: string | null
  telephone: string | null
  date_naissance: string | null
  age: number | null
  sexe: string | null
  adresse: string | null
  ville: string | null
  code_postal: string | null
  numero_secu: string | null
  establishment_type: string | null
  organization: string | null
  position: string | null
  is_demo_request: boolean
  created_at: string
  updated_at: string
  organisation: number
}

// ─── Fonction ──────────────────────────────────────────────────────────────
export interface Fonction {
  id: number
  nom: string
  code: string
  description: string | null
  created_at: string
  updated_at: string
}

// ─── Role & Permission ─────────────────────────────────────────────────────
export interface Role {
  id: number
  nom: string
  description: string | null
  statut: string
  created_at: string
  updated_at: string
  organisation: number
}

export interface Permission {
  id: number
  name: string
  statut: string
  can_create: boolean
  can_read: boolean
  can_update: boolean
  can_delete: boolean
  fonction: number | null
  created_at: string
  updated_at: string
  organisation: number
}

// ─── Service ───────────────────────────────────────────────────────────────
export interface Service {
  id: number
  nom: string
  description: string | null
  statut: string
  code: string | null
  created_at: string
  updated_at: string
  organisation: number
  is_required_nurse_service: boolean
  is_required_doctor_service: boolean
  is_required_pharmacist_service: boolean
  is_required_lab_service: boolean
  is_required_radiology_service: boolean
  is_required_imaging_service: boolean
}

// ─── Employe ───────────────────────────────────────────────────────────────
export interface Employe {
  id: number
  statut: string
  created_at: string
  updated_at: string
  service: number | null
  contact: Contact | number | null
  organisation: number
}

// ─── User ──────────────────────────────────────────────────────────────────
export type AccessType =
  | 'DEMO_ADMIN_GUEST'
  | 'PRO_ADMIN_GUEST'
  | 'DEMO_ADMIN_EXPIRED'
  | 'PRO_ADMIN_EXPIRED'
  | 'ADMIN_GLOBAL_HMS'

export interface User {
  id: number
  email: string
  email_verified: string | null
  image: string | null
  access_type: AccessType
  is_active: boolean
  is_staff: boolean
  created_at: string
  updated_at: string
  role: number | null
  contact: Contact | number | null
  organisation: number
}

// ─── Patient ───────────────────────────────────────────────────────────────
export interface Patient {
  id: number
  type_patient: string | null
  convention: string | null
  contact_urgence: string | null
  telephone_urgence: string | null
  allergies: string | null
  antecedents: string | null
  traitements: string | null
  statut: string | null
  service: string | null
  medecin_traitant: string | null
  derniere_visite: string
  created_at: string
  updated_at: string
  contact: Contact | number | null
  organisation: number
}

// ─── Dossier Patient ───────────────────────────────────────────────────────
export type DossierStatut = 'attente' | 'en_cours' | 'termine' | 'annule'

export interface DossierPatient {
  id: number
  code: string | null
  motif_de_visite: string | null
  niveau_urgence: string | null
  statut: DossierStatut | string
  created_at: string
  updated_at: string
  date_traitement: string | null
  patient: Patient | number | null
  service: Service | number | null
  medecin_traitant: Employe | number | null
  organisation: number
}

// ─── Ticket ────────────────────────────────────────────────────────────────
export interface Ticket {
  id: number
  code: string | null
  created_at: string
  updated_at: string
  status: string
  date_called: string | null
  date_done: string | null
  dossier_patient: DossierPatient | number | null
  organisation: number
}

// ─── Facture ───────────────────────────────────────────────────────────────
export type FactureStatut = 'En attente' | 'Validée' | 'Payée'
export type AssuranceType = 'Aucune' | 'CNSS' | 'CNAMGS' | 'Assurance Privée'
export type PaiementMethode = 'Espèces' | 'Carte Bancaire' | 'Mobile Money' | 'Virement'

export interface LigneFacture {
  id: number
  description: string
  quantite: number
  prix_unitaire: number
  montant: number
}

export interface Facture {
  id: number
  numero_facture: string
  patient: Patient | number | null
  dossier: DossierPatient | number | null
  date_facture: string
  montant_total: number
  statut: FactureStatut
  methode_paiement: PaiementMethode | null
  type_assurance: AssuranceType
  notes: string | null
  created_by: number | null
  lignes: LigneFacture[]
  organisation: number
  created_at: string
  updated_at: string
}

// ─── Soin Infirmier ────────────────────────────────────────────────────────
export type SoinStatut = 'En attente' | 'En cours' | 'Terminé'

export interface SoinInfirmier {
  id: number
  patient: Patient | number | null
  dossier: DossierPatient | number | null
  infirmier: Employe | number | null
  date_heure: string
  tension: string | null
  temperature: number | null
  pouls: number | null
  respiration: number | null
  saturation: number | null
  poids: number | null
  taille: number | null
  soins_effectues: string[]
  statut: SoinStatut
  observations: string | null
  organisation: number
  created_at: string
  updated_at: string
}

// ─── Rendez-vous ───────────────────────────────────────────────────────────
export type RdvStatut = 'En attente' | 'Confirmé' | 'Annulé' | 'Terminé' | 'Urgent'
export type RdvType = 'Consultation' | 'Suivi' | 'Urgence' | 'Contrôle' | 'Téléconsultation'

export interface RendezVous {
  id: number
  patient: Patient | number | null
  medecin: Employe | number | null
  date: string
  heure: string
  type: RdvType
  statut: RdvStatut
  duree: number
  notes: string | null
  organisation: number
  created_at: string
  updated_at: string
}

// ─── Examen Labo ───────────────────────────────────────────────────────────
export type ExamenLaboStatut = 'Demandé' | 'En cours' | 'Résultats disponibles' | 'Annulé'

export interface ExamenLabo {
  id: number
  patient: Patient | number | null
  dossier: DossierPatient | number | null
  type_examen: string
  resultats: string | null
  statut: ExamenLaboStatut
  date_demande: string
  date_resultat: string | null
  demande_par: Employe | number | null
  notes: string | null
  organisation: number
  created_at: string
  updated_at: string
}

// ─── Examen Imagerie ───────────────────────────────────────────────────────
export type ImagerieType = 'Radiographie' | 'Échographie' | 'Scanner' | 'IRM' | 'Mammographie'
export type ImagerieStatut = 'Demandé' | 'En cours' | 'Résultats disponibles' | 'Annulé'

export interface ExamenImagerie {
  id: number
  patient: Patient | number | null
  dossier: DossierPatient | number | null
  type: ImagerieType
  compte_rendu: string | null
  statut: ImagerieStatut
  date_demande: string
  date_resultat: string | null
  demande_par: Employe | number | null
  notes: string | null
  organisation: number
  created_at: string
  updated_at: string
}

// ─── Pharmacie ─────────────────────────────────────────────────────────────
export type MedicamentForme = 'Comprimé' | 'Gélule' | 'Sirop' | 'Injectable' | 'Pommade' | 'Suppositoire' | 'Collyre'
export type MedicamentStatut = 'Disponible' | 'Rupture de stock' | 'En commande'

export interface Medicament {
  id: number
  nom: string
  dci: string | null
  forme: MedicamentForme
  stock: number
  seuil_alerte: number
  prix: number
  statut: MedicamentStatut
  description: string | null
  organisation: number
  created_at: string
  updated_at: string
}

export interface LigneOrdonnance {
  id: number
  medicament: Medicament | number | null
  quantite: number
  posologie: string | null
  duree: string | null
}

export type OrdonnanceStatut = 'En attente' | 'Dispensée' | 'Annulée'

export interface Ordonnance {
  id: number
  patient: Patient | number | null
  medecin: Employe | number | null
  date: string
  statut: OrdonnanceStatut
  notes: string | null
  lignes: LigneOrdonnance[]
  organisation: number
  created_at: string
  updated_at: string
}

// ─── Hospitalisation ───────────────────────────────────────────────────────
export type ChambreType = 'Simple' | 'Double' | 'Suite' | 'Salle commune' | 'Réanimation'
export type ChambreStatut = 'Disponible' | 'Occupée' | 'Maintenance'
export type LitStatut = 'Libre' | 'Occupé' | 'Maintenance'
export type AdmissionStatut = 'En cours' | 'Sorti' | 'Transféré'

export interface Chambre {
  id: number
  numero: string
  type: ChambreType
  service: Service | number | null
  statut: ChambreStatut
  nombre_lits: number
  description: string | null
  organisation: number
  created_at: string
  updated_at: string
}

export interface Lit {
  id: number
  chambre: Chambre | number
  numero: string
  statut: LitStatut
}

export interface Admission {
  id: number
  patient: Patient | number | null
  dossier: DossierPatient | number | null
  lit: Lit | number | null
  medecin: Employe | number | null
  date_entree: string
  date_sortie_prevue: string | null
  date_sortie_reelle: string | null
  motif: string | null
  statut: AdmissionStatut
  notes: string | null
  organisation: number
  created_at: string
  updated_at: string
}

// ─── Finance ───────────────────────────────────────────────────────────────
export type DepenseCategorie = 'Salaires' | 'Équipements' | 'Médicaments' | 'Maintenance' | 'Fournitures' | 'Énergie' | 'Autres'

export interface Depense {
  id: number
  categorie: DepenseCategorie
  montant: number
  description: string | null
  date: string
  justificatif: string | null
  created_by: number | null
  organisation: number
  created_at: string
  updated_at: string
}

export interface FinanceDashboard {
  totalRevenus: number
  totalDepenses: number
  beneficeNet: number
  enAttente: number
}

// ─── Consultation Médicale ─────────────────────────────────────────────────
export type ConsultationStatut = 'En cours' | 'Terminée'

export interface ConsultationMedicale {
  id: number
  patient: Patient | number | null
  dossier: DossierPatient | number | null
  medecin: Employe | number | null
  date: string
  anamnese: string | null
  diagnostic: string | null
  prescription: string | null
  notes: string | null
  statut: ConsultationStatut
  organisation: number
  created_at: string
  updated_at: string
}

// ─── Log ───────────────────────────────────────────────────────────────────
export interface Log {
  id: number
  message: string
  type: string
  model_id: number
  model_name: string
  action: string
  user_id: number
  created_at: string
  updated_at: string
  organisation: number
}

// ─── API Response helpers ──────────────────────────────────────────────────
export interface CountResponse {
  count: number
}

export interface AuthTokenResponse {
  access: string
  refresh: string
  user_id?: string
  organisation_id?: number
  access_type?: string
}
