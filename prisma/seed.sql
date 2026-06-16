INSERT INTO "Organisation" (nom, description,"createdAt","updatedAt") 
VALUES 
    ('Base Company', 'Base Company',now(),now());


INSERT INTO "Contact" (nom, prenom, email, telephone, "dateNaissance", age, sexe, adresse, ville, "codePostal", "numeroSecu", "organisationId", "createdAt", "updatedAt") 
VALUES
    ('Administrateur','HMS','admin@hms.com', '+2438--------', '1995-05-22', 30, 'M', '81 Av. Luambo C. Matete', 'Kinshasa', '24331', 'SN031', 1,now(),now()),
    ('Kabongo', 'Jean', 'jean.kabongo@example.com', '+243810111111', '1985-03-10', 40, 'M', '12 Av. Lumumba C. Gombe', 'Kinshasa', '24301', 'SN001', 1,now(),now()),
    ('Mulemba', 'Grace', 'grace.mulemba@example.com', '+243810222222', '1992-07-21', 33, 'F', '45 Av. Kasa-Vubu C. Kintambo', 'Kinshasa', '24302', 'SN002', 1,now(),now()),
    ('Mbala', 'Patrick', 'patrick.mbala@example.com', '+243810333333', '1978-11-05', 46, 'M', '89 Av. Kasavubu C. Ngaliema', 'Kinshasa', '24303', 'SN003', 1,now(),now()),
    ('Tshibola', 'Aline', 'aline.tshibola@example.com', '+243810444444', '2000-02-14', 25, 'F', '23 Av. Sendwe C. Matete', 'Kinshasa', '24304', 'SN004', 1,now(),now()),
    ('Kalala', 'David', 'david.kalala@example.com', '+243810555555', '1995-12-30', 29, 'M', '67 Av. Mobutu C. Masina', 'Kinshasa', '24305', 'SN005', 1,now(),now()),
    ('Mboyo', 'Chantal', 'chantal.mboyo@example.com', '+243810666666', '1988-04-12', 37, 'F', '14 Av. Libération C. Gombe', 'Kinshasa', '24306', 'SN006', 1,now(),now()),
    ('Ngoma', 'Eric', 'eric.ngoma@example.com', '+243810777777', '1983-09-18', 42, 'M', '56 Av. Inga C. Ngaliema', 'Kinshasa', '24307', 'SN007', 1,now(),now()),
    ('Kasongo', 'Beatrice', 'beatrice.kasongo@example.com', '+243810888888', '1991-01-25', 34, 'F', '78 Av. Huileries C. Bandal', 'Kinshasa', '24308', 'SN008', 1,now(),now()),
    ('Tshisekedi', 'Claude', 'claude.tshisekedi@example.com', '+243810999999', '1987-06-08', 38, 'M', '22 Av. Tshatshi C. Gombe', 'Kinshasa', '24309', 'SN009', 1,now(),now()),
    ('Mwamba', 'Delphine', 'delphine.mwamba@example.com', '+243811000000', '1993-05-03', 32, 'F', '34 Av. Kasapa C. Limete', 'Kinshasa', '24310', 'SN010', 1,now(),now()),
    ('Ilunga', 'Serge', 'serge.ilunga@example.com', '+243811010101', '1982-01-15', 43, 'M', '11 Av. Université C. Limete', 'Kinshasa', '24311', 'SN011', 1,now(),now()),
    ('Mutombo', 'Sarah', 'sarah.mutombo@example.com', '+243811020202', '1996-09-09', 28, 'F', '19 Av. Kasangulu C. Ndjili', 'Kinshasa', '24312', 'SN012', 1,now(),now()),
    ('Kabasele', 'Franck', 'franck.kabasele@example.com', '+243811030303', '1989-07-23', 36, 'M', '101 Av. Bumbu C. Bumbu', 'Kinshasa', '24313', 'SN013', 1,now(),now()),
    ('Nkoy', 'Mireille', 'mireille.nkoy@example.com', '+243811040404', '1994-05-17', 31, 'F', '88 Av. Ndjoku C. Lemba', 'Kinshasa', '24314', 'SN014', 1,now(),now()),
    ('Nzau', 'Hervé', 'herve.nzau@example.com', '+243811050505', '1980-02-11', 45, 'M', '76 Av. Ngiri C. Ngiri-Ngiri', 'Kinshasa', '24315', 'SN015', 1,now(),now()),
    ('Kasanda', 'Olive', 'olive.kasanda@example.com', '+243811060606', '1998-10-27', 26, 'F', '54 Av. Makanza C. Selembao', 'Kinshasa', '24316', 'SN016', 1,now(),now()),
    ('Makiese', 'Jean-Paul', 'jp.makiese@example.com', '+243811070707', '1986-04-06', 39, 'M', '33 Av. Matadi C. Ngaliema', 'Kinshasa', '24317', 'SN017', 1,now(),now()),
    ('Mwamba', 'Clarisse', 'clarisse.mwamba@example.com', '+243811080808', '1990-08-19', 34, 'F', '20 Av. Sendwe C. Kalamu', 'Kinshasa', '24318', 'SN018', 1,now(),now()),
    ('Banza', 'Louis', 'louis.banza@example.com', '+243811090909', '1977-11-30', 47, 'M', '70 Av. Itaga C. Lingwala', 'Kinshasa', '24319', 'SN019', 1,now(),now()),
    ('Mulumba', 'Alice', 'alice.mulumba@example.com', '+243811101010', '1997-07-07', 28, 'F', '98 Av. Kikwit C. Mont-Ngafula', 'Kinshasa', '24320', 'SN020', 1,now(),now()),
    ('Kasuku', 'Robert', 'robert.kasuku@example.com', '+243811111112', '1985-03-02', 40, 'M', '60 Av. Nguma C. Kasa-Vubu', 'Kinshasa', '24321', 'SN021', 1,now(),now()),
    ('Mbayo', 'Nadine', 'nadine.mbayo@example.com', '+243811121213', '1992-09-16', 33, 'F', '39 Av. Lubumbashi C. Masina', 'Kinshasa', '24322', 'SN022', 1,now(),now()),
    ('Kalenga', 'Yves', 'yves.kalenga@example.com', '+243811131314', '1984-06-21', 41, 'M', '55 Av. Batetela C. Ngaba', 'Kinshasa', '24323', 'SN023', 1,now(),now()),
    ('Lukusa', 'Rachel', 'rachel.lukusa@example.com', '+243811141415', '1999-01-11', 26, 'F', '77 Av. Mpasa C. Kimbaseke', 'Kinshasa', '24324', 'SN024', 1,now(),now()),
    ('Ngandu', 'Albert', 'albert.ngandu@example.com', '+243811151516', '1981-12-01', 43, 'M', '12 Av. Benseke C. Maluku', 'Kinshasa', '24325', 'SN025', 1,now(),now()),
    ('Mwema', 'Sylvie', 'sylvie.mwema@example.com', '+243811161617', '1995-05-22', 30, 'F', '14 Av. Mpoko C. Gombe', 'Kinshasa', '24326', 'SN026', 1,now(),now()),
    ('Kanyinda', 'Joel', 'joel.kanyinda@example.com', '+243811171718', '1987-09-03', 37, 'M', '27 Av. Tshuapa C. Kintambo', 'Kinshasa', '24327', 'SN027', 1,now(),now()),
    ('Mbemba', 'Patricia', 'patricia.mbemba@example.com', '+243811181819', '1993-02-28', 32, 'F', '81 Av. Luambo C. Matete', 'Kinshasa', '24328', 'SN028', 1,now(),now()),
    ('Katende', 'Samuel', 'samuel.katende@example.com', '+243811191920', '1986-10-19', 39, 'M', '91 Av. Kabinda C. Ndjili', 'Kinshasa', '24329', 'SN029', 1,now(),now()),
    ('Kasai', 'Monique', 'monique.kasai@example.com', '+243811202021', '1990-03-14', 35, 'F', '42 Av. Kikwit C. Lemba', 'Kinshasa', '24330', 'SN030', 1,now(),now());

