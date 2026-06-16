import { NextResponse } from "next/server"

let soins = []

export async function GET() {
  return NextResponse.json(soins)
}

export async function POST(request) {
  // const session = await getServerSession(authOptions);
  // const sessionOrganisationId = session.user.organisationId;

  try {
    const newSoin = await request.json()

    const maxId = soins.length > 0 ? Math.max(...soins.map((s) => s.id || 0)) : 0
    newSoin.id = maxId + 1

    soins.push(newSoin)
    return NextResponse.json(newSoin, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la création du soin" }, { status: 500 })
  }
}
