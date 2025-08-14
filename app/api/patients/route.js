import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const dataPath = path.join(process.cwd(), "data", "patients.json")

export async function GET() {
  try {
    const fileContents = fs.readFileSync(dataPath, "utf8")
    const patients = JSON.parse(fileContents)
    return NextResponse.json(patients)
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la lecture des données" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const newPatient = await request.json()
    const fileContents = fs.readFileSync(dataPath, "utf8")
    const patients = JSON.parse(fileContents)

    const maxId = Math.max(...patients.map((p) => p.id), 0)
    newPatient.id = maxId + 1
    newPatient.numeroPatient = `P${String(newPatient.id).padStart(3, "0")}`

    patients.push(newPatient)
    fs.writeFileSync(dataPath, JSON.stringify(patients, null, 2))

    return NextResponse.json(newPatient, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la création du patient" }, { status: 500 })
  }
}
