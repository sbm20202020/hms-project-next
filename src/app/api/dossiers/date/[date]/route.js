
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getDayRange } from "@/utils/helpers";

export async function GET(req, { params }) {
    const { date } = await params; 
    const d = new Date(date) 
    const { start, end } = getDayRange(d)
    console.log("start", start)
    console.log("end", end)
    const dossiers = await prisma.dossierPatient.findMany({
        where: {
            dateCreation: {
                gte: start,
                lte: end,
            },
        },
    })
    return NextResponse.json(dossiers)
}