INSERT INTO "Patient" ("typePatient", convention, "contactUrgence", "telephoneUrgence", allergies, antecedents, traitements, statut, "contactId", "organisationId", "createdAt", "updatedAt") 
VALUES
    ('private', NULL, 'Maman Kabongo', '+243970111111', 'Arachide', 'Asthme', 'Ventoline', 'Actif', 1, 1,now(),now()),
    ('insured', 'CNSS', 'Papa Mulemba', '+243970222222', 'Pénicilline', 'Diabète', 'Metformine', 'Actif', 2, 1,now(),now()),
    ('insured', 'SNEL', 'Frère Mbala', '+243970333333', 'Latex', 'Hypertension', 'Amlodipine', 'Actif', 3, 1,now(),now()),
    ('private', NULL, 'Sœur Tshibola', '+243970444444', 'Aucun', 'Aucun', 'Paracétamol', 'Inactif', 4, 1,now(),now()),
    ('insured', 'DGI', 'Oncle Kalala', '+243970555555', 'Fruits de mer', 'Ulcère', 'Oméprazole', 'Actif', 5, 1,now(),now()),
    ('private', NULL, 'Papa Mboyo', '+243970666666', 'Arachide', 'Asthme', 'Ventoline', 'Actif', 6, 1,now(),now()),
    ('insured', 'SNEL', 'Maman Ngoma', '+243970777777', 'Aucun', 'Diabète', 'Insuline', 'Inactif', 7, 1,now(),now()),
    ('insured', 'CNSS', 'Oncle Kasongo', '+243970888888', 'Pollen', 'Hypertension', 'Captopril', 'Actif', 8, 1,now(),now()),
    ('private', NULL, 'Tante Tshisekedi', '+243970999999', 'Fruits de mer', 'Asthme', 'Salbutamol', 'Actif', 9, 1,now(),now()),
    ('insured', 'DGI', 'Papa Mwamba', '+243971000000', 'Aucun', 'Aucun', 'Ibuprofène', 'Actif', 10, 1,now(),now()),
    ('private', NULL, 'Maman Ilunga', '+243971010101', 'Aucun', 'Paludisme', 'Quinine', 'Actif', 11, 1,now(),now()),
    ('insured', 'CNSS', 'Papa Mutombo', '+243971020202', 'Lactose', 'Asthme', 'Ventoline', 'Actif', 12, 1,now(),now()),
    ('private', NULL, 'Frère Kabasele', '+243971030303', 'Aucun', 'Diabète', 'Metformine', 'Inactif', 13, 1,now(),now()),
    ('insured', 'SNEL', 'Tante Nkoy', '+243971040404', 'Œufs', 'Hypertension', 'Losartan', 'Actif', 14, 1,now(),now()),
    ('insured', 'DGI', 'Oncle Nzau', '+243971050505', 'Arachide', 'Asthme', 'Salbutamol', 'Actif', 15, 1,now(),now()),
    ('private', NULL, 'Papa Kasanda', '+243971060606', 'Pénicilline', 'Ulcère', 'Oméprazole', 'Inactif', 16, 1,now(),now()),
    ('insured', 'CNSS', 'Maman Makiese', '+243971070707', 'Aucun', 'Asthme', 'Ventoline', 'Actif', 17, 1,now(),now()),
    ('private', NULL, 'Frère Mwamba', '+243971080808', 'Gluten', 'Diabète', 'Insuline', 'Actif', 18, 1,now(),now()),
    ('insured', 'SNEL', 'Oncle Banza', '+243971090909', 'Fruits de mer', 'Hypertension', 'Amlodipine', 'Actif', 19, 1,now(),now()),
    ('insured', 'DGI', 'Maman Mulumba', '+243971101010', 'Aucun', 'Paludisme', 'Coartem', 'Actif', 20, 1,now(),now()),
    ('private', NULL, 'Papa Kasuku', '+243971111112', 'Latex', 'Asthme', 'Ventoline', 'Actif', 21, 1,now(),now()),
    ('insured', 'CNSS', 'Tante Mbayo', '+243971121213', 'Aucun', 'Ulcère', 'Oméprazole', 'Inactif', 22, 1,now(),now()),
    ('private', NULL, 'Frère Kalenga', '+243971131314', 'Aucun', 'Diabète', 'Metformine', 'Actif', 23, 1,now(),now()),
    ('insured', 'SNEL', 'Oncle Lukusa', '+243971141415', 'Arachide', 'Hypertension', 'Captopril', 'Actif', 24, 1,now(),now()),
    ('insured', 'DGI', 'Papa Ngandu', '+243971151516', 'Aucun', 'Asthme', 'Ventoline', 'Actif', 25, 1,now(),now()),
    ('private', NULL, 'Maman Mwema', '+243971161617', 'Pollen', 'Diabète', 'Insuline', 'Actif', 26, 1,now(),now()),
    ('insured', 'CNSS', 'Frère Kanyinda', '+243971171718', 'Fruits de mer', 'Ulcère', 'Oméprazole', 'Inactif', 27, 1,now(),now()),
    ('insured', 'SNEL', 'Tante Mbemba', '+243971181819', 'Œufs', 'Asthme', 'Salbutamol', 'Actif', 28, 1,now(),now()),
    ('private', NULL, 'Papa Katende', '+243971191920', 'Aucun', 'Hypertension', 'Amlodipine', 'Actif', 29, 1,now(),now()),
    ('insured', 'DGI', 'Maman Kasai', '+243971202021', 'Pénicilline', 'Paludisme', 'Coartem', 'Actif', 30, 1,now(),now());

