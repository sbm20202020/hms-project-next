import math
from datetime import datetime, timedelta, timezone

from django.http import JsonResponse
from django.utils import timezone as dj_timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import (
    Contact,
    DossierPatient,
    Organisation,
    Patient,
    Role,
    Service,
    Ticket,
)
from .serializers import (
    DossierPatientSerializer,
    DossierYesterdaySerializer,
    PatientSerializer,
    ServiceSerializer,
    SignupSerializer,
    TicketSerializer,
    TicketWithDossierSerializer,
)


# ─── helpers ────────────────────────────────────────────────────────────────

def _calcul_age(date_naissance):
    today = datetime.today()
    age = today.year - date_naissance.year
    if (today.month, today.day) < (date_naissance.month, date_naissance.day):
        age -= 1
    return age


def _generate_code(prefix, increment):
    now = datetime.now()
    date_str = now.strftime("%d%m%y")
    time_str = now.strftime("%H%M%S")
    increment_str = str(increment).zfill(3)
    return f"{prefix}-{date_str}-{time_str}-{increment_str}"


def _generate_ticket_code(service_code, increment):
    return f"{service_code.upper()}-{str(increment).zfill(3)}"


def _day_range(date=None):
    if date is None:
        date = dj_timezone.now().date()
    start = datetime.combine(date, datetime.min.time(), tzinfo=timezone.utc)
    end = start + timedelta(days=1) - timedelta(milliseconds=1)
    return start, end


def _pair_month(month):
    year = datetime.now().year
    from calendar import monthrange
    _, last_day = monthrange(year, month)
    start = datetime(year, month, 1, tzinfo=timezone.utc)
    if month == 12:
        end = datetime(year + 1, 1, 1, tzinfo=timezone.utc)
    else:
        end = datetime(year, month + 1, 1, tzinfo=timezone.utc)
    return start, end


# ─── health ─────────────────────────────────────────────────────────────────

def health_check(request):
    return JsonResponse({"status": "ok"})


# ─── auth/signup ────────────────────────────────────────────────────────────

@api_view(["POST"])
@permission_classes([AllowAny])
def signup(request):
    serializer = SignupSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(
            {"error": str(serializer.errors), "ok": False, "trueStatus": 400},
            status=status.HTTP_200_OK,
        )

    data = serializer.validated_data

    from django.contrib.auth.hashers import make_password
    from .models import User

    if User.objects.filter(email=data["email"]).exists():
        return Response(
            {
                "error": "Un utilisateur avec cet email existe déjà",
                "ok": False,
                "trueStatus": 400,
            },
            status=status.HTTP_200_OK,
        )

    # Create organisation
    organisation = Organisation.objects.create(nom="", description="")

    # Create admin role
    role = Role.objects.create(
        nom="Administrateur",
        description="Administrateur",
        organisation=organisation,
    )

    name_parts = data["name"].split(" ", 1)
    contact = Contact.objects.create(
        nom=name_parts[0],
        prenom=name_parts[1] if len(name_parts) > 1 else "",
        email=data["email"],
        telephone=data.get("telephone", ""),
        organization=data.get("organization", ""),
        position=data.get("position", ""),
        establishment_type=data.get("establishment_type", ""),
        is_demo_request=data.get("is_demo_request", False),
        organisation=organisation,
    )

    User.objects.create(
        email=data["email"],
        password=make_password(data["password"]),
        contact=contact,
        organisation=organisation,
        role=role,
    )

    return Response(
        {"message": "Utilisateur créé avec succès", "ok": True},
        status=status.HTTP_201_CREATED,
    )


