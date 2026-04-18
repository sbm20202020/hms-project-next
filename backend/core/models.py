from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


class Organisation(models.Model):
    nom = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "organisation"

    def __str__(self):
        return self.nom or f"Organisation #{self.id}"


class Fonction(models.Model):
    nom = models.CharField(max_length=255, unique=True)
    code = models.CharField(max_length=100, unique=True)
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "fonction"

    def __str__(self):
        return self.nom


class Contact(models.Model):
    nom = models.CharField(max_length=255, null=True, blank=True)
    prenom = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    telephone = models.CharField(max_length=50, null=True, blank=True)
    date_naissance = models.DateTimeField(null=True, blank=True)
    age = models.IntegerField(null=True, blank=True)
    sexe = models.CharField(max_length=50, null=True, blank=True)
    adresse = models.TextField(null=True, blank=True)
    ville = models.CharField(max_length=255, null=True, blank=True)
    code_postal = models.CharField(max_length=20, null=True, blank=True)
    numero_secu = models.CharField(max_length=100, null=True, blank=True)
    establishment_type = models.CharField(max_length=255, null=True, blank=True)
    organization = models.CharField(max_length=255, null=True, blank=True)
    position = models.CharField(max_length=255, null=True, blank=True)
    is_demo_request = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    organisation = models.ForeignKey(
        Organisation, on_delete=models.CASCADE, related_name="contacts"
    )

    class Meta:
        db_table = "contact"

    def __str__(self):
        return f"{self.prenom} {self.nom}"


class Role(models.Model):
    nom = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    statut = models.CharField(max_length=50, default="Actif")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    organisation = models.ForeignKey(
        Organisation, on_delete=models.CASCADE, related_name="roles"
    )

    class Meta:
        db_table = "role"

    def __str__(self):
        return self.nom


class Permission(models.Model):
    name = models.CharField(max_length=255)
    statut = models.CharField(max_length=50, default="Actif")
    can_create = models.BooleanField(default=False)
    can_read = models.BooleanField(default=False)
    can_update = models.BooleanField(default=False)
    can_delete = models.BooleanField(default=False)
    fonction = models.ForeignKey(
        Fonction,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="permissions",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    organisation = models.ForeignKey(
        Organisation, on_delete=models.CASCADE, related_name="permissions"
    )

    class Meta:
        db_table = "permission"

    def __str__(self):
        return self.name


class RolePermission(models.Model):
    role = models.ForeignKey(
        Role,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="role_permissions",
    )
    permission = models.ForeignKey(
        Permission,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="role_permissions",
    )

    class Meta:
        db_table = "role_permission"
        unique_together = ("role", "permission")


class Service(models.Model):
    nom = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    statut = models.CharField(max_length=50, default="Actif")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    code = models.CharField(max_length=100, null=True, blank=True)
    organisation = models.ForeignKey(
        Organisation, on_delete=models.CASCADE, related_name="services"
    )
    is_required_nurse_service = models.BooleanField(default=False)
    is_required_doctor_service = models.BooleanField(default=False)
    is_required_pharmacist_service = models.BooleanField(default=False)
    is_required_lab_service = models.BooleanField(default=False)
    is_required_radiology_service = models.BooleanField(default=False)
    is_required_imaging_service = models.BooleanField(default=False)

    class Meta:
        db_table = "service"

    def __str__(self):
        return self.nom


class Employe(models.Model):
    statut = models.CharField(max_length=50, default="Actif")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    service = models.ForeignKey(
        Service,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="employes",
    )
    contact = models.ForeignKey(
        Contact,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="employes",
    )
    organisation = models.ForeignKey(
        Organisation, on_delete=models.CASCADE, related_name="employes"
    )

    class Meta:
        db_table = "employe"

    def __str__(self):
        return f"Employe #{self.id}"


class Patient(models.Model):
    type_patient = models.CharField(max_length=100, null=True, blank=True)
    convention = models.CharField(max_length=255, null=True, blank=True)
    contact_urgence = models.CharField(max_length=255, null=True, blank=True)
    telephone_urgence = models.CharField(max_length=50, null=True, blank=True)
    allergies = models.TextField(null=True, blank=True)
    antecedents = models.TextField(null=True, blank=True)
    traitements = models.TextField(null=True, blank=True)
    statut = models.CharField(max_length=50, null=True, blank=True)
    service = models.CharField(max_length=255, null=True, blank=True)
    medecin_traitant = models.CharField(max_length=255, null=True, blank=True)
    derniere_visite = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    contact = models.ForeignKey(
        Contact,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="patients",
    )
    organisation = models.ForeignKey(
        Organisation, on_delete=models.CASCADE, related_name="patients"
    )

    class Meta:
        db_table = "patient"

    def __str__(self):
        return f"Patient #{self.id}"


class DossierPatient(models.Model):
    code = models.CharField(max_length=100, null=True, blank=True)
    motif_de_visite = models.TextField(null=True, blank=True)
    niveau_urgence = models.CharField(max_length=50, null=True, blank=True)
    statut = models.CharField(max_length=50, default="attente")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    date_traitement = models.DateTimeField(null=True, blank=True)
    patient = models.ForeignKey(
        Patient,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="dossiers",
    )
    service = models.ForeignKey(
        Service,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="dossiers",
    )
    medecin_traitant = models.ForeignKey(
        Employe,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="dossiers",
    )
    organisation = models.ForeignKey(
        Organisation, on_delete=models.CASCADE, related_name="dossiers"
    )

    class Meta:
        db_table = "dossier_patient"

    def __str__(self):
        return self.code or f"Dossier #{self.id}"


class Ticket(models.Model):
    code = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=50, default="attente")
    date_called = models.DateTimeField(null=True, blank=True)
    date_done = models.DateTimeField(null=True, blank=True)
    dossier_patient = models.ForeignKey(
        DossierPatient,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="tickets",
    )
    organisation = models.ForeignKey(
        Organisation, on_delete=models.CASCADE, related_name="tickets"
    )

    class Meta:
        db_table = "ticket"

    def __str__(self):
        return self.code or f"Ticket #{self.id}"


