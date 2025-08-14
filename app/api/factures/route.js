import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const dataPath = path.join(process.cwd(), "data", "factures.json")

export async function GET() {
  try {
    const fileContents = fs.readFileSync(dataPath, "utf8")
    const factures = JSON.parse(fileContents)
    return NextResponse.json(factures)
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la lecture des factures" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const newFacture = await request.json()
    const fileContents = fs.readFileSync(dataPath, "utf8")
    const factures = JSON.parse(fileContents)

    const maxId = Math.max(...factures.map((f) => f.id), 0)
    newFacture.id = maxId + 1
    newFacture.numeroFacture = `F2024-${String(newFacture.id).padStart(3, "0")}`

    factures.push(newFacture)
    fs.writeFileSync(dataPath, JSON.stringify(factures, null, 2))

    return NextResponse.json(newFacture, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la création de la facture" }, { status: 500 })
  }
}
