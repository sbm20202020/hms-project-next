import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'

import prisma from "@/lib/prisma";


export async function POST(request) {
  try {
    const { name, email, password, organization, position, telephone, establishmentType, isDemoRequest } = await request.json()

    // console.log({
    //   name,
    //   email,
    //   password,
    //   organization,
    //   position,
    //   telephone,
    //   establishmentType,
    //   isDemoRequest
    // })

    if (!email || !password || !name) {
      return NextResponse.json(
        { 
          error: 'Les champs (nom, email, mot de passe) sont requis',
          ok:false,
          trueStatus:400
         },
        { status: 200 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { 
          error: 'Un utilisateur avec cet email existe déjà',
          ok:false,
          trueStatus:400
         },
        { status: 200 }
      )
    }

    const hashedPassword = await hash(password, 12)

    if (isDemoRequest) {
      const contact = await prisma.contact.create({
        data: {
          nom: name.split(" ")[0],
          prenom: name.split(" ")[1],
          email,
          telephone,
          organization,
          position,
          establishmentType,
          isDemoRequest,
        },
      })

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          contactId: contact.id,
        },
      })

      return NextResponse.json(
        { 
          message: 'Utilisateur créé avec succès',
          ok:true
        },
        { status: 201 }
      )
    } else {

      const contact = await prisma.contact.create({
        data: {
          nom: name.split(" ")[0],
          prenom: name.split(" ")[1],
          email,
          telephone,
          organization,
          position,
          establishmentType,
          isDemoRequest,
        },
      })
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          contactId: contact.id,
        },
      })

      return NextResponse.json(
        { 
          message: 'Utilisateur créé avec succès',
          ok:true
        },
        { status: 201 }
      )
    }
  } catch (error) {
    console.error('Erreur inscription:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur',
        ok:false,
        trueStatus:500
       },
      { status: 200 }
    )
  }
}