class Log(models.Model):
    message = models.TextField()
    type = models.CharField(max_length=100)
    model_id = models.IntegerField()
    model_name = models.CharField(max_length=255)
    action = models.CharField(max_length=100)
    user_id = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    organisation = models.ForeignKey(
        Organisation, on_delete=models.CASCADE, related_name="logs"
    )

    class Meta:
        db_table = "log"


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("L'email est requis")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    ACCESS_TYPE_CHOICES = [
        ("DEMO_ADMIN_GUEST", "Demo Admin Guest"),
        ("PRO_ADMIN_GUEST", "Pro Admin Guest"),
        ("DEMO_ADMIN_EXPIRED", "Demo Admin Expired"),
        ("PRO_ADMIN_EXPIRED", "Pro Admin Expired"),
        ("ADMIN_GLOBAL_HMS", "Admin Global HMS"),
    ]

    email = models.EmailField(unique=True)
    email_verified = models.DateTimeField(null=True, blank=True)
    image = models.URLField(null=True, blank=True)
    access_type = models.CharField(
        max_length=50, choices=ACCESS_TYPE_CHOICES, default="DEMO_ADMIN_GUEST"
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    role = models.ForeignKey(
        Role,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="users",
    )
    contact = models.ForeignKey(
        Contact,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="users",
    )
    organisation = models.ForeignKey(
        Organisation, on_delete=models.CASCADE, related_name="users"
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    class Meta:
        db_table = "user"

    def __str__(self):
        return self.email



# ─── Nouveaux modèles HMS ──────────────────────────────────────────────────────

class Facture(models.Model):
    STATUT_CHOICES = [
        ("En attente", "En attente"),
        ("Validée", "Validée"),
        ("Payée", "Payée"),
    ]
    ASSURANCE_CHOICES = [
        ("Aucune", "Aucune"),
        ("CNSS", "CNSS"),
        ("CNAMGS", "CNAMGS"),
        ("Assurance Privée", "Assurance Privée"),
    ]
    PAIEMENT_CHOICES = [
        ("Espèces", "Espèces"),
        ("Carte Bancaire", "Carte Bancaire"),
        ("Mobile Money", "Mobile Money"),
        ("Virement", "Virement"),
    ]
    numero_facture = models.CharField(max_length=100, unique=True)
    patient = models.ForeignKey(Patient, on_delete=models.SET_NULL, null=True, blank=True, related_name="factures")
    dossier = models.ForeignKey(DossierPatient, on_delete=models.SET_NULL, null=True, blank=True, related_name="factures")
    date_facture = models.DateTimeField(auto_now_add=True)
    montant_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    statut = models.CharField(max_length=50, choices=STATUT_CHOICES, default="En attente")
    methode_paiement = models.CharField(max_length=100, choices=PAIEMENT_CHOICES, null=True, blank=True)
    type_assurance = models.CharField(max_length=100, choices=ASSURANCE_CHOICES, default="Aucune")
    notes = models.TextField(null=True, blank=True)
    created_by = models.ForeignKey("User", on_delete=models.SET_NULL, null=True, blank=True, related_name="factures_creees")
    organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE, related_name="factures")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "facture"

    def __str__(self):
        return self.numero_facture


class LigneFacture(models.Model):
    facture = models.ForeignKey(Facture, on_delete=models.CASCADE, related_name="lignes")
    description = models.CharField(max_length=500)
    quantite = models.IntegerField(default=1)
    prix_unitaire = models.DecimalField(max_digits=10, decimal_places=2)
    montant = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        db_table = "ligne_facture"

    def save(self, *args, **kwargs):
        self.montant = self.quantite * self.prix_unitaire
        super().save(*args, **kwargs)


class SoinInfirmier(models.Model):
    STATUT_CHOICES = [
        ("En attente", "En attente"),
        ("En cours", "En cours"),
        ("Terminé", "Terminé"),
    ]
    patient = models.ForeignKey(Patient, on_delete=models.SET_NULL, null=True, blank=True, related_name="soins")
    dossier = models.ForeignKey(DossierPatient, on_delete=models.SET_NULL, null=True, blank=True, related_name="soins")
    infirmier = models.ForeignKey(Employe, on_delete=models.SET_NULL, null=True, blank=True, related_name="soins")
    date_heure = models.DateTimeField(auto_now_add=True)
    tension = models.CharField(max_length=20, null=True, blank=True)
    temperature = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
    pouls = models.IntegerField(null=True, blank=True)
    respiration = models.IntegerField(null=True, blank=True)
    saturation = models.IntegerField(null=True, blank=True)
    poids = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    taille = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    soins_effectues = models.JSONField(default=list, blank=True)
    statut = models.CharField(max_length=50, choices=STATUT_CHOICES, default="Terminé")
    observations = models.TextField(null=True, blank=True)
    organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE, related_name="soins_infirmiers")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "soin_infirmier"


