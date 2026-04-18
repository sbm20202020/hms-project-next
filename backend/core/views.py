import math
from calendar import monthrange
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
            status=status.HTTP_400_BAD_REQUEST,
        )

    data = serializer.validated_data

    from django.contrib.auth.hashers import make_password
    from .models import User

    if User.objects.filter(email=data["email"]).exists():
        return Response(
            {
                "error": "Un utilisateur avec cet email existe déjà",
                "ok": False,
                "trueStatus": 409,
            },
            status=status.HTTP_409_CONFLICT,
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
        return Response({"error": "Format de date invalide (attendu: YYYY-MM-DD)"}, status=status.HTTP_400_BAD_REQUEST)
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

    ALLOWED_FIELDS = {"status", "date_called", "date_done"}
    for field in ALLOWED_FIELDS:
        if field in request.data:
            setattr(ticket, field, request.data[field])
    ticket.save()
    return Response(TicketSerializer(ticket).data)


# ─── soins (stub) ────────────────────────────────────────────────────────────

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def soins(request):
    if request.method == "GET":
        return Response([])
    return Response(request.data, status=status.HTTP_201_CREATED)



# ─── Imports des nouveaux modèles et serializers ─────────────────────────────

from .models import (
    Facture, LigneFacture, SoinInfirmier, RendezVous,
    ExamenLabo, ExamenImagerie,
    Medicament, Ordonnance, LigneOrdonnance, DispensationMedicament,
    Chambre, Lit, Admission, Transfert, Depense, ConsultationMedicale, Log,
    Employe,
)
from .serializers import (
    FactureSerializer, LigneFactureSerializer,
    SoinInfirmierSerializer, RendezVousSerializer,
    ExamenLaboSerializer, ExamenImagerieSerializer,
    MedicamentSerializer, OrdonnanceSerializer, LigneOrdonnanceSerializer,
    DispensationMedicamentSerializer,
    ChambreSerializer, LitSerializer, AdmissionSerializer, TransfertSerializer,
    DepenseSerializer, ConsultationMedicaleSerializer,
    EmployeSerializer, ServiceFullSerializer, LogSerializer,
)


# ─── Factures ────────────────────────────────────────────────────────────────

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def factures(request):
    org_id = request.user.organisation_id
    if request.method == "GET":
        qs = Facture.objects.filter(organisation_id=org_id).select_related(
            "patient__contact"
        ).prefetch_related("lignes").order_by("-created_at")
        return Response(FactureSerializer(qs, many=True).data)
    body = request.data
    total = Facture.objects.filter(organisation_id=org_id).count()
    numero = _generate_code("FAC", total + 1)
    facture = Facture.objects.create(
        numero_facture=numero,
        patient_id=body.get("patientId"),
        dossier_id=body.get("dossierId"),
        statut=body.get("statut", "En attente"),
        type_assurance=body.get("typeAssurance", "Aucune"),
        notes=body.get("notes"),
        created_by=request.user,
        organisation_id=org_id,
    )
    total_montant = 0
    for ligne in body.get("lignes", []):
        qte = int(ligne.get("quantite", 1))
        prix = float(ligne.get("prixUnitaire", 0))
        montant = qte * prix
        total_montant += montant
        LigneFacture.objects.create(
            facture=facture,
            description=ligne.get("description", ""),
            quantite=qte,
            prix_unitaire=prix,
            montant=montant,
        )
    facture.montant_total = total_montant
    facture.save()
    facture.refresh_from_db()
    return Response(FactureSerializer(facture).data, status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def facture_detail(request, pk):
    try:
        facture = Facture.objects.get(pk=pk)
    except Facture.DoesNotExist:
        return Response({"error": "Facture introuvable"}, status=status.HTTP_404_NOT_FOUND)
    if request.method == "GET":
        return Response(FactureSerializer(facture).data)
    body = request.data
    for field in ["statut", "notes"]:
        if field in body:
            setattr(facture, field, body[field])
    if "methode_paiement" in body:
        facture.methode_paiement = body["methode_paiement"]
    if "methodePaiement" in body:
        facture.methode_paiement = body["methodePaiement"]
    facture.save()
    return Response(FactureSerializer(facture).data)


# ─── Soins infirmiers ─────────────────────────────────────────────────────────

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def soins_infirmiers(request):
    org_id = request.user.organisation_id
    if request.method == "GET":
        qs = SoinInfirmier.objects.filter(organisation_id=org_id).select_related(
            "patient__contact"
        ).order_by("-date_heure")
        return Response(SoinInfirmierSerializer(qs, many=True).data)
    body = request.data
    soin = SoinInfirmier.objects.create(
        patient_id=body.get("patientId"),
        dossier_id=body.get("dossierId"),
        infirmier_id=body.get("infirmierId"),
        tension=body.get("tension"),
        temperature=body.get("temperature") or None,
        pouls=body.get("pouls") or None,
        respiration=body.get("respiration") or None,
        saturation=body.get("saturation") or None,
        poids=body.get("poids") or None,
        taille=body.get("taille") or None,
        soins_effectues=body.get("soinsEffectues", []),
        statut=body.get("statut", "Terminé"),
        observations=body.get("observations"),
        organisation_id=org_id,
    )
    return Response(SoinInfirmierSerializer(soin).data, status=status.HTTP_201_CREATED)


# ─── Rendez-vous ──────────────────────────────────────────────────────────────

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def rendez_vous(request):
    org_id = request.user.organisation_id
    if request.method == "GET":
        qs = RendezVous.objects.filter(organisation_id=org_id).select_related(
            "patient__contact", "medecin__contact"
        )
        return Response(RendezVousSerializer(qs, many=True).data)
    body = request.data
    rdv = RendezVous.objects.create(
        patient_id=body.get("patientId"),
        medecin_id=body.get("medecinId"),
        date=body.get("date"),
        heure=body.get("heure"),
        type=body.get("type", "Consultation"),
        statut=body.get("statut", "En attente"),
        duree=body.get("duree", 30),
        notes=body.get("notes"),
        organisation_id=org_id,
    )
    return Response(RendezVousSerializer(rdv).data, status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def rendez_vous_detail(request, pk):
    try:
        rdv = RendezVous.objects.get(pk=pk)
    except RendezVous.DoesNotExist:
        return Response({"error": "Rendez-vous introuvable"}, status=status.HTTP_404_NOT_FOUND)
    if request.method == "GET":
        return Response(RendezVousSerializer(rdv).data)
    if request.method == "DELETE":
        rdv.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    body = request.data
    for field in ["date", "heure", "type", "statut", "duree", "notes"]:
        if field in body:
            setattr(rdv, field, body[field])
    rdv.save()
    return Response(RendezVousSerializer(rdv).data)


# ─── Laboratoire ──────────────────────────────────────────────────────────────

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def examens_labo(request):
    org_id = request.user.organisation_id
    if request.method == "GET":
        qs = ExamenLabo.objects.filter(organisation_id=org_id).select_related(
            "patient__contact"
        ).order_by("-date_demande")
        return Response(ExamenLaboSerializer(qs, many=True).data)
    body = request.data
    examen = ExamenLabo.objects.create(
        patient_id=body.get("patientId"),
        dossier_id=body.get("dossierId"),
        type_examen=body.get("typeExamen", ""),
        statut=body.get("statut", "Demandé"),
        notes=body.get("notes"),
        demande_par_id=body.get("demandeParId"),
        organisation_id=org_id,
    )
    return Response(ExamenLaboSerializer(examen).data, status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def examen_labo_detail(request, pk):
    try:
        examen = ExamenLabo.objects.get(pk=pk)
    except ExamenLabo.DoesNotExist:
        return Response({"error": "Examen introuvable"}, status=status.HTTP_404_NOT_FOUND)
    if request.method == "GET":
        return Response(ExamenLaboSerializer(examen).data)
    body = request.data
    for field in ["statut", "resultats", "notes"]:
        if field in body:
            setattr(examen, field, body[field])
    if "dateResultat" in body:
        examen.date_resultat = body["dateResultat"]
    examen.save()
    return Response(ExamenLaboSerializer(examen).data)


# ─── Imagerie ─────────────────────────────────────────────────────────────────

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def examens_imagerie(request):
    org_id = request.user.organisation_id
    if request.method == "GET":
        qs = ExamenImagerie.objects.filter(organisation_id=org_id).select_related(
            "patient__contact"
        ).order_by("-date_demande")
        return Response(ExamenImagerieSerializer(qs, many=True).data)
    body = request.data
    examen = ExamenImagerie.objects.create(
        patient_id=body.get("patientId"),
        dossier_id=body.get("dossierId"),
        type=body.get("type", "Radiographie"),
        statut=body.get("statut", "Demandé"),
        notes=body.get("notes"),
        demande_par_id=body.get("demandeParId"),
        organisation_id=org_id,
    )
    return Response(ExamenImagerieSerializer(examen).data, status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def examen_imagerie_detail(request, pk):
    try:
        examen = ExamenImagerie.objects.get(pk=pk)
    except ExamenImagerie.DoesNotExist:
        return Response({"error": "Examen introuvable"}, status=status.HTTP_404_NOT_FOUND)
    if request.method == "GET":
        return Response(ExamenImagerieSerializer(examen).data)
    body = request.data
    for field in ["statut", "notes"]:
        if field in body:
            setattr(examen, field, body[field])
    if "compteRendu" in body:
        examen.compte_rendu = body["compteRendu"]
    if "compte_rendu" in body:
        examen.compte_rendu = body["compte_rendu"]
    if "dateResultat" in body:
        examen.date_resultat = body["dateResultat"]
    examen.save()
    return Response(ExamenImagerieSerializer(examen).data)


# ─── Pharmacie ────────────────────────────────────────────────────────────────

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def medicaments(request):
    org_id = request.user.organisation_id
    if request.method == "GET":
        qs = Medicament.objects.filter(organisation_id=org_id)
        return Response(MedicamentSerializer(qs, many=True).data)
    body = request.data
    med = Medicament.objects.create(
        nom=body.get("nom", ""),
        dci=body.get("dci"),
        forme=body.get("forme", "Comprimé"),
        stock=int(body.get("stock", 0)),
        seuil_alerte=int(body.get("seuilAlerte", 10)),
        prix=float(body.get("prix", 0)),
        description=body.get("description"),
        organisation_id=org_id,
    )
    return Response(MedicamentSerializer(med).data, status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def medicament_detail(request, pk):
    try:
        med = Medicament.objects.get(pk=pk)
    except Medicament.DoesNotExist:
        return Response({"error": "Médicament introuvable"}, status=status.HTTP_404_NOT_FOUND)
    if request.method == "GET":
        return Response(MedicamentSerializer(med).data)
    if request.method == "DELETE":
        med.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    body = request.data
    for field in ["nom", "dci", "forme", "stock", "prix", "description", "statut"]:
        if field in body:
            setattr(med, field, body[field])
    if "seuilAlerte" in body:
        med.seuil_alerte = body["seuilAlerte"]
    med.save()
    return Response(MedicamentSerializer(med).data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def ordonnances(request):
    org_id = request.user.organisation_id
    if request.method == "GET":
        qs = Ordonnance.objects.filter(organisation_id=org_id).select_related(
            "patient__contact", "medecin__contact"
        ).prefetch_related("lignes__medicament").order_by("-created_at")
        return Response(OrdonnanceSerializer(qs, many=True).data)
    body = request.data
    ordonnance = Ordonnance.objects.create(
        patient_id=body.get("patientId"),
        medecin_id=body.get("medecinId"),
        statut=body.get("statut", "En attente"),
        notes=body.get("notes"),
        organisation_id=org_id,
    )
    for ligne in body.get("lignes", []):
        LigneOrdonnance.objects.create(
            ordonnance=ordonnance,
            medicament_id=ligne.get("medicamentId"),
            quantite=ligne.get("quantite", 1),
            posologie=ligne.get("posologie"),
            duree=ligne.get("duree"),
        )
    ordonnance.refresh_from_db()
    return Response(OrdonnanceSerializer(ordonnance).data, status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def ordonnance_detail(request, pk):
    try:
        ordonnance = Ordonnance.objects.get(pk=pk)
    except Ordonnance.DoesNotExist:
        return Response({"error": "Ordonnance introuvable"}, status=status.HTTP_404_NOT_FOUND)
    if request.method == "GET":
        return Response(OrdonnanceSerializer(ordonnance).data)
    body = request.data
    if "statut" in body:
        ordonnance.statut = body["statut"]
    ordonnance.save()
    if ordonnance.statut == "Dispensée":
        DispensationMedicament.objects.get_or_create(
            ordonnance=ordonnance,
            defaults={
                "pharmacien_id": body.get("pharmacienId"),
                "organisation_id": ordonnance.organisation_id,
            }
        )
    return Response(OrdonnanceSerializer(ordonnance).data)


# ─── Chambres & Lits ─────────────────────────────────────────────────────────

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def chambres(request):
    org_id = request.user.organisation_id
    if request.method == "GET":
        qs = Chambre.objects.filter(organisation_id=org_id).select_related(
            "service"
        ).prefetch_related("lits")
        return Response(ChambreSerializer(qs, many=True).data)
    body = request.data
    chambre = Chambre.objects.create(
        numero=body.get("numero", ""),
        type=body.get("type", "Simple"),
        service_id=body.get("serviceId"),
        statut=body.get("statut", "Disponible"),
        nombre_lits=int(body.get("nombreLits", 1)),
        description=body.get("description"),
        organisation_id=org_id,
    )
    for i in range(1, chambre.nombre_lits + 1):
        Lit.objects.create(chambre=chambre, numero=str(i))
    chambre.refresh_from_db()
    return Response(ChambreSerializer(chambre).data, status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def chambre_detail(request, pk):
    try:
        chambre = Chambre.objects.get(pk=pk)
    except Chambre.DoesNotExist:
        return Response({"error": "Chambre introuvable"}, status=status.HTTP_404_NOT_FOUND)
    if request.method == "GET":
        return Response(ChambreSerializer(chambre).data)
    if request.method == "DELETE":
        chambre.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    body = request.data
    for field in ["numero", "type", "statut", "description"]:
        if field in body:
            setattr(chambre, field, body[field])
    if "serviceId" in body:
        chambre.service_id = body["serviceId"]
    chambre.save()
    return Response(ChambreSerializer(chambre).data)


# ─── Admissions ──────────────────────────────────────────────────────────────

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def admissions(request):
    org_id = request.user.organisation_id
    if request.method == "GET":
        qs = Admission.objects.filter(organisation_id=org_id).select_related(
            "patient__contact", "lit__chambre", "medecin__contact"
        ).order_by("-created_at")
        return Response(AdmissionSerializer(qs, many=True).data)
    body = request.data
    admission = Admission.objects.create(
        patient_id=body.get("patientId"),
        dossier_id=body.get("dossierId"),
        lit_id=body.get("litId"),
        medecin_id=body.get("medecinId"),
        date_sortie_prevue=body.get("dateSortiePrevue") or None,
        motif=body.get("motif"),
        statut=body.get("statut", "En cours"),
        notes=body.get("notes"),
        organisation_id=org_id,
    )
    if admission.lit_id:
        Lit.objects.filter(pk=admission.lit_id).update(statut="Occupé")
    return Response(AdmissionSerializer(admission).data, status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def admission_detail(request, pk):
    try:
        admission = Admission.objects.get(pk=pk)
    except Admission.DoesNotExist:
        return Response({"error": "Admission introuvable"}, status=status.HTTP_404_NOT_FOUND)
    if request.method == "GET":
        return Response(AdmissionSerializer(admission).data)
    body = request.data
    old_lit_id = admission.lit_id
    for field in ["statut", "notes", "motif"]:
        if field in body:
            setattr(admission, field, body[field])
    if "dateSortieReelle" in body:
        admission.date_sortie_reelle = body["dateSortieReelle"]
    if "litId" in body:
        admission.lit_id = body["litId"]
    admission.save()
    if admission.statut in ("Sorti", "Transféré") and old_lit_id:
        Lit.objects.filter(pk=old_lit_id).update(statut="Libre")
    return Response(AdmissionSerializer(admission).data)


# ─── Finance ─────────────────────────────────────────────────────────────────

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def depenses(request):
    org_id = request.user.organisation_id
    if request.method == "GET":
        qs = Depense.objects.filter(organisation_id=org_id).order_by("-date")
        return Response(DepenseSerializer(qs, many=True).data)
    body = request.data
    depense = Depense.objects.create(
        categorie=body.get("categorie", "Autres"),
        montant=float(body.get("montant", 0)),
        description=body.get("description"),
        date=body.get("date"),
        justificatif=body.get("justificatif"),
        created_by=request.user,
        organisation_id=org_id,
    )
    return Response(DepenseSerializer(depense).data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def finance_revenus(request):
    from django.db.models import Sum
    org_id = request.user.organisation_id
    qs = Facture.objects.filter(organisation_id=org_id, statut="Payée")
    total = qs.aggregate(total=Sum("montant_total"))["total"] or 0
    now = dj_timezone.now()
    par_mois = []
    for i in range(6):
        m = (now.month - i - 1) % 12 + 1
        y = now.year if (now.month - i) > 0 else now.year - 1
        start, end = _pair_month(m)
        s = qs.filter(date_facture__gte=start, date_facture__lt=end).aggregate(
            s=Sum("montant_total"))["s"] or 0
        par_mois.append({"mois": m, "annee": y, "total": float(s)})
    return Response({"totalRevenus": float(total), "parMois": par_mois})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def finance_dashboard(request):
    from django.db.models import Sum
    org_id = request.user.organisation_id
    now = dj_timezone.now()
    start, end = _pair_month(now.month)
    revenus = Facture.objects.filter(
        organisation_id=org_id, statut="Payée",
        date_facture__gte=start, date_facture__lt=end,
    ).aggregate(s=Sum("montant_total"))["s"] or 0
    dep_mois = Depense.objects.filter(
        organisation_id=org_id,
        date__gte=start.date(), date__lt=end.date(),
    ).aggregate(s=Sum("montant"))["s"] or 0
    en_attente = Facture.objects.filter(
        organisation_id=org_id, statut__in=["En attente", "Validée"]
    ).aggregate(s=Sum("montant_total"))["s"] or 0
    return Response({
        "totalRevenus": float(revenus),
        "totalDepenses": float(dep_mois),
        "beneficeNet": float(revenus) - float(dep_mois),
        "enAttente": float(en_attente),
    })


# ─── Consultations médicales ──────────────────────────────────────────────────

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def consultations(request):
    org_id = request.user.organisation_id
    if request.method == "GET":
        qs = ConsultationMedicale.objects.filter(organisation_id=org_id).select_related(
            "patient__contact", "medecin__contact"
        ).order_by("-date")
        return Response(ConsultationMedicaleSerializer(qs, many=True).data)
    body = request.data
    c = ConsultationMedicale.objects.create(
        patient_id=body.get("patientId"),
        dossier_id=body.get("dossierId"),
        medecin_id=body.get("medecinId"),
        anamnese=body.get("anamnese"),
        diagnostic=body.get("diagnostic"),
        prescription=body.get("prescription"),
        notes=body.get("notes"),
        statut=body.get("statut", "En cours"),
        organisation_id=org_id,
    )
    return Response(ConsultationMedicaleSerializer(c).data, status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def consultation_detail(request, pk):
    try:
        c = ConsultationMedicale.objects.get(pk=pk)
    except ConsultationMedicale.DoesNotExist:
        return Response({"error": "Consultation introuvable"}, status=status.HTTP_404_NOT_FOUND)
    if request.method == "GET":
        return Response(ConsultationMedicaleSerializer(c).data)
    body = request.data
    for field in ["anamnese", "diagnostic", "prescription", "notes", "statut"]:
        if field in body:
            setattr(c, field, body[field])
    c.save()
    return Response(ConsultationMedicaleSerializer(c).data)


# ─── Employés ─────────────────────────────────────────────────────────────────

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def employes(request):
    org_id = request.user.organisation_id
    if request.method == "GET":
        qs = Employe.objects.filter(organisation_id=org_id).select_related("contact", "service")
        return Response(EmployeSerializer(qs, many=True).data)
    body = request.data
    contact = Contact.objects.create(
        nom=body.get("nom", ""),
        prenom=body.get("prenom", ""),
        email=body.get("email"),
        telephone=body.get("telephone"),
        sexe=body.get("sexe"),
        adresse=body.get("adresse"),
        organisation_id=org_id,
    )
    emp = Employe.objects.create(
        contact=contact,
        service_id=body.get("serviceId"),
        statut=body.get("statut", "Actif"),
        organisation_id=org_id,
    )
    return Response(EmployeSerializer(emp).data, status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def employe_detail(request, pk):
    try:
        emp = Employe.objects.get(pk=pk)
    except Employe.DoesNotExist:
        return Response({"error": "Employé introuvable"}, status=status.HTTP_404_NOT_FOUND)
    if request.method == "GET":
        return Response(EmployeSerializer(emp).data)
    if request.method == "DELETE":
        emp.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    body = request.data
    if emp.contact:
        for field in ["nom", "prenom", "email", "telephone", "sexe", "adresse"]:
            if field in body:
                setattr(emp.contact, field, body[field])
        emp.contact.save()
    if "serviceId" in body:
        emp.service_id = body["serviceId"]
    if "statut" in body:
        emp.statut = body["statut"]
    emp.save()
    return Response(EmployeSerializer(emp).data)


# ─── Services hospitaliers (CRUD complet) ────────────────────────────────────

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def hospital_services_crud(request):
    org_id = request.user.organisation_id
    if request.method == "GET":
        qs = Service.objects.filter(organisation_id=org_id)
        return Response(ServiceFullSerializer(qs, many=True).data)
    body = request.data
    svc = Service.objects.create(
        nom=body.get("nom", ""),
        description=body.get("description"),
        code=body.get("code"),
        statut=body.get("statut", "Actif"),
        is_required_nurse_service=body.get("isRequiredNurseService", False),
        is_required_doctor_service=body.get("isRequiredDoctorService", False),
        is_required_pharmacist_service=body.get("isRequiredPharmacistService", False),
        is_required_lab_service=body.get("isRequiredLabService", False),
        is_required_radiology_service=body.get("isRequiredRadiologyService", False),
        is_required_imaging_service=body.get("isRequiredImagingService", False),
        organisation_id=org_id,
    )
    return Response(ServiceFullSerializer(svc).data, status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def hospital_service_detail(request, pk):
    try:
        svc = Service.objects.get(pk=pk)
    except Service.DoesNotExist:
        return Response({"error": "Service introuvable"}, status=status.HTTP_404_NOT_FOUND)
    if request.method == "GET":
        return Response(ServiceFullSerializer(svc).data)
    if request.method == "DELETE":
        svc.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    body = request.data
    for field in ["nom", "description", "code", "statut"]:
        if field in body:
            setattr(svc, field, body[field])
    for bool_field in [
        "isRequiredNurseService", "isRequiredDoctorService",
        "isRequiredPharmacistService", "isRequiredLabService",
        "isRequiredRadiologyService", "isRequiredImagingService",
    ]:
        if bool_field in body:
            snake = "is_required_" + bool_field[2].lower() + bool_field[3:].replace(
                "NurseService", "nurse_service").replace(
                "DoctorService", "doctor_service").replace(
                "PharmacistService", "pharmacist_service").replace(
                "LabService", "lab_service").replace(
                "RadiologyService", "radiology_service").replace(
                "ImagingService", "imaging_service")
            setattr(svc, snake, body[bool_field])
    svc.save()
    return Response(ServiceFullSerializer(svc).data)


# ─── Logs ─────────────────────────────────────────────────────────────────────

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def logs(request):
    org_id = request.user.organisation_id
    qs = Log.objects.filter(organisation_id=org_id).order_by("-created_at")[:100]
    return Response(LogSerializer(qs, many=True).data)
