// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

// Crea un alias de tipo seguro sobre globalThis
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
