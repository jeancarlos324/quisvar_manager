import { PrismaClient } from '@prisma/client';

let prisma = new PrismaClient();

let db: PrismaClient | undefined;

if (process.env.NODE_ENV === 'production') {
  prisma.$connect();
  console.log('Database is under Production');
} else {
  console.log('Database is under Development');
  if (!db) {
    db = new PrismaClient();
    db.$connect();
  }
  prisma = db;
}

const prismaInit = () => prisma

export * from '@prisma/client';
export { prismaInit };
