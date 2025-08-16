import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PUT(request, { params }) {
    try {
      console.log("params---------------------->", params)
      const { id } = await params; // <- il faut await
      const { serviceId, statut } = await request.json();
  
      const result = await prisma.dossierPatient.update({
        where: { id: Number(id) },
        data: { serviceId, statut },
      });

      const updatedPatient = await prisma.patient.update({
        where: { id: result.patientId },
        data: { derniereVisite: result.dateCreation },
      });
  
      return NextResponse.json(result);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du dossier :", error);
      return NextResponse.json(
        { error: "Erreur lors de la mise à jour du dossier" },
        { status: 500 }
      );
    }
  }