import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const ticket = await prisma.ticket.update({
      where: { id: Number(id) },
      data: await request.json(),
    })
    return NextResponse.json(ticket)
  } catch (error) {
    console.error("Error updating ticket:", error)
    return NextResponse.json({ error: "Error updating ticket" }, { status: 500 })
  }
}

      