INSERT INTO "Service" (nom, description, code, "organisationId", "createdAt", "updatedAt")
VALUES
  ('🩺 Consultation Médicale', 'Service de consultation médicale', 'CONSULT', 1,now(),now()),
  ('💉 Infirmerie', 'Service d''infirmerie', 'INFIRMERIE', 1,now(),now()),
  ('🧪 Laboratoire', 'Service de laboratoire', 'LABO', 1,now(),now()),
  ('📷 Imagerie Médicale', 'Service d''imagerie médicale', 'IMAGERIE', 1,now(),now()),
  ('💳 Caisse', 'Service de caisse', 'CAISSE', 1,now(),now()),
  ('💊 Pharmacie', 'Service de pharmacie', 'PHARMACIE', 1,now(),now()),
  ('🦷 Odontologie', 'Service de soins dentaires', 'ODONTO', 1,now(),now()),
  ('👶 Maternité', 'Service de maternité et suivi prénatal', 'MATERNITE', 1,now(),now()),
  ('🏥 Urgences', 'Service d''urgences médicales', 'URGENCES', 1,now(),now()),
  ('🧠 Neurologie', 'Service de neurologie', 'NEURO', 1,now(),now()),
  ('❤️ Cardiologie', 'Service de cardiologie', 'CARDIO', 1,now(),now()),
  ('👁️ Ophtalmologie', 'Service d''ophtalmologie', 'OPHTALMO', 1,now(),now()),
  ('🦴 Orthopédie', 'Service d''orthopédie', 'ORTHO', 1,now(),now()),
  ('🩻 Radiologie', 'Service de radiologie', 'RADIO', 1,now(),now()),
  ('🧬 Génétique', 'Service de génétique médicale', 'GENETIQUE', 1,now(),now()),
  ('🧑‍⚕️ Rééducation', 'Service de physiothérapie et rééducation', 'REEDUCATION', 1,now(),now()), 
  ('🫀 Pneumologie', 'Service de pneumologie et voies respiratoires', 'PNEUMO', 1,now(),now()),
  ('🩸 Hématologie', 'Service d''hématologie', 'HEMATO', 1,now(),now()),
  ('🧪 Biochimie', 'Service de biochimie et analyses médicales', 'BIOCHIMIE', 1,now(),now()),
  ('🦠 Microbiologie', 'Service de microbiologie et infectiologie', 'MICROBIO', 1,now(),now()),
  ('🫁 Allergologie', 'Service d''allergologie et immunologie', 'ALLERGO', 1,now(),now()),
  ('🧠 Psychiatrie', 'Service de psychiatrie et santé mentale', 'PSYCHIATRIE', 1,now(),now()),
  ('🧬 Endocrinologie', 'Service d''endocrinologie et métabolisme', 'ENDO', 1,now(),now()),
  ('🧬 Gynécologie', 'Service de gynécologie et suivi féminin', 'GYNECO', 1,now(),now()),
  ('🫁 Réanimation', 'Service de soins intensifs et réanimation', 'REANIMATION', 1,now(),now()),
  ('🧑‍⚕️ Kinésithérapie', 'Service de kinésithérapie et rééducation', 'KINESIO', 1,now(),now()),
  ('🧪 Pathologie', 'Service de pathologie et analyses histologiques', 'PATHO', 1,now(),now()),
  ('🦾 Prothèses', 'Service de prothèses et appareillages', 'PROTHESE', 1,now(),now()),
  ('🧬 Nutrition', 'Service de diététique et nutrition', 'NUTRITION', 1,now(),now()),
  ('🧑‍⚕️ Ambulance', 'Service de transport médicalisé', 'AMBULANCE', 1,now(),now());

