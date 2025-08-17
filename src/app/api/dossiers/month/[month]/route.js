import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
    const { month } = await params;
    
    const monthNumber = parseInt(month, 10) + 1; // s'assure que c'est un nombre
    if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
        return NextResponse.json({ error: "Mois invalide" }, { status: 400 });
    }
    
    const year = new Date().getFullYear();
    const debutMoisUTC = new Date(Date.UTC(year, monthNumber - 1, 1));
    const debutMoisSuivantUTC = new Date(Date.UTC(year, monthNumber, 1));
    
    const dossiers = await prisma.dossierPatient.findMany({
      where: {
        dateCreation: {
          gte: debutMoisUTC,
          lt: debutMoisSuivantUTC,
        },
      },
    });
    return NextResponse.json(dossiers);
}