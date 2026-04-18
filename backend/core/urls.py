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

    # soins
    path("soins/", soins, name="soins"),
]