INSERT INTO "Role" (nom, description, "organisationId", "createdAt", "updatedAt") 
VALUES 
    ('Admin', 'Role d''administrateur', 1,now(),now()),
    ('User', 'Role d''utilisateur', 1,now(),now());

INSERT INTO "Fonction" (nom, code, description, "createdAt", "updatedAt") 
VALUES 
    ('Administrateur', 'administrateur', 'Module Administration', now(),now()),
    ('Finance and Comptabilité', 'finance_and_comptabilite', 'Module Finance et Comptabilité', now(),now()),
    ('Parametrage', 'parametrage', 'Module Paramétrage', now(),now()),
    ('Rapports', 'rapports', 'Module Rapports', now(),now()),
    ('Facturation', 'facturation', 'Module Facturation', now(),now()),
    ('Tableau de Bord Financier', 'tableau_de_bord_financier', 'Module Tableau de Bord Financier', now(),now()),
    ('Analyse de Revenus', 'analyse_de_revenus', 'Module Analyse de Revenus', now(),now()),
    ('Gestion des dépenses', 'gestion_des_depenses', 'Module Gestion des dépenses', now(),now()),
    ('Rapports Financiers', 'rapports_financiers', 'Module Rapports Financiers', now(),now()),
    ('Services Medicaux', 'services_medicaux', 'Module Services Medicaux', now(),now()),
    ('Hospitalisation', 'hospitalisation', 'Module Hospitalisation', now(),now()),
    ('Gestion Medicale', 'gestion_medicale', 'Module Gestion Medicale', now(),now()),
    ('Parcous Patient', 'parcous_patient', 'Module Parcous Patient', now(),now());