class RendezVous(models.Model):
    STATUT_CHOICES = [
        ("En attente", "En attente"),
        ("Confirmé", "Confirmé"),
        ("Annulé", "Annulé"),
        ("Terminé", "Terminé"),
        ("Urgent", "Urgent"),
    ]
    TYPE_CHOICES = [
        ("Consultation", "Consultation"),
        ("Suivi", "Suivi"),
        ("Urgence", "Urgence"),
        ("Contrôle", "Contrôle"),
        ("Téléconsultation", "Téléconsultation"),
    ]
    patient = models.ForeignKey(Patient, on_delete=models.SET_NULL, null=True, blank=True, related_name="rendez_vous")
    medecin = models.ForeignKey(Employe, on_delete=models.SET_NULL, null=True, blank=True, related_name="rendez_vous")
    date = models.DateField()
    heure = models.TimeField()
    type = models.CharField(max_length=100, choices=TYPE_CHOICES, default="Consultation")
    statut = models.CharField(max_length=50, choices=STATUT_CHOICES, default="En attente")
    duree = models.IntegerField(default=30)
    notes = models.TextField(null=True, blank=True)
    organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE, related_name="rendez_vous")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "rendez_vous"
        ordering = ["date", "heure"]


class ExamenLabo(models.Model):
    STATUT_CHOICES = [
        ("Demandé", "Demandé"),
        ("En cours", "En cours"),
        ("Résultats disponibles", "Résultats disponibles"),
        ("Annulé", "Annulé"),
    ]
    patient = models.ForeignKey(Patient, on_delete=models.SET_NULL, null=True, blank=True, related_name="examens_labo")
    dossier = models.ForeignKey(DossierPatient, on_delete=models.SET_NULL, null=True, blank=True, related_name="examens_labo")
    type_examen = models.CharField(max_length=255)
    resultats = models.TextField(null=True, blank=True)
    statut = models.CharField(max_length=50, choices=STATUT_CHOICES, default="Demandé")
    date_demande = models.DateTimeField(auto_now_add=True)
    date_resultat = models.DateTimeField(null=True, blank=True)
    demande_par = models.ForeignKey(Employe, on_delete=models.SET_NULL, null=True, blank=True, related_name="examens_labo_demandes")
    notes = models.TextField(null=True, blank=True)
    organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE, related_name="examens_labo")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "examen_labo"


