import { NextResponse } from "next/server"

let factures = []

export async function GET() {
  return NextResponse.json(factures)
}

export async function POST(request) {
  try {
    const newFacture = await request.json()

    const maxId = factures.length > 0 ? Math.max(...factures.map((f) => f.id || 0)) : 0
    newFacture.id = maxId + 1
    newFacture.numeroFacture = `F2024-${String(newFacture.id).padStart(3, "0")}`

    factures.push(newFacture)
    return NextResponse.json(newFacture, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la création de la facture" }, { status: 500 })
  }
}
