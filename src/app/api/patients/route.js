import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { number } from "zod"

// let patients = []

export async function GET() {
  const patients = await prisma.patient.findMany()
  return NextResponse.json(patients)
}

export async function POST(request) {
  try {
    const newPatient = await request.json()

    // const maxId = patients.length > 0 ? Math.max(...patients.map((p) => p.id || 0)) : 0
    // newPatient.id = maxId + 1
    // newPatient.numeroPatient = `P${String(newPatient.id).padStart(3, "0")}`

    // patients.push(newPatient)
    console.log("newPatient------------", newPatient)

    // console.log(typeof(newPatient.dateNaissance))
    newPatient.age = Number(new Date().getFullYear() - new Date(newPatient.dateNaissance).getFullYear())
    newPatient.dateNaissance = new Date(newPatient.dateNaissance)
    await prisma.patient.create({
      data: newPatient,
    })
    
    return NextResponse.json(newPatient, { status: 201 })
  } catch (error) {
    console.log("error------------", error)
    return NextResponse.json({ error: "Erreur lors de la création du patient" }, { status: 500 })
  }
}
