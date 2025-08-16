import { PrismaClient } from "@/generated/prisma"
import { withAccelerate } from '@prisma/extension-accelerate'
// Utilisation d'un singleton pour éviter la saturation du pool de connexions Prisma
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

const prisma = globalForPrisma.prisma || new PrismaClient()

prisma.$extends(withAccelerate())

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma