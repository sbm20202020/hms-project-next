import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  const patients = await prisma.patient.count();
  return NextResponse.json(patients);
}