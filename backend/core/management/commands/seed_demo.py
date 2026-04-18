"""
Commande de seed pour la démo HMS.

Usage :
    python manage.py seed_demo          # insère les données (idempotent)
    python manage.py seed_demo --reset  # supprime toutes les données puis insère
"""
from datetime import date, time, timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from core.models import (
    Organisation, Fonction, Role, Permission, RolePermission,
    Service, Contact, Employe, User,
    Patient, DossierPatient, Ticket, Log,
    Chambre, Lit, Admission, Transfert,
    RendezVous, ConsultationMedicale, SoinInfirmier,
    ExamenLabo, ExamenImagerie,
    Medicament, Ordonnance, LigneOrdonnance, DispensationMedicament,
    Facture, LigneFacture, Depense,
)


class Command(BaseCommand):
    help = "Insère des données de démonstration dans tous les modèles HMS."

    def add_arguments(self, parser):
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Supprime toutes les données existantes avant d'insérer.",
        )

    def _ok(self, label, count):
        self.stdout.write(f"  {self.style.SUCCESS('✓')} {label:<35} {self.style.SUCCESS(str(count))} enregistrement(s)")

    def handle(self, *args, **options):
        if options["reset"]:
            self._reset()
            self.stdout.write(self.style.WARNING("⚠  Données existantes supprimées."))

        self.stdout.write(self.style.HTTP_INFO("\n══ HMS SEED DÉMO ══════════════════════════════"))

        org = self._organisation()
        fonctions = self._fonctions()
        self._ok("Fonctions", len(fonctions))
        roles = self._roles(org)
        self._ok("Rôles", len(roles))
        permissions = self._permissions(org, fonctions)
        self._ok("Permissions", len(permissions))
        self._role_permissions(roles, permissions)
        self._ok("RolePermissions", RolePermission.objects.filter(role__organisation=org).count())
        services = self._services(org)
        self._ok("Services", len(services))
        contacts_staff, contacts_patients = self._contacts(org)
        self._ok("Contacts (staff)", len(contacts_staff))
        self._ok("Contacts (patients)", len(contacts_patients))
        employes = self._employes(org, services, contacts_staff)
        self._ok("Employés", len(employes))
        users = self._users(org, roles, contacts_staff, employes)
        self._ok("Utilisateurs", len(users))
        patients = self._patients(org, contacts_patients)
        self._ok("Patients", len(patients))
        dossiers = self._dossiers(org, patients, services, employes)
        self._ok("Dossiers patients", len(dossiers))
        tickets = self._tickets(org, dossiers)
        self._ok("Tickets", len(tickets))
        chambres = self._chambres(org, services)
        self._ok("Chambres", len(chambres))
        lits = self._lits(chambres)
        self._ok("Lits", len(lits))
        admissions = self._admissions(org, patients, dossiers, lits, employes)
        self._ok("Admissions", len(admissions))
        transferts = self._transferts(org, admissions, lits)
        self._ok("Transferts", len(transferts))
        rdvs = self._rendez_vous(org, patients, employes)
        self._ok("Rendez-vous", len(rdvs))
        consults = self._consultations(org, patients, dossiers, employes)
        self._ok("Consultations médicales", len(consults))
        soins = self._soins(org, patients, dossiers, employes)
        self._ok("Soins infirmiers", len(soins))
        exlabo = self._examens_labo(org, patients, dossiers, employes)
        self._ok("Examens labo", len(exlabo))
        eximg = self._examens_imagerie(org, patients, dossiers, employes)
        self._ok("Examens imagerie", len(eximg))
        medicaments = self._medicaments(org)
        self._ok("Médicaments", len(medicaments))
        ordonnances = self._ordonnances(org, patients, employes, medicaments)
        self._ok("Ordonnances", len(ordonnances))
        self._ok("Lignes ordonnance", LigneOrdonnance.objects.filter(ordonnance__organisation=org).count())
        dispensations = self._dispensations(org, ordonnances, employes)
        self._ok("Dispensations", len(dispensations))
        factures = self._factures(org, patients, dossiers)
        self._ok("Factures", len(factures))
        self._ok("Lignes facture", LigneFacture.objects.filter(facture__organisation=org).count())
        depenses = self._depenses(org)
        self._ok("Dépenses", len(depenses))
        logs = self._logs(org)
        self._ok("Logs", len(logs))

        self._print_summary(org, users)

    # ─────────────────────────────────────────────────────────────────────────
    # Helpers
    # ─────────────────────────────────────────────────────────────────────────

    def _reset(self):
        models_ordered = [
            Log, Transfert, Admission, Lit, Chambre,
            DispensationMedicament, LigneOrdonnance, Ordonnance, Medicament,
            LigneFacture, Facture, Depense,
            ExamenImagerie, ExamenLabo,
            SoinInfirmier, ConsultationMedicale, RendezVous,
            Ticket, DossierPatient, Patient,
            User, Employe, Contact,
            RolePermission, Permission, Role, Service,
            Fonction, Organisation,
        ]
        for model in models_ordered:
            model.objects.all().delete()

    def _organisation(self):
        org, _ = Organisation.objects.get_or_create(
            nom="Hôpital Central de Libreville",
            defaults={"description": "Établissement hospitalier de référence – données de démonstration HMS."},
        )
        self.stdout.write(f"  Organisation : {org.nom}")
        return org

    def _fonctions(self):
        data = [
            ("Médecin Généraliste", "MED_GEN", "Consultation générale"),
            ("Médecin Spécialiste", "MED_SPEC", "Consultation spécialisée"),
            ("Infirmier(ère)", "INF", "Soins infirmiers"),
            ("Pharmacien(ne)", "PHARM", "Dispensation médicaments"),
            ("Laborantin(e)", "LAB", "Analyses de laboratoire"),
            ("Radiologue", "RADIO", "Imagerie médicale"),
            ("Administrateur(rice)", "ADMIN", "Gestion administrative"),
            ("Accueil / Réceptionniste", "ACCUEIL", "Accueil patients"),
        ]
        fonctions = {}
        for nom, code, desc in data:
            f, _ = Fonction.objects.get_or_create(code=code, defaults={"nom": nom, "description": desc})
            fonctions[code] = f
        return fonctions

    def _roles(self, org):
        data = [
            ("Administrateur", "Accès total à l'application"),
            ("Médecin", "Accès aux dossiers et consultations"),
            ("Infirmier", "Accès soins infirmiers"),
            ("Pharmacien", "Accès pharmacie et dispensation"),
            ("Laborantin", "Accès laboratoire"),
            ("Radiologue", "Accès imagerie"),
            ("Réceptionniste", "Accueil et gestion des rendez-vous"),
        ]
        roles = {}
        for nom, desc in data:
            r, _ = Role.objects.get_or_create(nom=nom, organisation=org, defaults={"description": desc})
            roles[nom] = r
        return roles

    def _permissions(self, org, fonctions):
        data = [
            ("Gestion patients", fonctions["MED_GEN"], True, True, True, False),
            ("Consultation dossiers", fonctions["MED_GEN"], False, True, False, False),
            ("Soins infirmiers", fonctions["INF"], True, True, True, False),
            ("Dispensation médicaments", fonctions["PHARM"], True, True, True, False),
            ("Analyses laboratoire", fonctions["LAB"], True, True, True, False),
            ("Imagerie médicale", fonctions["RADIO"], True, True, True, False),
            ("Administration système", fonctions["ADMIN"], True, True, True, True),
            ("Gestion rendez-vous", fonctions["ACCUEIL"], True, True, True, True),
        ]
        permissions = {}
        for name, fonction, cc, cr, cu, cd in data:
            p, _ = Permission.objects.get_or_create(
                name=name, organisation=org,
                defaults={
                    "fonction": fonction,
                    "can_create": cc, "can_read": cr,
                    "can_update": cu, "can_delete": cd,
                },
            )
            permissions[name] = p
        return permissions

    def _role_permissions(self, roles, permissions):
        mapping = {
            "Administrateur": list(permissions.values()),
            "Médecin": [permissions["Gestion patients"], permissions["Consultation dossiers"]],
            "Infirmier": [permissions["Soins infirmiers"], permissions["Consultation dossiers"]],
            "Pharmacien": [permissions["Dispensation médicaments"]],
            "Laborantin": [permissions["Analyses laboratoire"]],
            "Radiologue": [permissions["Imagerie médicale"]],
            "Réceptionniste": [permissions["Gestion rendez-vous"], permissions["Consultation dossiers"]],
        }
        for role_name, perms in mapping.items():
            role = roles[role_name]
            for perm in perms:
                RolePermission.objects.get_or_create(role=role, permission=perm)

    def _services(self, org):
        data = [
            ("Urgences", "URG", True, True, False, False, False, False),
            ("Médecine Générale", "MED_GEN", False, True, False, False, False, False),
            ("Chirurgie", "CHIR", True, True, False, False, False, False),
            ("Pédiatrie", "PED", True, True, False, False, False, False),
            ("Maternité", "MATER", True, True, False, False, False, False),
            ("Cardiologie", "CARDIO", False, True, False, False, False, False),
            ("Laboratoire", "LABO", False, False, False, True, False, False),
            ("Radiologie", "RADIO", False, False, False, False, True, True),
            ("Pharmacie", "PHARM", False, False, True, False, False, False),
            ("Réanimation", "REA", True, True, True, False, False, False),
        ]
        services = {}
        for nom, code, nurse, doctor, pharm, lab, radio, imaging in data:
            s, _ = Service.objects.get_or_create(
                code=code, organisation=org,
                defaults={
                    "nom": nom,
                    "is_required_nurse_service": nurse,
                    "is_required_doctor_service": doctor,
                    "is_required_pharmacist_service": pharm,
                    "is_required_lab_service": lab,
                    "is_required_radiology_service": radio,
                    "is_required_imaging_service": imaging,
                },
            )
            services[code] = s
        return services

    def _contacts(self, org):
        staff_data = [
            ("Dupont", "Jean", "j.dupont@hms-demo.ga", "0661000001", "1975-03-15", 49, "M", "Médecin Chef"),
            ("Martin", "Sophie", "s.martin@hms-demo.ga", "0661000002", "1982-07-22", 42, "F", "Médecin"),
            ("Nzamba", "Hervé", "h.nzamba@hms-demo.ga", "0661000003", "1990-11-05", 33, "M", "Infirmier"),
            ("Obiang", "Marie", "m.obiang@hms-demo.ga", "0661000004", "1988-04-18", 36, "F", "Infirmière"),
            ("Biyogo", "Paul", "p.biyogo@hms-demo.ga", "0661000005", "1979-09-30", 44, "M", "Pharmacien"),
            ("Ondo", "Claire", "c.ondo@hms-demo.ga", "0661000006", "1985-01-12", 39, "F", "Laborantine"),
            ("Mouele", "Antoine", "a.mouele@hms-demo.ga", "0661000007", "1993-06-25", 31, "M", "Radiologue"),
            ("Admin", "HMS", "admin@hms-demo.ga", "0661000000", "1980-01-01", 44, "M", "Administrateur"),
        ]
        patient_data = [
            ("Koumba", "Alice", "alice.koumba@mail.ga", "0662000001", "1990-05-20", 34, "F"),
            ("Mboumba", "Robert", "r.mboumba@mail.ga", "0662000002", "1965-08-14", 58, "M"),
            ("Nguema", "Fatima", "f.nguema@mail.ga", "0662000003", "2000-12-01", 23, "F"),
            ("Mintsa", "Christophe", "c.mintsa@mail.ga", "0662000004", "1978-03-07", 46, "M"),
            ("Oyono", "Brigitte", "b.oyono@mail.ga", "0662000005", "1955-11-19", 68, "F"),
            ("Ella", "Marc", "m.ella@mail.ga", "0662000006", "2010-02-28", 14, "M"),
            ("Nkoghe", "Sandrine", "s.nkoghe@mail.ga", "0662000007", "1995-07-03", 29, "F"),
            ("Bivigou", "Jean-Pierre", "jp.bivigou@mail.ga", "0662000008", "1943-09-15", 80, "M"),
        ]
        contacts_staff = []
        for nom, prenom, email, tel, dob, age, sexe, pos in staff_data:
            c, _ = Contact.objects.get_or_create(
                email=email,
                defaults={
                    "nom": nom, "prenom": prenom, "telephone": tel,
                    "date_naissance": timezone.make_aware(timezone.datetime.strptime(dob, "%Y-%m-%d")),
                    "age": age, "sexe": sexe, "position": pos,
                    "adresse": "Libreville, Gabon",
                    "ville": "Libreville", "code_postal": "00000",
                    "organisation": org,
                },
            )
            contacts_staff.append(c)

        contacts_patients = []
        for nom, prenom, email, tel, dob, age, sexe in patient_data:
            c, _ = Contact.objects.get_or_create(
                email=email,
                defaults={
                    "nom": nom, "prenom": prenom, "telephone": tel,
                    "date_naissance": timezone.make_aware(timezone.datetime.strptime(dob, "%Y-%m-%d")),
                    "age": age, "sexe": sexe,
                    "adresse": "Libreville, Gabon",
                    "ville": "Libreville", "code_postal": "00000",
                    "numero_secu": f"GA{tel[-6:]}",
                    "organisation": org,
                },
            )
            contacts_patients.append(c)

        return contacts_staff, contacts_patients

    def _employes(self, org, services, contacts_staff):
        svc_map = ["URG", "MED_GEN", "URG", "PED", "PHARM", "LABO", "RADIO", "MED_GEN"]
        employes = []
        for contact, svc_code in zip(contacts_staff, svc_map):
            e, _ = Employe.objects.get_or_create(
                contact=contact, organisation=org,
                defaults={"service": services[svc_code]},
            )
            employes.append(e)
        return employes

    def _users(self, org, roles, contacts_staff, employes):
        users_data = [
            ("admin@hms-demo.ga", "Admin2024!", "ADMIN_GLOBAL_HMS", "Administrateur", 7, True),
            ("j.dupont@hms-demo.ga", "Medecin2024!", "PRO_ADMIN_GUEST", "Médecin", 0, False),
            ("s.martin@hms-demo.ga", "Medecin2024!", "PRO_ADMIN_GUEST", "Médecin", 1, False),
            ("h.nzamba@hms-demo.ga", "Infirmier2024!", "PRO_ADMIN_GUEST", "Infirmier", 2, False),
            ("m.obiang@hms-demo.ga", "Infirmier2024!", "PRO_ADMIN_GUEST", "Infirmier", 3, False),
            ("p.biyogo@hms-demo.ga", "Pharma2024!", "PRO_ADMIN_GUEST", "Pharmacien", 4, False),
            ("c.ondo@hms-demo.ga", "Labo2024!", "PRO_ADMIN_GUEST", "Laborantin", 5, False),
            ("a.mouele@hms-demo.ga", "Radio2024!", "PRO_ADMIN_GUEST", "Radiologue", 6, False),
        ]
        users = []
        for email, pwd, access, role_name, contact_idx, is_staff in users_data:
            if not User.objects.filter(email=email).exists():
                u = User.objects.create_user(
                    email=email,
                    password=pwd,
                    access_type=access,
                    role=roles[role_name],
                    contact=contacts_staff[contact_idx],
                    organisation=org,
                    is_staff=is_staff,
                )
            else:
                u = User.objects.get(email=email)
            users.append(u)
        return users

    def _patients(self, org, contacts_patients):
        data = [
            ("Adulte", "CNSS", "Koumba Pierre", "0662100001", "Pénicilline", "HTA", "Amlodipine 5mg", "Hospitalisé"),
            ("Adulte", "Aucune", "", "", "", "Diabète type 2", "Metformine 500mg", "Consultation"),
            ("Adulte", "CNAMGS", "Nguema Ali", "0662100003", "", "", "", "Consultation"),
            ("Adulte", "Assurance Privée", "Mintsa Rose", "0662100004", "Aspirine", "Asthme", "Salbutamol", "Urgence"),
            ("Senior", "CNSS", "Oyono Claude", "0662100005", "", "Insuffisance cardiaque", "Furosémide", "Hospitalisé"),
            ("Enfant", "CNAMGS", "Ella Cécile", "0662100006", "", "", "", "Consultation"),
            ("Adulte", "Aucune", "", "", "", "", "", "Consultation"),
            ("Senior", "CNSS", "", "", "Codéine", "BPCO", "Symbicort", "Urgence"),
        ]
        patients = []
        services = ["Urgences", "Médecine Générale", "Médecine Générale", "Urgences",
                    "Cardiologie", "Pédiatrie", "Médecine Générale", "Réanimation"]
        medecins = ["Dr Dupont", "Dr Martin", "Dr Dupont", "Dr Martin",
                    "Dr Dupont", "Dr Martin", "Dr Dupont", "Dr Martin"]
        for i, (contact, row) in enumerate(zip(contacts_patients, data)):
            type_p, conv, ce, te, allerg, ant, trait, statut = row
            p, _ = Patient.objects.get_or_create(
                contact=contact, organisation=org,
                defaults={
                    "type_patient": type_p,
                    "convention": conv,
                    "contact_urgence": ce,
                    "telephone_urgence": te,
                    "allergies": allerg,
                    "antecedents": ant,
                    "traitements": trait,
                    "statut": statut,
                    "service": services[i],
                    "medecin_traitant": medecins[i],
                },
            )
            patients.append(p)
        return patients

    def _dossiers(self, org, patients, services, employes):
        data = [
            ("DOS-2024-001", "Douleurs thoraciques", "Critique", "en_cours"),
            ("DOS-2024-002", "Contrôle diabète", "Faible", "terminé"),
            ("DOS-2024-003", "Fièvre persistante", "Modéré", "en_cours"),
            ("DOS-2024-004", "Crise d'asthme", "Élevé", "terminé"),
            ("DOS-2024-005", "Suivi cardiaque", "Modéré", "en_cours"),
            ("DOS-2024-006", "Vaccination", "Faible", "terminé"),
            ("DOS-2024-007", "Consultation prénatale", "Faible", "en_cours"),
            ("DOS-2024-008", "Détresse respiratoire", "Critique", "en_cours"),
        ]
        svc_keys = ["URG", "MED_GEN", "MED_GEN", "URG", "CARDIO", "PED", "MED_GEN", "REA"]
        dossiers = []
        for i, (patient, row) in enumerate(zip(patients, data)):
            code, motif, urgence, statut = row
            svc_code = svc_keys[i] if svc_keys[i] in services else "MED_GEN"
            svc = services.get(svc_code)
            d, _ = DossierPatient.objects.get_or_create(
                code=code, organisation=org,
                defaults={
                    "patient": patient,
                    "motif_de_visite": motif,
                    "niveau_urgence": urgence,
                    "statut": statut,
                    "service": svc,
                    "medecin_traitant": employes[i % 2],
                },
            )
            dossiers.append(d)
        return dossiers

    def _tickets(self, org, dossiers):
        tickets = []
        for i, dossier in enumerate(dossiers):
            t, _ = Ticket.objects.get_or_create(
                code=f"TKT-2024-{i+1:03d}", organisation=org,
                defaults={"dossier_patient": dossier, "status": "terminé" if i % 3 == 0 else "attente"},
            )
            tickets.append(t)
        return tickets

    def _chambres(self, org, services):
        data = [
            ("101", "Simple", "URG", "Disponible", 1),
            ("102", "Simple", "URG", "Occupée", 1),
            ("103", "Double", "MED_GEN", "Disponible", 2),
            ("104", "Double", "MED_GEN", "Occupée", 2),
            ("105", "Suite", "CHIR", "Disponible", 1),
            ("106", "Salle commune", "PED", "Occupée", 4),
            ("107", "Réanimation", "REA", "Occupée", 2),
            ("201", "Simple", "CARDIO", "Disponible", 1),
            ("202", "Double", "MATER", "Occupée", 2),
            ("203", "Simple", "CHIR", "Maintenance", 1),
        ]
        chambres = []
        for num, typ, svc_code, statut, lits in data:
            svc = services.get(svc_code)
            c, _ = Chambre.objects.get_or_create(
                numero=num, organisation=org,
                defaults={"type": typ, "service": svc, "statut": statut, "nombre_lits": lits},
            )
            chambres.append(c)
        return chambres

    def _lits(self, chambres):
        lits = []
        for chambre in chambres:
            for i in range(chambre.nombre_lits):
                lit_num = f"L{i+1}"
                statut = "Occupé" if chambre.statut == "Occupée" and i == 0 else "Libre"
                if chambre.statut == "Maintenance":
                    statut = "Maintenance"
                l, _ = Lit.objects.get_or_create(
                    chambre=chambre, numero=lit_num,
                    defaults={"statut": statut},
                )
                lits.append(l)
        return lits

    def _admissions(self, org, patients, dossiers, lits, employes):
        occupied_lits = [l for l in lits if l.statut == "Occupé"]
        admissions = []
        admitted = [(patients[0], dossiers[0]), (patients[4], dossiers[4]), (patients[7], dossiers[7])]
        for i, (patient, dossier) in enumerate(admitted):
            lit = occupied_lits[i] if i < len(occupied_lits) else lits[i]
            a, _ = Admission.objects.get_or_create(
                patient=patient, dossier=dossier, organisation=org,
                defaults={
                    "lit": lit,
                    "medecin": employes[0],
                    "date_sortie_prevue": (date.today() + timedelta(days=3 + i)),
                    "motif": dossier.motif_de_visite,
                    "statut": "En cours",
                    "notes": "Surveillance continue.",
                },
            )
            admissions.append(a)
        return admissions

    def _transferts(self, org, admissions, lits):
        transferts = []
        libre_lits = [l for l in lits if l.statut == "Libre"]
        if admissions and len(libre_lits) >= 2:
            t, _ = Transfert.objects.get_or_create(
                admission=admissions[0],
                organisation=org,
                defaults={
                    "ancien_lit": lits[1],
                    "nouveau_lit": libre_lits[0],
                    "motif": "Transfert vers chambre de soins intensifs.",
                },
            )
            transferts.append(t)
        return transferts

    def _rendez_vous(self, org, patients, employes):
        today = date.today()
        rdv_data = [
            (0, 0, today, time(8, 30), "Consultation", "Confirmé", 30),
            (1, 1, today, time(9, 0), "Suivi", "Confirmé", 20),
            (2, 0, today, time(10, 0), "Consultation", "En attente", 30),
            (3, 1, today + timedelta(1), time(14, 0), "Contrôle", "Confirmé", 30),
            (4, 0, today + timedelta(1), time(8, 0), "Urgence", "Urgent", 60),
            (5, 1, today + timedelta(2), time(11, 0), "Consultation", "En attente", 20),
            (6, 0, today - timedelta(1), time(9, 30), "Consultation", "Terminé", 30),
            (7, 1, today - timedelta(2), time(15, 0), "Suivi", "Terminé", 45),
        ]
        rdvs = []
        for p_idx, e_idx, d, h, typ, statut, duree in rdv_data:
            r, _ = RendezVous.objects.get_or_create(
                patient=patients[p_idx], medecin=employes[e_idx],
                date=d, heure=h, organisation=org,
                defaults={"type": typ, "statut": statut, "duree": duree},
            )
            rdvs.append(r)
        return rdvs

    def _consultations(self, org, patients, dossiers, employes):
        data = [
            (0, 0, 0, "Douleurs thoraciques depuis 2h, irradiant vers le bras gauche.",
             "Syndrome coronarien aigu à exclure.", "ECG, troponines, aspirine 300mg.", "Terminée"),
            (1, 1, 1, "Fatigue, soif excessive, polyurie.",
             "Déséquilibre diabétique.", "Ajustement metformine, régime alimentaire.", "Terminée"),
            (2, 0, 2, "Fièvre à 39.5°C depuis 3 jours, céphalées.",
             "Syndrome grippal.", "Paracétamol, repos, hydratation.", "Terminée"),
            (3, 1, 3, "Dyspnée aiguë, sifflements.",
             "Exacerbation d'asthme.", "Nébulisation salbutamol, corticoïdes.", "En cours"),
        ]
        consults = []
        for p_idx, e_idx, d_idx, ana, diag, presc, statut in data:
            c, _ = ConsultationMedicale.objects.get_or_create(
                patient=patients[p_idx], dossier=dossiers[d_idx],
                medecin=employes[e_idx], organisation=org,
                defaults={
                    "anamnese": ana, "diagnostic": diag,
                    "prescription": presc, "statut": statut,
                },
            )
            consults.append(c)
        return consults

    def _soins(self, org, patients, dossiers, employes):
        infirmiers = employes[2:4]
        data = [
            (0, 0, "120/80", 36.8, 78, 16, 98, 72.0, 170.0, ["Prise de sang", "Pose perfusion"], "Stable."),
            (1, 1, "130/85", 37.1, 82, 17, 97, 85.0, 175.0, ["Surveillance glycémie"], "Glycémie à 2.1g/L."),
            (2, 0, "110/70", 39.2, 95, 20, 96, 58.0, 162.0, ["Injection antipyrétique"], "Fièvre persistante."),
            (3, 1, "115/75", 37.5, 100, 24, 92, 70.0, 168.0, ["Nébulisation", "Oxygénothérapie"], "Saturation améliorée."),
            (4, 0, "145/90", 36.9, 68, 15, 95, 80.0, 172.0, ["Pose ECG", "Prélèvement"], "Stabilisé."),
        ]
        soins = []
        for i, row in enumerate(data):
            p_idx, d_idx, tens, temp, pouls, resp, sat, poids, taille, soins_eff, obs = row
            s, _ = SoinInfirmier.objects.get_or_create(
                patient=patients[p_idx], dossier=dossiers[d_idx],
                infirmier=infirmiers[i % 2], organisation=org,
                defaults={
                    "tension": tens, "temperature": temp, "pouls": pouls,
                    "respiration": resp, "saturation": sat, "poids": poids,
                    "taille": taille, "soins_effectues": soins_eff, "observations": obs,
                    "statut": "Terminé",
                },
            )
            soins.append(s)
        return soins

    def _examens_labo(self, org, patients, dossiers, employes):
        data = [
            (0, 0, "NFS (Numération Formule Sanguine)", "Hémoglobine 11.2 g/dL, leucocytes 12000/mm³", "Résultats disponibles"),
            (1, 1, "Glycémie à jeun", "2.1 g/L", "Résultats disponibles"),
            (2, 2, "CRP", "En cours d'analyse", "En cours"),
            (3, 3, "EFR (Exploration Fonctionnelle Respiratoire)", None, "Demandé"),
            (4, 4, "Troponine I", "0.08 ng/mL (élevé)", "Résultats disponibles"),
            (5, 5, "Bilan hépatique", None, "Demandé"),
        ]
        examens = []
        for p_idx, d_idx, typ, res, statut in data:
            e, _ = ExamenLabo.objects.get_or_create(
                patient=patients[p_idx], dossier=dossiers[d_idx],
                type_examen=typ, organisation=org,
                defaults={
                    "resultats": res, "statut": statut,
                    "demande_par": employes[p_idx % 2],
                    "date_resultat": timezone.now() if res else None,
                },
            )
            examens.append(e)
        return examens

    def _examens_imagerie(self, org, patients, dossiers, employes):
        data = [
            (0, 0, "Radiographie", "Opacité basale gauche, compatible avec pneumonie.", "Résultats disponibles"),
            (1, 1, "Échographie", None, "Demandé"),
            (2, 2, "Scanner", "En cours d'acquisition.", "En cours"),
            (3, 3, "IRM", None, "Demandé"),
            (4, 4, "Radiographie", "Cardiomégalie modérée.", "Résultats disponibles"),
        ]
        examens = []
        for p_idx, d_idx, typ, cr, statut in data:
            e, _ = ExamenImagerie.objects.get_or_create(
                patient=patients[p_idx], dossier=dossiers[d_idx],
                type=typ, organisation=org,
                defaults={
                    "compte_rendu": cr, "statut": statut,
                    "demande_par": employes[p_idx % 2],
                    "date_resultat": timezone.now() if cr else None,
                },
            )
            examens.append(e)
        return examens

    def _medicaments(self, org):
        data = [
            ("Amoxicilline 500mg", "Amoxicilline", "Gélule", 250, 20, 1500, "Disponible"),
            ("Paracétamol 1g", "Paracétamol", "Comprimé", 500, 50, 500, "Disponible"),
            ("Ibuprofène 400mg", "Ibuprofène", "Comprimé", 300, 30, 750, "Disponible"),
            ("Metformine 500mg", "Metformine", "Comprimé", 400, 40, 1200, "Disponible"),
            ("Amlodipine 5mg", "Amlodipine", "Comprimé", 200, 20, 900, "Disponible"),
            ("Salbutamol 100µg", "Salbutamol", "Sirop", 80, 10, 3500, "Disponible"),
            ("Furosémide 40mg", "Furosémide", "Comprimé", 150, 15, 600, "Disponible"),
            ("Oméprazole 20mg", "Oméprazole", "Gélule", 350, 30, 1100, "Disponible"),
            ("Doliprane 500mg", "Paracétamol", "Sirop", 5, 20, 1800, "Rupture de stock"),
            ("Amoxiclav 1g", "Amoxicilline/clavulanate", "Comprimé", 120, 15, 4200, "Disponible"),
            ("Dexaméthasone 4mg", "Dexaméthasone", "Injectable", 60, 10, 2500, "Disponible"),
            ("Sérum physiologique 500ml", "NaCl 0.9%", "Injectable", 200, 30, 800, "Disponible"),
        ]
        medicaments = []
        for nom, dci, forme, stock, seuil, prix, statut in data:
            m, _ = Medicament.objects.get_or_create(
                nom=nom, organisation=org,
                defaults={
                    "dci": dci, "forme": forme, "stock": stock,
                    "seuil_alerte": seuil, "prix": prix, "statut": statut,
                },
            )
            medicaments.append(m)
        return medicaments

    def _ordonnances(self, org, patients, employes, medicaments):
        ordonnances = []
        ordo_data = [
            (0, 0, "En attente", [
                (0, 2, "1 gélule 3 fois/j", "7 jours"),
                (1, 3, "1 comprimé si douleur", "5 jours"),
            ]),
            (1, 1, "Dispensée", [
                (3, 2, "1 comprimé 2 fois/j", "30 jours"),
                (4, 1, "1 comprimé le matin", "30 jours"),
            ]),
            (2, 0, "Dispensée", [
                (1, 4, "1 comprimé toutes les 6h", "3 jours"),
                (7, 1, "1 gélule le soir", "7 jours"),
            ]),
            (3, 1, "En attente", [
                (5, 2, "2 bouffées 4 fois/j", "Selon besoin"),
                (10, 1, "IV 1 fois/j", "3 jours"),
            ]),
        ]
        for p_idx, e_idx, statut, lignes in ordo_data:
            o, _ = Ordonnance.objects.get_or_create(
                patient=patients[p_idx], medecin=employes[e_idx],
                organisation=org,
                defaults={"statut": statut},
            )
            for m_idx, qte, posologie, duree in lignes:
                LigneOrdonnance.objects.get_or_create(
                    ordonnance=o, medicament=medicaments[m_idx],
                    defaults={"quantite": qte, "posologie": posologie, "duree": duree},
                )
            ordonnances.append(o)
        return ordonnances

    def _dispensations(self, org, ordonnances, employes):
        pharmacien = employes[4]
        dispensations = []
        for ordo in ordonnances:
            if ordo.statut == "Dispensée":
                d, _ = DispensationMedicament.objects.get_or_create(
                    ordonnance=ordo, pharmacien=pharmacien, organisation=org,
                    defaults={"notes": "Dispensation effectuée."},
                )
                dispensations.append(d)
        return dispensations

    def _factures(self, org, patients, dossiers):
        factures_data = [
            ("FAC-2024-001", 0, 0, "Payée", "Espèces", "CNSS", 75000, [
                ("Consultation urgence", 1, 25000),
                ("Radiographie thorax", 1, 35000),
                ("Analyses NFS", 1, 15000),
            ]),
            ("FAC-2024-002", 1, 1, "Payée", "Mobile Money", "CNSS", 22500, [
                ("Consultation médecine générale", 1, 15000),
                ("Glycémie à jeun", 1, 7500),
            ]),
            ("FAC-2024-003", 2, 2, "En attente", None, "Aucune", 37500, [
                ("Consultation urgence", 1, 25000),
                ("CRP + NFS", 1, 12500),
            ]),
            ("FAC-2024-004", 3, 3, "Validée", "Carte Bancaire", "Assurance Privée", 55000, [
                ("Consultation pneumologie", 1, 30000),
                ("EFR", 1, 25000),
            ]),
            ("FAC-2024-005", 4, 4, "En attente", None, "CNAMGS", 115000, [
                ("Hospitalisation (3 jours)", 3, 25000),
                ("Échocardiographie", 1, 40000),
            ]),
        ]
        factures = []
        for num, p_idx, d_idx, statut, methode, assur, total, lignes in factures_data:
            f, _ = Facture.objects.get_or_create(
                numero_facture=num, organisation=org,
                defaults={
                    "patient": patients[p_idx],
                    "dossier": dossiers[d_idx],
                    "montant_total": total,
                    "statut": statut,
                    "methode_paiement": methode,
                    "type_assurance": assur,
                },
            )
            for desc, qte, pu in lignes:
                LigneFacture.objects.get_or_create(
                    facture=f, description=desc,
                    defaults={"quantite": qte, "prix_unitaire": pu},
                )
            factures.append(f)
        return factures

    def _depenses(self, org):
        data = [
            ("Salaires", 2500000, "Salaires personnel médical – Avril 2024", date(2024, 4, 30)),
            ("Médicaments", 850000, "Commande médicaments – fournisseur PharmaCentrale", date(2024, 4, 15)),
            ("Équipements", 1200000, "Achat tensiomètre numérique x5 + oxymètres x10", date(2024, 4, 10)),
            ("Énergie", 320000, "Facture électricité Avril 2024", date(2024, 4, 30)),
            ("Maintenance", 180000, "Maintenance groupe électrogène", date(2024, 4, 20)),
            ("Fournitures", 95000, "Consommables médico-chirurgicaux", date(2024, 4, 18)),
            ("Autres", 45000, "Frais de communication et internet", date(2024, 4, 30)),
        ]
        depenses = []
        for cat, montant, desc, d in data:
            dep, _ = Depense.objects.get_or_create(
                categorie=cat, date=d, organisation=org,
                defaults={"montant": montant, "description": desc},
            )
            depenses.append(dep)
        return depenses

    def _logs(self, org):
        admin = User.objects.filter(organisation=org, is_staff=True).first()
        if not admin:
            return []
        log_data = [
            ("Connexion admin", "AUTH", 1, "User", "LOGIN"),
            ("Création patient Koumba Alice", "INFO", 1, "Patient", "CREATE"),
            ("Mise à jour dossier DOS-2024-001", "INFO", 1, "DossierPatient", "UPDATE"),
            ("Facture FAC-2024-001 payée", "INFO", 1, "Facture", "UPDATE"),
            ("Dispensation ordonnance", "INFO", 1, "DispensationMedicament", "CREATE"),
        ]
        logs = []
        for msg, typ, model_id, model_name, action in log_data:
            l, _ = Log.objects.get_or_create(
                message=msg, organisation=org,
                defaults={
                    "type": typ, "model_id": model_id,
                    "model_name": model_name, "action": action,
                    "user_id": admin.id,
                },
            )
            logs.append(l)
        return logs

    def _print_summary(self, org, users):
        self.stdout.write(self.style.HTTP_INFO(
            "\n══ RÉSUMÉ ══════════════════════════════════════"
        ))
        self.stdout.write(f"  Organisation : {self.style.SUCCESS(org.nom)} (id={org.id})")
        self.stdout.write("\n  Comptes utilisateurs de démo :")
        self.stdout.write(f"  {'Email':<35} {'Mot de passe':<16} {'Rôle'}")
        self.stdout.write(f"  {'-'*35} {'-'*16} {'-'*20}")
        credentials = [
            ("admin@hms-demo.ga",      "Admin2024!",      "Administrateur (staff)"),
            ("j.dupont@hms-demo.ga",   "Medecin2024!",    "Médecin"),
            ("s.martin@hms-demo.ga",   "Medecin2024!",    "Médecin"),
            ("h.nzamba@hms-demo.ga",   "Infirmier2024!",  "Infirmier"),
            ("m.obiang@hms-demo.ga",   "Infirmier2024!",  "Infirmière"),
            ("p.biyogo@hms-demo.ga",   "Pharma2024!",     "Pharmacien"),
            ("c.ondo@hms-demo.ga",     "Labo2024!",       "Laborantine"),
            ("a.mouele@hms-demo.ga",   "Radio2024!",      "Radiologue"),
        ]
        for email, pwd, role in credentials:
            self.stdout.write(f"  {email:<35} {pwd:<16} {role}")
        self.stdout.write(self.style.HTTP_INFO(
            "══════════════════════════════════════════════════"
        ))
        self.stdout.write(
            self.style.WARNING(
                "\n  ⚠  Si vous étiez connecté avant le --reset, déconnectez-vous"
                "\n     et reconnectez-vous avec les identifiants ci-dessus.\n"
            )
        )
        self.stdout.write(self.style.SUCCESS("✔  Seed démo terminé avec succès."))
