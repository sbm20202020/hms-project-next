import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const dossiers = await prisma.dossierPatient.findMany()
  return NextResponse.json(dossiers)
}

export async function POST(request) {
  try {
    const newDossier = await request.json()
    console.log("newDossier------------", newDossier)
    await prisma.dossierPatient.create({
      data: newDossier,
    })
    return NextResponse.json(newDossier, { status: 201 })
  } catch (error) {
    console.log("error------------", error)
    return NextResponse.json({ error: "Erreur lors de la création du dossier" }, { status: 500 })
  }
}
