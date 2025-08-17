import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { generateTicketCode } from "@/utils/helpers";

export async function PUT(request, { params }) {
  try {
    const { id } = await params; // <- il faut await
    const { serviceId, statut } = await request.json();

    const result = await prisma.dossierPatient.update({
      where: { id: Number(id) },
      data: { serviceId, statut },
      include: {
        patient: true,
        service: true,
      },
    });

    const updatedPatient = await prisma.patient.update({
      where: { id: result.patientId },
      data: { derniereVisite: result.dateCreation },
    });

    // const dossiersToday = await prisma.dossierPatient.findMany({
    //   where: {
    //     serviceId: result.serviceId,
    //     dateCreation: {
    //       gte: new Date(new Date().setHours(0, 0, 0, 0)),
    //       lt: new Date(new Date().setHours(23, 59, 59, 999)),
    //     },
    //   },
    // });

    // const lenDossier = dossiersToday.length;

    const codeServiceSliced = result.service.code.slice(0, 2)

    const lenTickets = await prisma.ticket.count({
      where: {
        code: {
          startsWith: codeServiceSliced,
        },
        dateCreation: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });


    const ticket = await prisma.ticket.create({
      data: {
        dossierPatientId: result.id,
        code: generateTicketCode(codeServiceSliced, lenTickets + 1),
      },
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