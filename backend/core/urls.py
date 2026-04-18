from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    health_check,
    signup,
    patients,
    patients_count,
    dossiers,
    dossier_update,
    dossiers_today,
    dossiers_yesterday,
    dossiers_count,
    dossiers_by_date,
    hospital_services,
    hospital_tickets,
    hospital_ticket_update,
    soins,
    # nouveaux HMS
    factures,
    facture_detail,
    soins_infirmiers,
    rendez_vous,
    rendez_vous_detail,
    examens_labo,
    examen_labo_detail,
    examens_imagerie,
    examen_imagerie_detail,
    medicaments,
    medicament_detail,
    ordonnances,
    ordonnance_detail,
    chambres,
    chambre_detail,
    admissions,
    admission_detail,
    depenses,
    finance_revenus,
    finance_dashboard,
    consultations,
    consultation_detail,
    employes,
    employe_detail,
    hospital_services_crud,
    hospital_service_detail,
    logs,
)

urlpatterns = [
    path("health/", health_check, name="health-check"),

    # auth
    path("auth/signup/", signup, name="auth-signup"),
    path("auth/token/", TokenObtainPairView.as_view(), name="token-obtain-pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),

    # patients
    path("patients/", patients, name="patients"),
    path("patients/count/", patients_count, name="patients-count"),

    # dossiers
    path("dossiers/", dossiers, name="dossiers"),
    path("dossiers/<int:pk>/", dossier_update, name="dossier-update"),
    path("dossiers/today/", dossiers_today, name="dossiers-today"),
    path("dossiers/yesterday/", dossiers_yesterday, name="dossiers-yesterday"),
    path("dossiers/count/", dossiers_count, name="dossiers-count"),
    path("dossiers/date/<str:date>/", dossiers_by_date, name="dossiers-by-date"),

    # hospital
    path("hospital/services/", hospital_services, name="hospital-services"),
    path("hospital/tickets/", hospital_tickets, name="hospital-tickets"),
    path("hospital/tickets/<int:pk>/", hospital_ticket_update, name="hospital-ticket-update"),

    # soins (stub legacy)
    path("soins/", soins, name="soins"),

    # ── Facturation ────────────────────────────────────────────────────────────
    path("factures/", factures, name="factures"),
    path("factures/<int:pk>/", facture_detail, name="facture-detail"),

    # ── Soins infirmiers ────────────────────────────────────────────────────────
    path("soins/infirmiers/", soins_infirmiers, name="soins-infirmiers"),

    # ── Rendez-vous ─────────────────────────────────────────────────────────────
    path("rendez-vous/", rendez_vous, name="rendez-vous"),
    path("rendez-vous/<int:pk>/", rendez_vous_detail, name="rendez-vous-detail"),

    # ── Laboratoire ─────────────────────────────────────────────────────────────
    path("labo/", examens_labo, name="examens-labo"),
    path("labo/<int:pk>/", examen_labo_detail, name="examen-labo-detail"),

    # ── Imagerie ────────────────────────────────────────────────────────────────
    path("imagerie/", examens_imagerie, name="examens-imagerie"),
    path("imagerie/<int:pk>/", examen_imagerie_detail, name="examen-imagerie-detail"),

    # ── Pharmacie ───────────────────────────────────────────────────────────────
    path("pharmacie/medicaments/", medicaments, name="medicaments"),
    path("pharmacie/medicaments/<int:pk>/", medicament_detail, name="medicament-detail"),
    path("pharmacie/ordonnances/", ordonnances, name="ordonnances"),
    path("pharmacie/ordonnances/<int:pk>/", ordonnance_detail, name="ordonnance-detail"),

    # ── Chambres & Lits ─────────────────────────────────────────────────────────
    path("chambres/", chambres, name="chambres"),
    path("chambres/<int:pk>/", chambre_detail, name="chambre-detail"),

    # ── Admissions ──────────────────────────────────────────────────────────────
    path("admissions/", admissions, name="admissions"),
    path("admissions/<int:pk>/", admission_detail, name="admission-detail"),

    # ── Finance ─────────────────────────────────────────────────────────────────
    path("finance/depenses/", depenses, name="depenses"),
    path("finance/revenus/", finance_revenus, name="finance-revenus"),
    path("finance/dashboard/", finance_dashboard, name="finance-dashboard"),

    # ── Consultations ────────────────────────────────────────────────────────────
    path("consultations/", consultations, name="consultations"),
    path("consultations/<int:pk>/", consultation_detail, name="consultation-detail"),

    # ── Employés ─────────────────────────────────────────────────────────────────
    path("employes/", employes, name="employes"),
    path("employes/<int:pk>/", employe_detail, name="employe-detail"),

    # ── Services hospitaliers CRUD ───────────────────────────────────────────────
    path("hospital/services/crud/", hospital_services_crud, name="hospital-services-crud"),
    path("hospital/services/<int:pk>/", hospital_service_detail, name="hospital-service-detail"),

    # ── Logs ─────────────────────────────────────────────────────────────────────
    path("logs/", logs, name="logs"),
]
