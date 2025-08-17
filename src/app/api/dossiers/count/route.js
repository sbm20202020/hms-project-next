import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getPairMonth } from "@/utils/helpers";

export async function GET() {
    const count = await prisma.dossierPatient.count()
    const date = new Date()
    const currentMonth = ((date.getMonth())+12 % 12)+1; // 1 = Janvier, 12 = Décembre

    const currentMonthPair = getPairMonth(currentMonth);
    const pastMonthPair= getPairMonth(Number(currentMonth)-1);

    const countDossiersThisMonth = await prisma.dossierPatient.count({
        where: {
          dateCreation: {
            gte: currentMonthPair.startMonthUTC,
            lt: currentMonthPair.endMonthUTC,
          },
        },
      });

    const countDossiersPastMonth = await prisma.dossierPatient.count({
        where: {
          dateCreation: {
            gte: pastMonthPair.startMonthUTC,
            lt: pastMonthPair.endMonthUTC,
          },
        },
      });

    return NextResponse.json({count,countDossiersThisMonth,countDossiersPastMonth})
}