class ExamenImagerie(models.Model):
    STATUT_CHOICES = [
        ("Demandé", "Demandé"),
        ("En cours", "En cours"),
        ("Résultats disponibles", "Résultats disponibles"),
        ("Annulé", "Annulé"),
    ]
    TYPE_CHOICES = [
        ("Radiographie", "Radiographie"),
        ("Échographie", "Échographie"),
        ("Scanner", "Scanner"),
        ("IRM", "IRM"),
        ("Mammographie", "Mammographie"),
    ]
    patient = models.ForeignKey(Patient, on_delete=models.SET_NULL, null=True, blank=True, related_name="examens_imagerie")
    dossier = models.ForeignKey(DossierPatient, on_delete=models.SET_NULL, null=True, blank=True, related_name="examens_imagerie")
    type = models.CharField(max_length=100, choices=TYPE_CHOICES)
    compte_rendu = models.TextField(null=True, blank=True)
    statut = models.CharField(max_length=50, choices=STATUT_CHOICES, default="Demandé")
    date_demande = models.DateTimeField(auto_now_add=True)
    date_resultat = models.DateTimeField(null=True, blank=True)
    demande_par = models.ForeignKey(Employe, on_delete=models.SET_NULL, null=True, blank=True, related_name="examens_imagerie_demandes")
    notes = models.TextField(null=True, blank=True)
    organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE, related_name="examens_imagerie")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "examen_imagerie"


class Medicament(models.Model):
    FORME_CHOICES = [
        ("Comprimé", "Comprimé"),
        ("Gélule", "Gélule"),
        ("Sirop", "Sirop"),
        ("Injectable", "Injectable"),
        ("Pommade", "Pommade"),
        ("Suppositoire", "Suppositoire"),
        ("Collyre", "Collyre"),
    ]
    STATUT_CHOICES = [
        ("Disponible", "Disponible"),
        ("Rupture de stock", "Rupture de stock"),
        ("En commande", "En commande"),
    ]
    nom = models.CharField(max_length=255)
    dci = models.CharField(max_length=255, null=True, blank=True)
    forme = models.CharField(max_length=100, choices=FORME_CHOICES, default="Comprimé")
    stock = models.IntegerField(default=0)
    seuil_alerte = models.IntegerField(default=10)
    prix = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    statut = models.CharField(max_length=50, choices=STATUT_CHOICES, default="Disponible")
    description = models.TextField(null=True, blank=True)
    organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE, related_name="medicaments")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "medicament"

    def __str__(self):
        return f"{self.nom} ({self.forme})"


class Ordonnance(models.Model):
    STATUT_CHOICES = [
        ("En attente", "En attente"),
        ("Dispensée", "Dispensée"),
        ("Annulée", "Annulée"),
    ]
    patient = models.ForeignKey(Patient, on_delete=models.SET_NULL, null=True, blank=True, related_name="ordonnances")
    medecin = models.ForeignKey(Employe, on_delete=models.SET_NULL, null=True, blank=True, related_name="ordonnances")
    date = models.DateTimeField(auto_now_add=True)
    statut = models.CharField(max_length=50, choices=STATUT_CHOICES, default="En attente")
    notes = models.TextField(null=True, blank=True)
    organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE, related_name="ordonnances")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "ordonnance"


class LigneOrdonnance(models.Model):
    ordonnance = models.ForeignKey(Ordonnance, on_delete=models.CASCADE, related_name="lignes")
    medicament = models.ForeignKey(Medicament, on_delete=models.SET_NULL, null=True, blank=True)
    quantite = models.IntegerField(default=1)
    posologie = models.CharField(max_length=500, null=True, blank=True)
    duree = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        db_table = "ligne_ordonnance"


class DispensationMedicament(models.Model):
    ordonnance = models.ForeignKey(Ordonnance, on_delete=models.CASCADE, related_name="dispensations")
    pharmacien = models.ForeignKey(Employe, on_delete=models.SET_NULL, null=True, blank=True, related_name="dispensations")
    date_dispensation = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(null=True, blank=True)
    organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE, related_name="dispensations")

    class Meta:
        db_table = "dispensation_medicament"


class Chambre(models.Model):
    TYPE_CHOICES = [
        ("Simple", "Simple"),
        ("Double", "Double"),
        ("Suite", "Suite"),
        ("Salle commune", "Salle commune"),
        ("Réanimation", "Réanimation"),
    ]
    STATUT_CHOICES = [
        ("Disponible", "Disponible"),
        ("Occupée", "Occupée"),
        ("Maintenance", "Maintenance"),
    ]
    numero = models.CharField(max_length=20)
    type = models.CharField(max_length=50, choices=TYPE_CHOICES, default="Simple")
    service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True, blank=True, related_name="chambres")
    statut = models.CharField(max_length=50, choices=STATUT_CHOICES, default="Disponible")
    nombre_lits = models.IntegerField(default=1)
    description = models.TextField(null=True, blank=True)
    organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE, related_name="chambres")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "chambre"
        unique_together = ("numero", "organisation")

    def __str__(self):
        return f"Chambre {self.numero}"