INSERT INTO "Permission" (name,"fonctionId", "organisationId","canCreate", "canRead", "canUpdate", "canDelete", "createdAt", "updatedAt") 
VALUES
    ('Administrateur', 1, 1, true, true, true, true, now(), now()),
    ('Finance and Comptabilité', 2, 1, true, true, true, true, now(), now()),
    ('Paramétrage', 3, 1, true, true, true, true, now(), now()),
    ('Rapports', 4, 1, true, true, true, true, now(), now()),
    ('Facturation', 5, 1, true, true, true, true, now(), now()),
    ('Tableau de Bord Financier', 6, 1, true, true, true, true, now(), now()),
    ('Analyse de Revenus', 7, 1, true, true, true, true, now(), now()),
    ('Gestion des Dépenses', 8, 1, true, true, true, true, now(), now()),
    ('Rapports Financiers', 9, 1, true, true, true, true, now(), now()),
    ('Services Médicaux', 10, 1, true, true, true, true, now(), now()),
    ('Hospitalisation', 11, 1, true, true, true, true, now(), now()),
    ('Gestion Médicale', 12, 1, true, true, true, true, now(), now()),
    ('Parcous Patient', 13, 1, true, true, true, true, now(), now());


INSERT INTO "RolePermission" ("roleId", "permissionId") 
VALUES 
    (1, 1),
    (1, 2),
    (1, 3),
    (1, 4),
    (1, 5),
    (1, 6),
    (1, 7),
    (1, 8),
    (1, 9),
    (1, 10),
    (1, 11),
    (1, 12),
    (1, 13);

INSERT INTO "User" (id, email, password, "accessType", "roleId", "organisationId","contactId", "createdAt", "updatedAt") 
VALUES 
    ('8dfff9sxc','admin@hms.com', '$2b$12$3nC6puqJwlOa/oXIbu0wtu1EUUmfMWY6LDMk6DypWC42n58YerUES', 'ADMIN_GLOBAL_HMS', 1, 1,1,now(),now());