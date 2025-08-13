import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const dataPath = path.join(process.cwd(), "data", "soins.json")

export async function GET() {
  try {
    const fileContents = fs.readFileSync(dataPath, "utf8")
    const soins = JSON.parse(fileContents)
    return NextResponse.json(soins)
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la lecture des soins" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const newSoin = await request.json()
    const fileContents = fs.readFileSync(dataPath, "utf8")
    const soins = JSON.parse(fileContents)

    const maxId = Math.max(...soins.map((s) => s.id), 0)
    newSoin.id = maxId + 1

    soins.push(newSoin)
    fs.writeFileSync(dataPath, JSON.stringify(soins, null, 2))

    return NextResponse.json(newSoin, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la création du soin" }, { status: 500 })
  }
}