# ─── patients ───────────────────────────────────────────────────────────────

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def patients(request):
    organisation_id = request.user.organisation_id

    if request.method == "GET":
        qs = Patient.objects.filter(organisation_id=organisation_id).select_related("contact")
        return Response(PatientSerializer(qs, many=True).data)

    # POST
    body = request.data
    try:
        date_naissance = datetime.fromisoformat(body["dateNaissance"].replace("Z", "+00:00"))
    except (KeyError, ValueError):
        return Response({"error": "dateNaissance invalide"}, status=status.HTTP_400_BAD_REQUEST)

    contact = Contact.objects.create(
        nom=body.get("nom"),
        prenom=body.get("prenom"),
        sexe=body.get("sexe"),
        telephone=body.get("telephone"),
        adresse=body.get("adresse"),
        ville=body.get("ville"),
        code_postal=body.get("codePostal"),
        numero_secu=body.get("numeroSecu"),
        email=body.get("email"),
        date_naissance=date_naissance,
        age=_calcul_age(date_naissance),
        organisation_id=organisation_id,
    )

    patient = Patient.objects.create(
        type_patient=body.get("typePatient"),
        convention=body.get("convention"),
        statut=body.get("statut"),
        service=body.get("service"),
        medecin_traitant=body.get("medecinTraitant"),
        contact_urgence=body.get("contactUrgence"),
        telephone_urgence=body.get("telephoneUrgence"),
        allergies=body.get("allergies"),
        antecedents=body.get("antecedents"),
        traitements=body.get("traitements"),
        contact=contact,
        organisation_id=organisation_id,
    )

    return Response(PatientSerializer(patient).data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def patients_count(request):
    count = Patient.objects.filter(organisation_id=request.user.organisation_id).count()
    return Response(count)


# ─── dossiers ───────────────────────────────────────────────────────────────

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def dossiers(request):
    organisation_id = request.user.organisation_id

    if request.method == "GET":
        qs = DossierPatient.objects.filter(
            organisation_id=organisation_id
        ).select_related("patient__contact", "service").prefetch_related("tickets")
        return Response(DossierPatientSerializer(qs, many=True).data)

    # POST
    body = request.data
    total = DossierPatient.objects.count()
    code = _generate_code("DP", total + 1)

    dossier = DossierPatient.objects.create(
        code=code,
        patient_id=body.get("patientId"),
        service_id=body.get("serviceId"),
        medecin_traitant_id=body.get("medecinTraitantId"),
        motif_de_visite=body.get("motifDeVisite"),
        niveau_urgence=body.get("niveauUrgence"),
        statut=body.get("statut", "attente"),
        organisation_id=organisation_id,
    )

    if dossier.patient_id:
        Patient.objects.filter(pk=dossier.patient_id).update(
            derniere_visite=dossier.created_at
        )

    dossier.refresh_from_db()
    return Response(DossierPatientSerializer(dossier).data, status=status.HTTP_201_CREATED)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def dossier_update(request, pk):
    try:
        dossier = DossierPatient.objects.get(pk=pk)
    except DossierPatient.DoesNotExist:
        return Response({"error": "Dossier introuvable"}, status=status.HTTP_404_NOT_FOUND)

    body = request.data
    service_id = body.get("serviceId")
    statut = body.get("statut")

    dossier.service_id = service_id
    dossier.statut = statut
    dossier.save()

    if dossier.patient_id:
        Patient.objects.filter(pk=dossier.patient_id).update(
            derniere_visite=dossier.created_at
        )

    # Create ticket for the service
    if dossier.service and dossier.service.code:
        code_prefix = dossier.service.code[:2]
        today_start, today_end = _day_range()
        len_tickets = Ticket.objects.filter(
            code__startswith=code_prefix,
            created_at__gte=today_start,
            created_at__lte=today_end,
        ).count()
        Ticket.objects.create(
            dossier_patient=dossier,
            code=_generate_ticket_code(code_prefix, len_tickets + 1),
            organisation_id=dossier.organisation_id,
        )

    dossier.refresh_from_db()
    return Response(DossierPatientSerializer(dossier).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dossiers_today(request):
    start, end = _day_range()
    qs = (
        DossierPatient.objects.filter(created_at__gte=start, created_at__lte=end)
        .select_related("patient__contact", "service")
        .prefetch_related("tickets")
        .order_by("created_at")
    )
    items = list(qs)
    items.sort(key=lambda d: (0 if d.niveau_urgence == "urgente" else 1))
    return Response(DossierPatientSerializer(items, many=True).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dossiers_yesterday(request):
    yesterday = dj_timezone.now().date() - timedelta(days=1)
    start, end = _day_range(yesterday)
    qs = DossierPatient.objects.filter(
        created_at__gte=start, created_at__lte=end
    ).only("id", "statut", "niveau_urgence")
    return Response(DossierYesterdaySerializer(qs, many=True).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dossiers_count(request):
    count = DossierPatient.objects.count()
    now = dj_timezone.now()
    current_month = now.month
    this_start, this_end = _pair_month(current_month)
    past_month = (current_month - 2) % 12 + 1
    past_start, past_end = _pair_month(past_month)

    count_this_month = DossierPatient.objects.filter(
        created_at__gte=this_start, created_at__lt=this_end
    ).count()
    count_past_month = DossierPatient.objects.filter(
        created_at__gte=past_start, created_at__lt=past_end
    ).count()

    return Response(
        {
            "count": count,
            "countDossiersThisMonth": count_this_month,
            "countDossiersPastMonth": count_past_month,
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dossiers_by_date(request, date):
    try:
        d = datetime.strptime(date, "%Y-%m-%d").date()
    except ValueError:
        return Response({"error": "Format de date invalide (attendu: YYYY-MM-DD)"}, status=400)
    start, end = _day_range(d)
    qs = (
        DossierPatient.objects.filter(created_at__gte=start, created_at__lte=end)
        .select_related("patient__contact", "service")
        .prefetch_related("tickets")
    )
    return Response(DossierPatientSerializer(qs, many=True).data)


# ─── hospital / services ────────────────────────────────────────────────────

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def hospital_services(request):
    qs = Service.objects.all()
    return Response(ServiceSerializer(qs, many=True).data)


# ─── hospital / tickets ─────────────────────────────────────────────────────

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def hospital_tickets(request):
    today_start, today_end = _day_range()
    qs = (
        Ticket.objects.filter(created_at__gte=today_start, created_at__lte=today_end)
        .select_related("dossier_patient__service")
        .order_by("created_at")
    )
    return Response(TicketWithDossierSerializer(qs, many=True).data)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def hospital_ticket_update(request, pk):
    try:
        ticket = Ticket.objects.get(pk=pk)
    except Ticket.DoesNotExist:
        return Response({"error": "Ticket introuvable"}, status=status.HTTP_404_NOT_FOUND)

    for field, value in request.data.items():
        setattr(ticket, field, value)
    ticket.save()
    return Response(TicketSerializer(ticket).data)


# ─── soins (stub) ────────────────────────────────────────────────────────────

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def soins(request):
    if request.method == "GET":
        return Response([])
    return Response(request.data, status=status.HTTP_201_CREATED)

