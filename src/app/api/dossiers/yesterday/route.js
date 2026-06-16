import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getDayRange } from "@/utils/helpers"

export async function GET() {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const { start, end } = getDayRange(yesterday)

    const dossiers = await prisma.dossierPatient.findMany({
        where: {
            createdAt: {
                gte: start,
                lte: end,
            },
        },
        select: {
            id: true,
            statut: true,
            niveauUrgence: true,
            // patientId: true,
            // serviceId: true,
            // patient: true,
            // service: true,
            // code: true,
            // patient: {
            //     select: {
            //         id: true,
            //         nom: true,
            //         prenom: true,
            //         telephone: true,
            //     },
            // },
            // service: {
            //     select: {
            //         id: true,
            //         nom: true,
            //     },
            // },
        },
        // include: {
        //     patient: true,
        //     service: true,
        // },
        // orderBy: {
        //     createdAt: "desc",
        // },
    })
    return NextResponse.json(dossiers)
}
