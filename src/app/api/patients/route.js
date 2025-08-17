import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { calculerAge } from "@/utils/helpers";

// Schéma de validation avec Zod
const patientSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().min(1, "Le prénom est requis"),
  dateNaissance: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Date de naissance invalide",
  }),
  typePatient: z.string().min(1, "Le type de patient est requis"),
  sexe: z.string().optional(),
  telephone: z.string().optional(),
  adresse: z.string().optional(),
  ville: z.string().optional(),
  convention: z.string().nullable().optional(),
  dateCreation: z.string().optional(),
  statut: z.string().optional(),
  service: z.string().optional(),
  medecinTraitant: z.string().optional()
});


// Récupération de tous les patients
export async function GET(request) {
  const patients = await prisma.patient.findMany();
  return NextResponse.json(patients);
}

// Création d'un nouveau patient
export async function POST(request) {
  try {
    const body = await request.json();
    const validation = patientSchema.parse(body);

    
    const contactData = {
      ...validation,
      dateNaissance: new Date(validation.dateNaissance),
      age: calculerAge(validation.dateNaissance),
    };
    
    const contact = await prisma.contact.create({
      data: contactData,
    });

    console.log("contact----------->", contact);
    
    const patientData = {
      typePatient: validation.typePatient,
      convention: validation.convention,
      dateCreation: new Date(validation.dateCreation),
      statut: validation.statut,
      service: validation.service,
      medecinTraitant: validation.medecinTraitant,
      contactId: contact.id,
    };
    const patient = await prisma.patient.create({
      data: patientData,
    });
    console.log("patient----------->", patient);

    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    console.error("Erreur POST patient :", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la création du patient" },
      { status: 500 }
    );
  }
}

// import { NextResponse } from "next/server"
// import prisma from "@/lib/prisma"
// import { number } from "zod"

// // let patients = []

// export async function GET() {
//   const patients = await prisma.patient.findMany()
//   return NextResponse.json(patients)
// }

// export async function POST(request) {
//   try {
//     const newPatient = await request.json()

//     newPatient.age = Number(new Date().getFullYear() - new Date(newPatient.dateNaissance).getFullYear())
//     newPatient.dateNaissance = new Date(newPatient.dateNaissance)
//     await prisma.patient.create({
//       data: newPatient,
//     })
    
//     return NextResponse.json(newPatient, { status: 201 })
//   } catch (error) {
//     console.log("error------------", error)
//     return NextResponse.json({ error: "Erreur lors de la création du patient" }, { status: 500 })
//   }
// }
