from rest_framework import serializers
from .models import (
    Organisation,
    Contact,
    Role,
    Fonction,
    Permission,
    RolePermission,
    Service,
    Employe,
    Patient,
    DossierPatient,
    Ticket,
    User,
)


class OrganisationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organisation
        fields = "__all__"


class FonctionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fonction
        fields = "__all__"


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = "__all__"


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = "__all__"


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = "__all__"


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ["id", "nom", "description", "statut", "created_at", "code"]


class EmployeSerializer(serializers.ModelSerializer):
    contact = ContactSerializer(read_only=True)

    class Meta:
        model = Employe
        fields = "__all__"


class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = "__all__"


class PatientSerializer(serializers.ModelSerializer):
    contact = ContactSerializer(read_only=True)

    class Meta:
        model = Patient
        fields = "__all__"


class DossierPatientSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(read_only=True)
    service = ServiceSerializer(read_only=True)
    tickets = TicketSerializer(many=True, read_only=True)

    class Meta:
        model = DossierPatient
        fields = "__all__"


class DossierYesterdaySerializer(serializers.ModelSerializer):
    class Meta:
        model = DossierPatient
        fields = ["id", "statut", "niveau_urgence"]


class TicketWithDossierSerializer(serializers.ModelSerializer):
    dossier_patient = DossierPatientSerializer(read_only=True)

    class Meta:
        model = Ticket
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    contact = ContactSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "access_type",
            "contact",
            "organisation",
            "role",
            "created_at",
        ]


class SignupSerializer(serializers.Serializer):
    name = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    organization = serializers.CharField(required=False, allow_blank=True, default="")
    position = serializers.CharField(required=False, allow_blank=True, default="")
    telephone = serializers.CharField(required=False, allow_blank=True, default="")
    establishment_type = serializers.CharField(required=False, allow_blank=True, default="")
    is_demo_request = serializers.BooleanField(required=False, default=False)


# ─── Nouveaux serializers HMS ──────────────────────────────────────────────────

from .models import (
    Facture, LigneFacture, SoinInfirmier, RendezVous,
    ExamenLabo, ExamenImagerie,
    Medicament, Ordonnance, LigneOrdonnance, DispensationMedicament,
    Chambre, Lit, Admission, Transfert,
    Depense, ConsultationMedicale, Log,
)


class ServiceFullSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = "__all__"


class LigneFactureSerializer(serializers.ModelSerializer):
    class Meta:
        model = LigneFacture
        fields = "__all__"


class FactureSerializer(serializers.ModelSerializer):
    lignes = LigneFactureSerializer(many=True, read_only=True)
    patient = PatientSerializer(read_only=True)

    class Meta:
        model = Facture
        fields = "__all__"


class SoinInfirmierSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(read_only=True)

    class Meta:
        model = SoinInfirmier
        fields = "__all__"


class RendezVousSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(read_only=True)
    medecin = EmployeSerializer(read_only=True)

    class Meta:
        model = RendezVous
        fields = "__all__"


class ExamenLaboSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(read_only=True)

    class Meta:
        model = ExamenLabo
        fields = "__all__"


class ExamenImagerieSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(read_only=True)

    class Meta:
        model = ExamenImagerie
        fields = "__all__"


class MedicamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicament
        fields = "__all__"


class LigneOrdonnanceSerializer(serializers.ModelSerializer):
    medicament = MedicamentSerializer(read_only=True)

    class Meta:
        model = LigneOrdonnance
        fields = "__all__"


class OrdonnanceSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(read_only=True)
    medecin = EmployeSerializer(read_only=True)
    lignes = LigneOrdonnanceSerializer(many=True, read_only=True)

    class Meta:
        model = Ordonnance
        fields = "__all__"


class DispensationMedicamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = DispensationMedicament
        fields = "__all__"


class LitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lit
        fields = "__all__"


class ChambreSerializer(serializers.ModelSerializer):
    lits = LitSerializer(many=True, read_only=True)
    service = ServiceSerializer(read_only=True)

    class Meta:
        model = Chambre
        fields = "__all__"


class AdmissionSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(read_only=True)
    lit = LitSerializer(read_only=True)
    medecin = EmployeSerializer(read_only=True)

    class Meta:
        model = Admission
        fields = "__all__"


class TransfertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transfert
        fields = "__all__"


class DepenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Depense
        fields = "__all__"


class ConsultationMedicaleSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(read_only=True)
    medecin = EmployeSerializer(read_only=True)

    class Meta:
        model = ConsultationMedicale
        fields = "__all__"


class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Log
        fields = "__all__"