class Lit(models.Model):
    STATUT_CHOICES = [
        ("Libre", "Libre"),
        ("Occupé", "Occupé"),
        ("Maintenance", "Maintenance"),
    ]
    chambre = models.ForeignKey(Chambre, on_delete=models.CASCADE, related_name="lits")
    numero = models.CharField(max_length=10)
    statut = models.CharField(max_length=50, choices=STATUT_CHOICES, default="Libre")

    class Meta:
        db_table = "lit"
        unique_together = ("chambre", "numero")

    def __str__(self):
        return f"Lit {self.numero} - Chambre {self.chambre.numero}"


class Admission(models.Model):
    STATUT_CHOICES = [
        ("En cours", "En cours"),
        ("Sorti", "Sorti"),
        ("Transféré", "Transféré"),
    ]
    patient = models.ForeignKey(Patient, on_delete=models.SET_NULL, null=True, blank=True, related_name="admissions")
    dossier = models.ForeignKey(DossierPatient, on_delete=models.SET_NULL, null=True, blank=True, related_name="admissions")
    lit = models.ForeignKey(Lit, on_delete=models.SET_NULL, null=True, blank=True, related_name="admissions")
    medecin = models.ForeignKey(Employe, on_delete=models.SET_NULL, null=True, blank=True, related_name="admissions")
    date_entree = models.DateTimeField(auto_now_add=True)
    date_sortie_prevue = models.DateField(null=True, blank=True)
    date_sortie_reelle = models.DateTimeField(null=True, blank=True)
    motif = models.TextField(null=True, blank=True)
    statut = models.CharField(max_length=50, choices=STATUT_CHOICES, default="En cours")
    notes = models.TextField(null=True, blank=True)
    organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE, related_name="admissions")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "admission"


class Transfert(models.Model):
    admission = models.ForeignKey(Admission, on_delete=models.CASCADE, related_name="transferts")
    ancien_lit = models.ForeignKey(Lit, on_delete=models.SET_NULL, null=True, blank=True, related_name="transferts_depuis")
    nouveau_lit = models.ForeignKey(Lit, on_delete=models.SET_NULL, null=True, blank=True, related_name="transferts_vers")
    date = models.DateTimeField(auto_now_add=True)
    motif = models.TextField(null=True, blank=True)
    organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE, related_name="transferts")

    class Meta:
        db_table = "transfert"


class Depense(models.Model):
    CATEGORIE_CHOICES = [
        ("Salaires", "Salaires"),
        ("Équipements", "Équipements"),
        ("Médicaments", "Médicaments"),
        ("Maintenance", "Maintenance"),
        ("Fournitures", "Fournitures"),
        ("Énergie", "Énergie"),
        ("Autres", "Autres"),
    ]
    categorie = models.CharField(max_length=100, choices=CATEGORIE_CHOICES)
    montant = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField(null=True, blank=True)
    date = models.DateField()
    justificatif = models.CharField(max_length=500, null=True, blank=True)
    created_by = models.ForeignKey("User", on_delete=models.SET_NULL, null=True, blank=True, related_name="depenses_creees")
    organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE, related_name="depenses")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "depense"


class ConsultationMedicale(models.Model):
    STATUT_CHOICES = [
        ("En cours", "En cours"),
        ("Terminée", "Terminée"),
    ]
    patient = models.ForeignKey(Patient, on_delete=models.SET_NULL, null=True, blank=True, related_name="consultations")
    dossier = models.ForeignKey(DossierPatient, on_delete=models.SET_NULL, null=True, blank=True, related_name="consultations")
    medecin = models.ForeignKey(Employe, on_delete=models.SET_NULL, null=True, blank=True, related_name="consultations")
    date = models.DateTimeField(auto_now_add=True)
    anamnese = models.TextField(null=True, blank=True)
    diagnostic = models.TextField(null=True, blank=True)
    prescription = models.TextField(null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    statut = models.CharField(max_length=50, choices=STATUT_CHOICES, default="En cours")
    organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE, related_name="consultations")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "consultation_medicale"
