// import { PrismaClient } from "@prisma/client"
// // import { withAccelerate } from '@prisma/extension-accelerate'
// // Utilisation d'un singleton pour éviter la saturation du pool de connexions Prisma
// const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

// const prisma = globalForPrisma.prisma || new PrismaClient()

// // prisma.$extends(withAccelerate())

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export default prisma