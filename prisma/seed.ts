// prisma/seed.ts
import { PrismaClient } from "../src/generated/prisma"

const prisma = new PrismaClient()

async function main() {
  // 1. Create Services
  console.log('🏥 Creating Services...')
  const services = await Promise.all([
    prisma.service.upsert({ where: { id: 1 }, update: {}, create: { nom: '🩺 Consultation Médicale', description: 'Service de consultation médicale', code: 'CONSULT' }}),
    prisma.service.upsert({ where: { id: 2 }, update: {}, create: { nom: '💉 Infirmerie', description: 'Service d\'infirmerie', code: 'INFIRMERIE' }}),
    prisma.service.upsert({ where: { id: 3 }, update: {}, create: { nom: '🧪 Laboratoire', description: 'Service de laboratoire', code: 'LABO' }}),
    prisma.service.upsert({ where: { id: 4 }, update: {}, create: { nom: '📷 Imagerie Médicale', description: 'Service d\'imagerie médicale', code: 'IMAGERIE' }}),
    prisma.service.upsert({ where: { id: 5 }, update: {}, create: { nom: '💳 Caisse', description: 'Service de caisse', code: 'CAISSE' }}),
    prisma.service.upsert({ where: { id: 6 }, update: {}, create: { nom: '💊 Pharmacie', description: 'Service de pharmacie', code: 'PHARMACIE' }}),
    prisma.service.upsert({ where: { id: 7 }, update: {}, create: { nom: '🦷 Odontologie', description: 'Service de soins dentaires', code: 'ODONTO' }}),
    prisma.service.upsert({ where: { id: 8 }, update: {}, create: { nom: '👶 Maternité', description: 'Service de maternité et suivi prénatal', code: 'MATERNITE' }}),
    prisma.service.upsert({ where: { id: 9 }, update: {}, create: { nom: '🏥 Urgences', description: 'Service d\'urgences médicales', code: 'URGENCES' }}),
    prisma.service.upsert({ where: { id: 10 }, update: {}, create: { nom: '🧠 Neurologie', description: 'Service de neurologie', code: 'NEURO' }}),
    prisma.service.upsert({ where: { id: 11 }, update: {}, create: { nom: '❤️ Cardiologie', description: 'Service de cardiologie', code: 'CARDIO' }}),
    prisma.service.upsert({ where: { id: 12 }, update: {}, create: { nom: '👁️ Ophtalmologie', description: 'Service d\'ophtalmologie', code: 'OPHTALMO' }}),
    prisma.service.upsert({ where: { id: 13 }, update: {}, create: { nom: '🦴 Orthopédie', description: 'Service d\'orthopédie', code: 'ORTHO' }}),
    prisma.service.upsert({ where: { id: 14 }, update: {}, create: { nom: '🩻 Radiologie', description: 'Service de radiologie', code: 'RADIO' }}),
    prisma.service.upsert({ where: { id: 15 }, update: {}, create: { nom: '🧬 Génétique', description: 'Service de génétique médicale', code: 'GENETIQUE' }}),
    prisma.service.upsert({ where: { id: 16 }, update: {}, create: { nom: '🧑‍⚕️ Rééducation', description: 'Service de physiothérapie et rééducation', code: 'REEDUCATION' }}),
    prisma.service.upsert({ where: { id: 17 }, update: {}, create: { nom: '🫀 Pneumologie', description: 'Service de pneumologie et voies respiratoires', code: 'PNEUMO' }}),
    prisma.service.upsert({ where: { id: 18 }, update: {}, create: { nom: '🩸 Hématologie', description: 'Service d\'hématologie', code: 'HEMATO' }}),
    prisma.service.upsert({ where: { id: 19 }, update: {}, create: { nom: '🧪 Biochimie', description: 'Service de biochimie et analyses médicales', code: 'BIOCHIMIE' }}),
    prisma.service.upsert({ where: { id: 20 }, update: {}, create: { nom: '🦠 Microbiologie', description: 'Service de microbiologie et infectiologie', code: 'MICROBIO' }}),
    prisma.service.upsert({ where: { id: 21 }, update: {}, create: { nom: '🫁 Allergologie', description: 'Service d\'allergologie et immunologie', code: 'ALLERGO' }}),
    prisma.service.upsert({ where: { id: 22 }, update: {}, create: { nom: '🧠 Psychiatrie', description: 'Service de psychiatrie et santé mentale', code: 'PSYCHIATRIE' }}),
    prisma.service.upsert({ where: { id: 23 }, update: {}, create: { nom: '🧬 Endocrinologie', description: 'Service d\'endocrinologie et métabolisme', code: 'ENDO' }}),
    prisma.service.upsert({ where: { id: 24 }, update: {}, create: { nom: '🧬 Gynécologie', description: 'Service de gynécologie et suivi féminin', code: 'GYNECO' }}),
    prisma.service.upsert({ where: { id: 25 }, update: {}, create: { nom: '🫁 Réanimation', description: 'Service de soins intensifs et réanimation', code: 'REANIMATION' }}),
    prisma.service.upsert({ where: { id: 26 }, update: {}, create: { nom: '🧑‍⚕️ Kinésithérapie', description: 'Service de kinésithérapie et rééducation', code: 'KINESIO' }}),
    prisma.service.upsert({ where: { id: 27 }, update: {}, create: { nom: '🧪 Pathologie', description: 'Service de pathologie et analyses histologiques', code: 'PATHO' }}),
    prisma.service.upsert({ where: { id: 28 }, update: {}, create: { nom: '🦾 Prothèses', description: 'Service de prothèses et appareillages', code: 'PROTHESE' }}),
    prisma.service.upsert({ where: { id: 29 }, update: {}, create: { nom: '🧬 Nutrition', description: 'Service de diététique et nutrition', code: 'NUTRITION' }}),
    prisma.service.upsert({ where: { id: 30 }, update: {}, create: { nom: '🧑‍⚕️ Ambulance', description: 'Service de transport médicalisé', code: 'AMBULANCE' }})
  ]);

  // // 2. Create Roles and Permissions
  // console.log('👥 Creating Roles and Permissions...')
  // const permissions = await Promise.all([
  //   prisma.permission.upsert({
  //     where: { nom: 'READ_PATIENTS' },
  //     update: {},
  //     create: { nom: 'READ_PATIENTS', description: 'Lire les informations des patients' }
  //   }),
  //   prisma.permission.upsert({
  //     where: { nom: 'WRITE_PATIENTS' },
  //     update: {},
  //     create: { nom: 'WRITE_PATIENTS', description: 'Modifier les informations des patients' }
  //   }),
  //   prisma.permission.upsert({
  //     where: { nom: 'DELETE_PATIENTS' },
  //     update: {},
  //     create: { nom: 'DELETE_PATIENTS', description: 'Supprimer des patients' }
  //   }),
  //   prisma.permission.upsert({
  //     where: { nom: 'MANAGE_APPOINTMENTS' },
  //     update: {},
  //     create: { nom: 'MANAGE_APPOINTMENTS', description: 'Gérer les rendez-vous' }
  //   }),
  //   prisma.permission.upsert({
  //     where: { nom: 'MANAGE_BILLING' },
  //     update: {},
  //     create: { nom: 'MANAGE_BILLING', description: 'Gérer la facturation' }
  //   }),
  //   prisma.permission.upsert({
  //     where: { nom: 'ADMIN_ACCESS' },
  //     update: {},
  //     create: { nom: 'ADMIN_ACCESS', description: 'Accès administrateur complet' }
  //   })
  // ])

  // const roles = await Promise.all([
  //   prisma.role.upsert({
  //     where: { id: 1 },
  //     update: {},
  //     create: { nom: 'Médecin', description: 'Médecin praticien' }
  //   }),
  //   prisma.role.upsert({
  //     where: { id: 2 },
  //     update: {},
  //     create: { nom: 'Infirmier', description: 'Personnel infirmier' }
  //   }),
  //   prisma.role.upsert({
  //     where: { id: 3 },
  //     update: {},
  //     create: { nom: 'Réceptionniste', description: 'Personnel d\'accueil' }
  //   }),
  //   prisma.role.upsert({
  //     where: { id: 4 },
  //     update: {},
  //     create: { nom: 'Administrateur', description: 'Administrateur système' }
  //   })
  // ])

  // // Assign permissions to roles
  // await Promise.all([
  //   // Médecin permissions
  //   prisma.rolePermission.upsert({
  //     where: { roleId_permissionId: { roleId: 1, permissionId: 1 } },
  //     update: {},
  //     create: { roleId: 1, permissionId: 1 }
  //   }),
  //   prisma.rolePermission.upsert({
  //     where: { roleId_permissionId: { roleId: 1, permissionId: 2 } },
  //     update: {},
  //     create: { roleId: 1, permissionId: 2 }
  //   }),
  //   prisma.rolePermission.upsert({
  //     where: { roleId_permissionId: { roleId: 1, permissionId: 4 } },
  //     update: {},
  //     create: { roleId: 1, permissionId: 4 }
  //   }),
  //   // Admin permissions
  //   prisma.rolePermission.upsert({
  //     where: { roleId_permissionId: { roleId: 4, permissionId: 6 } },
  //     update: {},
  //     create: { roleId: 4, permissionId: 6 }
  //   })
  // ])

  // // 3. Create Users and Employees
  // console.log('👨‍⚕️ Creating Users and Employees...')
  // const users = await Promise.all([
  //   prisma.user.upsert({
  //     where: { email: 'dr.mukendi@hms.cd' },
  //     update: {},
  //     create: {
  //       nom: 'Dr. Sarah Mukendi',
  //       email: 'dr.mukendi@hms.cd',
  //       password: '$2b$10$hashedpassword1',
  //       roleId: 1,
  //       employe: {
  //         create: {
  //           nom: 'Mukendi',
  //           prenom: 'Sarah',
  //           fonction: 'Médecin Généraliste',
  //           code: 'MED001'
  //         }
  //       }
  //     }
  //   }),
  //   prisma.user.upsert({
  //     where: { email: 'inf.ngoma@hms.cd' },
  //     update: {},
  //     create: {
  //       nom: 'Paul Ngoma',
  //       email: 'inf.ngoma@hms.cd',
  //       password: '$2b$10$hashedpassword2',
  //       roleId: 2,
  //       employe: {
  //         create: {
  //           nom: 'Ngoma',
  //           prenom: 'Paul',
  //           fonction: 'Infirmier',
  //           code: 'INF001'
  //         }
  //       }
  //     }
  //   }),
  //   prisma.user.upsert({
  //     where: { email: 'admin@hms.cd' },
  //     update: {},
  //     create: {
  //       nom: 'Administrateur',
  //       email: 'admin@hms.cd',
  //       password: '$2b$10$hashedpassword3',
  //       roleId: 4,
  //       employe: {
  //         create: {
  //           nom: 'Admin',
  //           prenom: 'Système',
  //           fonction: 'Administrateur',
  //           code: 'ADM001'
  //         }
  //       }
  //     }
  //   })
  // ])

  // 4. Create Patients
  // console.log('🏥 Creating Patients...')
  // const patients = await Promise.all([
  //   prisma.patient.upsert({ where: { id: 1 }, update: {}, create: { nom: 'Ngoma', prenom: 'Paul', dateNaissance: new Date('1985-04-12'), age: 40, sexe: 'M', telephone: '+243810000001', email: 'paul.ngoma@yopmail.com', adresse: '12 Av. Lumumba, Limete, Kinshasa', ville: 'Kinshasa', codePostal: '10100', numeroSecu: 'SEC1001', typePatient: 'private', contactUrgence: 'Marie Ngoma', telephoneUrgence: '+243810100001', allergies: 'Pollen', antecedents: 'Asthme', traitements: 'Ventoline', derniereVisite: new Date('2025-07-10') }}),
  //   prisma.patient.upsert({ where: { id: 2 }, update: {}, create: { nom: 'Mukendi', prenom: 'Sarah', dateNaissance: new Date('1990-08-22'), age: 35, sexe: 'F', telephone: '+243810000002', email: 'sarah.mukendi@yopmail.com', adresse: '45 Bd Kasa-Vubu, Kalamu, Kinshasa', ville: 'Lubumbashi', codePostal: '10200', numeroSecu: 'SEC1002', typePatient: 'insured', convention: 'CNSS', contactUrgence: 'Jean Mukendi', telephoneUrgence: '+243810100002', allergies: 'Arachides', antecedents: 'Hypertension', traitements: 'Amlodipine', derniereVisite: new Date('2025-06-15') }}),
  //   prisma.patient.upsert({ where: { id: 3 }, update: {}, create: { nom: 'Mbala', prenom: 'Jean', dateNaissance: new Date('1978-12-05'), age: 46, sexe: 'M', telephone: '+243810000003', email: 'jean.mbala@yopmail.com', adresse: '78 Rue du Marche, Commune Centre, Goma', ville: 'Goma', codePostal: '10300', numeroSecu: 'SEC1003', typePatient: 'private', contactUrgence: 'Pierre Mbala', telephoneUrgence: '+243810100003', antecedents: 'Diabete', traitements: 'Metformine', statut: 'Inactif', derniereVisite: new Date('2025-05-20') }}),
  //   prisma.patient.upsert({ where: { id: 4 }, update: {}, create: { nom: 'Kabongo', prenom: 'Julie', dateNaissance: new Date('1982-03-15'), age: 43, sexe: 'F', telephone: '+243810000004', email: 'julie.kabongo@yopmail.com', adresse: '15 Av. du Fleuve, Commune Nord, Matadi', ville: 'Matadi', codePostal: '10400', numeroSecu: 'SEC1004', typePatient: 'insured', convention: 'Mutuelle', contactUrgence: 'Joseph Kabongo', telephoneUrgence: '+243810100004', antecedents: 'Migraine', traitements: 'Paracetamol', derniereVisite: new Date('2025-08-01') }}),
  //   prisma.patient.upsert({ where: { id: 5 }, update: {}, create: { nom: 'Mutombo', prenom: 'Daniel', dateNaissance: new Date('1995-09-09'), age: 29, sexe: 'M', telephone: '+243810000005', email: 'daniel.mutombo@yopmail.com', adresse: '23 Rue des Ecoles, Commune Sud, Mbandaka', ville: 'Mbandaka', codePostal: '10500', numeroSecu: 'SEC1005', typePatient: 'private', contactUrgence: 'Esther Mutombo', telephoneUrgence: '+243810100005', allergies: 'Lactose', derniereVisite: new Date('2025-07-25') }}),
  //   prisma.patient.upsert({ where: { id: 6 }, update: {}, create: { nom: 'Nzinga', prenom: 'Claire', dateNaissance: new Date('1987-11-17'), age: 37, sexe: 'F', telephone: '+243810000006', email: 'claire.nzinga@yopmail.com', adresse: '90 Av. du Port, Commune Est, Bukavu', ville: 'Bukavu', codePostal: '10600', numeroSecu: 'SEC1006', typePatient: 'insured', convention: 'Assurance Privee', contactUrgence: 'Patrick Nzinga', telephoneUrgence: '+243810100006', allergies: 'Gluten', antecedents: 'Anemie', traitements: 'Fer', derniereVisite: new Date('2025-07-19') }}),
  //   prisma.patient.upsert({ where: { id: 7 }, update: {}, create: { nom: 'Kasongo', prenom: 'Albert', dateNaissance: new Date('1975-06-30'), age: 50, sexe: 'M', telephone: '+243810000007', email: 'albert.kasongo@yopmail.com', adresse: '34 Rue de la Paix, Commune Ouest, Kisangani', ville: 'Kisangani', codePostal: '10700', numeroSecu: 'SEC1007', typePatient: 'private', contactUrgence: 'Martha Kasongo', telephoneUrgence: '+243810100007', allergies: 'Pollen', antecedents: 'Asthme', traitements: 'Ventoline', statut: 'Inactif', derniereVisite: new Date('2025-06-10') }}),
  //   prisma.patient.upsert({ where: { id: 8 }, update: {}, create: { nom: 'Lukusa', prenom: 'Monique', dateNaissance: new Date('1992-10-25'), age: 32, sexe: 'F', telephone: '+243810000008', email: 'monique.lukusa@yopmail.com', adresse: '67 Bd du Travail, Commune Centre, Kananga', ville: 'Kananga', codePostal: '10800', numeroSecu: 'SEC1008', typePatient: 'insured', convention: 'CNSS', contactUrgence: 'Luc Lukusa', telephoneUrgence: '+243810100008', allergies: 'Arachides', antecedents: 'Hypertension', traitements: 'Amlodipine', derniereVisite: new Date('2025-08-05') }}),
  //   prisma.patient.upsert({ where: { id: 9 }, update: {}, create: { nom: 'Kabasele', prenom: 'Herve', dateNaissance: new Date('1980-05-14'), age: 45, sexe: 'M', telephone: '+243810000009', email: 'herve.kabasele@yopmail.com', adresse: '89 Av. Mobutu, Commune Est, Mbuji-Mayi', ville: 'Mbuji-Mayi', codePostal: '10900', numeroSecu: 'SEC1009', typePatient: 'private', contactUrgence: 'Anna Kabasele', telephoneUrgence: '+243810100009', antecedents: 'Diabete', traitements: 'Metformine', derniereVisite: new Date('2025-07-28') }}),
  //   prisma.patient.upsert({ where: { id: 10 }, update: {}, create: { nom: 'Shabani', prenom: 'Nadia', dateNaissance: new Date('1984-02-08'), age: 41, sexe: 'F', telephone: '+243810000010', email: 'nadia.shabani@yopmail.com', adresse: '11 Rue de l\'Hopital, Commune Sud, Kolwezi', ville: 'Kolwezi', codePostal: '11000', numeroSecu: 'SEC1010', typePatient: 'insured', convention: 'Mutuelle', contactUrgence: 'Paul Shabani', telephoneUrgence: '+243810100010', allergies: 'Fruits de mer', traitements: 'Vitamine D', derniereVisite: new Date('2025-08-10') }}),
  //   prisma.patient.upsert({ where: { id: 11 }, update: {}, create: { nom: 'Tshibanda', prenom: 'Marc', dateNaissance: new Date('1989-07-09'), age: 36, sexe: 'M', telephone: '+243810000011', email: 'marc.tshibanda@yopmail.com', adresse: '67 Rue de la Paix, Commune Centre, Kolwezi', ville: 'Kolwezi', codePostal: '11100', numeroSecu: 'SEC1011', typePatient: 'private', contactUrgence: 'Didier Mayele', telephoneUrgence: '+243810100011', antecedents: 'Arthrose', traitements: 'Anti-inflammatoires', derniereVisite: new Date('2025-06-08') }}),
  //   prisma.patient.upsert({ where: { id: 12 }, update: {}, create: { nom: 'Banza', prenom: 'Grace', dateNaissance: new Date('1992-10-02'), age: 32, sexe: 'F', telephone: '+243810000012', email: 'grace.banza@yopmail.com', adresse: '21 Av. Tshiala, Commune Est, Kikwit', ville: 'Kikwit', codePostal: '11200', numeroSecu: 'SEC1012', typePatient: 'insured', convention: 'Assurance Privee', contactUrgence: 'Rebecca Ngalula', telephoneUrgence: '+243810100012', allergies: 'Fruits de mer', antecedents: 'Allergie cutanee', traitements: 'Cremes antihistaminiques', derniereVisite: new Date('2025-06-19') }}),
  //   prisma.patient.upsert({ where: { id: 13 }, update: {}, create: { nom: 'Kanku', prenom: 'Joseph', dateNaissance: new Date('1984-06-12'), age: 41, sexe: 'M', telephone: '+243810000013', email: 'joseph.kanku@yopmail.com', adresse: '54 Rue Kitambo, Commune Nord, Kinshasa', ville: 'Kinshasa', codePostal: '11300', numeroSecu: 'SEC1013', typePatient: 'private', contactUrgence: 'Michel Ngoma', telephoneUrgence: '+243810100013', antecedents: 'Cardiopathie', traitements: 'Beta-bloquants', derniereVisite: new Date('2025-06-25') }}),
  //   prisma.patient.upsert({ where: { id: 14 }, update: {}, create: { nom: 'Mbayo', prenom: 'Clarisse', dateNaissance: new Date('1996-03-21'), age: 29, sexe: 'F', telephone: '+243810000014', email: 'clarisse.mbayo@yopmail.com', adresse: '76 Rue Maman Yemo, Commune Ouest, Lubumbashi', ville: 'Lubumbashi', codePostal: '11400', numeroSecu: 'SEC1014', typePatient: 'insured', convention: 'CNSS', contactUrgence: 'Rose Mbemba', telephoneUrgence: '+243810100014', allergies: 'Pollens', antecedents: 'Asthme', traitements: 'Ventoline', derniereVisite: new Date('2025-07-02') }}),
  //   prisma.patient.upsert({ where: { id: 15 }, update: {}, create: { nom: 'Mbuyi', prenom: 'Arsene', dateNaissance: new Date('1979-01-15'), age: 46, sexe: 'M', telephone: '+243810000015', email: 'arsene.mbuyi@yopmail.com', adresse: '33 Av. Tshisekedi, Commune Centre, Goma', ville: 'Goma', codePostal: '11500', numeroSecu: 'SEC1015', typePatient: 'private', contactUrgence: 'Jacques Tshiala', telephoneUrgence: '+243810100015', antecedents: 'Hernie', traitements: 'Chirurgie', derniereVisite: new Date('2025-05-27') }}),
  //   prisma.patient.upsert({ where: { id: 16 }, update: {}, create: { nom: 'Kanku', prenom: 'Elodie', dateNaissance: new Date('1988-09-05'), age: 36, sexe: 'F', telephone: '+243810000016', email: 'elodie.kanku@yopmail.com', adresse: '88 Rue des Palmiers, Commune Nord, Matadi', ville: 'Matadi', codePostal: '11600', numeroSecu: 'SEC1016', typePatient: 'insured', convention: 'Mutuelle', contactUrgence: 'Nadine Mukeba', telephoneUrgence: '+243810100016', allergies: 'Lactose', antecedents: 'Migraine', traitements: 'Ibuprofene', derniereVisite: new Date('2025-06-22') }}),
  //   prisma.patient.upsert({ where: { id: 17 }, update: {}, create: { nom: 'Ngoma', prenom: 'Christian', dateNaissance: new Date('1980-11-29'), age: 44, sexe: 'M', telephone: '+243810000017', email: 'christian.ngoma@yopmail.com', adresse: '40 Av. Tshibanda, Commune Sud, Mbandaka', ville: 'Mbandaka', codePostal: '11700', numeroSecu: 'SEC1017', typePatient: 'private', contactUrgence: 'Serge Kanku', telephoneUrgence: '+243810100017', antecedents: 'Colopathie', traitements: 'Regime alimentaire', derniereVisite: new Date('2025-07-06') }}),
  //   prisma.patient.upsert({ where: { id: 18 }, update: {}, create: { nom: 'Tshiala', prenom: 'Mireille', dateNaissance: new Date('1991-04-17'), age: 34, sexe: 'F', telephone: '+243810000018', email: 'mireille.tshiala@yopmail.com', adresse: '19 Rue Mutoshi, Commune Est, Bukavu', ville: 'Bukavu', codePostal: '11800', numeroSecu: 'SEC1018', typePatient: 'insured', convention: 'Assurance Privee', contactUrgence: 'Aline Banza', telephoneUrgence: '+243810100018', allergies: 'Poils de chat', antecedents: 'Asthme', traitements: 'Ventoline', derniereVisite: new Date('2025-07-14') }}),
  //   prisma.patient.upsert({ where: { id: 19 }, update: {}, create: { nom: 'Kalonji', prenom: 'Pascal', dateNaissance: new Date('1983-12-25'), age: 41, sexe: 'M', telephone: '+243810000019', email: 'pascal.kalonji@yopmail.com', adresse: '75 Av. Mayombo, Commune Ouest, Likasi', ville: 'Likasi', codePostal: '11900', numeroSecu: 'SEC1019', typePatient: 'private', contactUrgence: 'Fabrice Kanku', telephoneUrgence: '+243810100019', antecedents: 'Hypertension', traitements: 'Amlodipine', derniereVisite: new Date('2025-06-29') }}),
  //   prisma.patient.upsert({ where: { id: 20 }, update: {}, create: { nom: 'Kasayi', prenom: 'Josiane', dateNaissance: new Date('1986-05-11'), age: 39, sexe: 'F', telephone: '+243810000020', email: 'josiane.kasayi@yopmail.com', adresse: '64 Rue du Port, Commune Centre, Boma', ville: 'Boma', codePostal: '12000', numeroSecu: 'SEC1020', typePatient: 'insured', convention: 'CNSS', contactUrgence: 'Laurence Mutombo', telephoneUrgence: '+243810100020', allergies: 'Noix', antecedents: 'Allergie alimentaire', traitements: 'Antihistaminiques', derniereVisite: new Date('2025-06-15') }}),
  //   prisma.patient.upsert({ where: { id: 21 }, update: {}, create: { nom: 'Mwamba', prenom: 'Alain', dateNaissance: new Date('1977-08-19'), age: 48, sexe: 'M', telephone: '+243810000021', email: 'alain.mwamba@yopmail.com', adresse: '59 Rue Kabeya, Commune Sud, Kolwezi', ville: 'Kolwezi', codePostal: '12100', numeroSecu: 'SEC1021', typePatient: 'private', contactUrgence: 'Evariste Ngandu', telephoneUrgence: '+243810100021', antecedents: 'Insuffisance renale', traitements: 'Dialyse', derniereVisite: new Date('2025-07-01') }}),
  //   prisma.patient.upsert({ where: { id: 22 }, update: {}, create: { nom: 'Ngalula', prenom: 'Sophie', dateNaissance: new Date('1993-02-07'), age: 32, sexe: 'F', telephone: '+243810000022', email: 'sophie.ngalula@yopmail.com', adresse: '46 Av. Tshiala, Commune Est, Kikwit', ville: 'Kikwit', codePostal: '12200', numeroSecu: 'SEC1022', typePatient: 'insured', convention: 'Mutuelle', contactUrgence: 'Patricia Mbayo', telephoneUrgence: '+243810100022', allergies: 'Poussiere', antecedents: 'Sinusite', traitements: 'Spray nasal', derniereVisite: new Date('2025-05-30') }}),
  //   prisma.patient.upsert({ where: { id: 23 }, update: {}, create: { nom: 'Muteba', prenom: 'Olivier', dateNaissance: new Date('1981-07-13'), age: 44, sexe: 'M', telephone: '+243810000023', email: 'olivier.muteba@yopmail.com', adresse: '12 Rue Lumbala, Commune Centre, Kinshasa', ville: 'Kinshasa', codePostal: '12300', numeroSecu: 'SEC1023', typePatient: 'private', contactUrgence: 'Jonathan Mbala', telephoneUrgence: '+243810100023', antecedents: 'Sciatique', traitements: 'Physiotherapie', derniereVisite: new Date('2025-06-17') }}),
  //   prisma.patient.upsert({ where: { id: 24 }, update: {}, create: { nom: 'Kayembe', prenom: 'Linda', dateNaissance: new Date('1994-10-23'), age: 30, sexe: 'F', telephone: '+243810000024', email: 'linda.kayembe@yopmail.com', adresse: '22 Av. Kasa-Vubu, Commune Nord, Lubumbashi', ville: 'Lubumbashi', codePostal: '12400', numeroSecu: 'SEC1024', typePatient: 'insured', convention: 'Assurance Privee', contactUrgence: 'Monique Ngoma', telephoneUrgence: '+243810100024', allergies: 'Latex', antecedents: 'Dermatite', traitements: 'Creme corticoide', derniereVisite: new Date('2025-07-10') }}),
  //   prisma.patient.upsert({ where: { id: 25 }, update: {}, create: { nom: 'Mutombo', prenom: 'Andre', dateNaissance: new Date('1976-01-09'), age: 49, sexe: 'M', telephone: '+243810000025', email: 'andre.mutombo@yopmail.com', adresse: '34 Rue Kasavubu, Commune Sud, Goma', ville: 'Goma', codePostal: '12500', numeroSecu: 'SEC1025', typePatient: 'private', contactUrgence: 'Philippe Mbuyi', telephoneUrgence: '+243810100025', antecedents: 'AVC', traitements: 'Reeducation', derniereVisite: new Date('2025-06-05') }})
  // ])

  // // 5. Create Sample Medical Records (DossierPatient)
  console.log('📋 Creating Medical Records...')
  const dossiers = await Promise.all([
    prisma.dossierPatient.create({
      data: {
        code: 'DP-160825-134540-005',
        patientId: 16,
        motifDeVisite: 'Consultation de routine',
        niveauUrgence: 'normale',
        statut: 'attente',
        dateCreation: new Date('2025-08-15'),
      }
    }),
    prisma.dossierPatient.create({
      data: {
        code: 'DP-160825-134540-006',
        patientId: 20,
        serviceId: 10,
        motifDeVisite: 'Douleurs thoraciques',
        niveauUrgence: 'urgente',
        statut: 'oriente',
        dateCreation: new Date('2025-08-15'),
      }
    }),
    prisma.dossierPatient.create({
      data: {
        code: 'DP-160825-134540-007',
        patientId: 9,
        serviceId: 10,
        motifDeVisite: 'Suivi diabète',
        niveauUrgence: 'urgente',
        statut: 'oriente',
        dateCreation: new Date('2025-08-15'),
      }
    })
  ])

  console.log('✅ Seed data created successfully!')
  console.log(`📊 Created:`)
  // console.log(`   - ${services.length} Services`)
  // console.log(`   - ${patients.length} Patients`)
  // console.log(`   - ${permissions.length} Permissions`)
  // console.log(`   - ${roles.length} Roles`)
  // console.log(`   - ${users.length} Users & Employees`)
  // console.log(`   - ${dossiers.length} Medical Records`)
}

main()
  .then(() => {
    console.log('✅ Seed exécuté avec succès')
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
