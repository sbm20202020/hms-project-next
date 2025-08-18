// prisma/seed.ts
import { PrismaClient } from "../src/generated/prisma"
import { fakerFR as faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  for (let i = 0; i < 30; i++) {
    // Générer un contact
    const contact = await prisma.contact.create({
      data: {
        nom: faker.person.lastName(),
        prenom: faker.person.firstName(),
        email: faker.internet.email().toLowerCase(),
        telephone: `+243 ${faker.number.int({ min: 100000000, max: 999999999 })}`,
        dateNaissance: faker.date.birthdate({ min: 18, max: 80, mode: "age" }),
        age: faker.number.int({ min: 18, max: 80 }),
        sexe: faker.helpers.arrayElement(["M", "F"]),
        adresse: faker.location.streetAddress(),
        ville: faker.location.city(),
        codePostal: faker.location.zipCode(),
        numeroSecu: faker.string.alphanumeric(10),
      },
    });

    // Générer un patient lié au contact
    await prisma.patient.create({
      data: {
        typePatient: faker.helpers.arrayElement(["privé", "assuré"]),
        convention: faker.helpers.arrayElement(["CNSS", "SNEL", "Mutualité", ""]),
        contactUrgence: faker.person.fullName(),
        telephoneUrgence: `+243 ${faker.number.int({ min: 100000000, max: 999999999 })}`,
        allergies: faker.helpers.arrayElement([
          "Aucune",
          "Pénicilline",
          "Pollens",
          "Arachides",
          "Fruits de mer",
        ]),
        antecedents: faker.helpers.arrayElement([
          "Hypertension",
          "Diabète",
          "Asthme",
          "Aucun",
        ]),
        traitements: faker.helpers.arrayElement([
          "Paracétamol",
          "Insuline",
          "Ventoline",
          "Aucun",
        ]),
        statut: faker.helpers.arrayElement(["Actif", "Inactif"]),
        service: faker.helpers.arrayElement([
          "Pédiatrie",
          "Chirurgie",
          "Médecine générale",
          "Cardiologie",
          "Urgence",
        ]),
        medecinTraitant: faker.person.fullName(),
        derniereVisite: faker.date.recent({ days: 90 }),
        contactId: contact.id,
      },
    });
  }

  console.log("✅ Seeding terminé !");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
