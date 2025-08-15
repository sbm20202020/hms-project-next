import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const dossiers = await prisma.dossierPatient.findMany()
  const dossiersWithPatient = await Promise.all(
    dossiers.map(async (dossier) => {
      let patient = {}
      if (dossier.patientId) {
        patient = await prisma.patient.findUnique({
          where: { id: dossier.patientId },
        })
      }
      let service = {}
      if (dossier.serviceId) {
        service = await prisma.service.findUnique({
          where: { id: dossier.serviceId },
        })
      }
      return { ...dossier, patient, service }
    })
  )
  return NextResponse.json(dossiersWithPatient)
}

export async function POST(request) {
  try {
    const newDossier = await request.json()
    const result = await prisma.dossierPatient.create({
      data: newDossier,
    })
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.log("error------------", error)
    return NextResponse.json({ error: "Erreur lors de la création du dossier" }, { status: 500 })
  }
}
