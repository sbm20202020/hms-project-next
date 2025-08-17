import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        dateCreation: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
      include: {
        dossierPatient: {
          include: {
            service: true,
          },
        },
      },
      orderBy: {
        dateCreation: "asc",
      },
    })
    return NextResponse.json(tickets)
  } catch (error) {
    console.error("Error fetching tickets:", error)
    return NextResponse.json({ error: "Error fetching tickets" }, { status: 500 })
  }
}
