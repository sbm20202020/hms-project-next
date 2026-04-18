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

