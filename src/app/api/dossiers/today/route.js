import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getDayRange } from "@/utils/helpers"

export async function GET() {
  const { start, end } = getDayRange()

  const dossiers = await prisma.dossierPatient.findMany({
    where: {
      dateCreation: {
        gte: start,
        lte: end,
      },
    },
  })

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
