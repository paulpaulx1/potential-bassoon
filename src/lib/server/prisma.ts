import { PrismaClient } from '@prisma/client';


declare global {
    var prisma: PrismaClient | undefined;
 }

 
const prisma = 
  global.prisma || 
  new PrismaClient({
    log: ['error'],
    datasourceUrl: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== 'production') {
  if (!global.prisma) {
    global.prisma = prisma;
  }
}

export { prisma };