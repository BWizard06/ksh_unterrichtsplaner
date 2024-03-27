import { PrismaClient } from '@prisma/client';

const isDev = process.env.NODE_ENV === 'development';


let prisma;

if (isDev) {
    global.prisma = global.prisma || new PrismaClient();
    prisma = global.prisma;
} else {
    prisma = new PrismaClient();
}

export default prisma;
