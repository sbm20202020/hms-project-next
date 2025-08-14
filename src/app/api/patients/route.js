import { NextResponse } from "next/server"

let patients = []

export async function GET() {
  return NextResponse.json(patients)
}

export async function POST(request) {
  try {
    const newPatient = await request.json()

    const maxId = patients.length > 0 ? Math.max(...patients.map((p) => p.id || 0)) : 0
    newPatient.id = maxId + 1
    newPatient.numeroPatient = `P${String(newPatient.id).padStart(3, "0")}`

    patients.push(newPatient)
    return NextResponse.json(newPatient, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la création du patient" }, { status: 500 })
  }
}
