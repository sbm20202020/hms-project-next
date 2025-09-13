import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'

import prisma from "@/lib/prisma";


export async function POST(request) {
  try {
    const { name, email, password, organization, position, telephone, establishmentType, isDemoRequest } = await request.json()

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

    console.log("............................................. isDemoRequest", isDemoRequest)
    console.log("............................................. Email", email)
    
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })
    console.log("............................................. existingUser", existingUser)

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

    const organisation = await prisma.organisation.create({
      data: {
        nom: "",
        description: "",
      },
    })
    let role;
    let permissions;
    let newPermissions;

    if (organisation) {
      role = await prisma.role.create({
        data: {
          nom: "Administrateur",
          description: "Administrateur",
          organisationId: organisation.id,
        },
      })

      console.log("role", role)
  
      permissions = await prisma.permission.findMany({
        where: {
          organisationId: 1,
        },
      })
  
      newPermissions = await prisma.permission.createMany({
        data: permissions.map((permission) => ({
          name: permission.name,
          fonctionId: permission.fonctionId,
          organisationId: organisation.id,
          canCreate: permission.canCreate,
          canRead: permission.canRead,
          canUpdate: permission.canUpdate,
          canDelete: permission.canDelete,
        })),
      })
    }


    if (isDemoRequest || organisation.id || role.id || newPermissions.length > 0) {

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
          organisationId: organisation.id,
        },
      })

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          contactId: contact.id,
          organisationId: organisation.id,
          roleId: role.id,
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
          organisationId: organisation.id,
        },
      })
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          contactId: contact.id,
          organisationId: organisation.id,
          roleId: role.id,
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