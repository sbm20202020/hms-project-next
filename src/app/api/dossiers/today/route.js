import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getDayRange } from "@/utils/helpers"

export async function GET() {
  try {
    const { start, end } = getDayRange()

    const dossiers = await prisma.dossierPatient.findMany({
      where: {
        dateCreation: {
          gte: start,
          lte: end,
        },
      },
      include: {
        patient: true,
        service: true,
        tickets: true,
      },
      orderBy: [
        { dateCreation: "asc" },
        // { niveauUrgence: "desc" },
      ]
    })

    // Tri manuel pour mettre les urgences en premier
    dossiers.sort((a, b) => {
      if (a.niveauUrgence === 'urgente' && b.niveauUrgence !== 'urgente') return -1;
      if (a.niveauUrgence !== 'urgente' && b.niveauUrgence === 'urgente') return 1;
      return 0;
    });

    return NextResponse.json(dossiers)
  } catch (error) {
    console.error("Error fetching data:", error)
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 })
  }
}

// const dossiersWithPatient = await Promise.all(
//   dossiers.map(async (dossier) => {
//     let patient = {}
//     if (dossier.patientId) {
//       patient = await prisma.patient.findUnique({
//         where: { id: dossier.patientId },
//       })
//     }

//     let service = {}
//     if (dossier.serviceId) {
//       service = await prisma.service.findUnique({
//         where: { id: dossier.serviceId },
//       })
//     }

//     return { ...dossier, patient, service }
//   })
// )

// return NextResponse.json(dossiersWithPatient)