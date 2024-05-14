import {PrismaClient} from '@prisma/client'
import {global} from "styled-jsx/css";
declare global {
    let cachedPrisma: PrismaClient;
}

let prisma: PrismaClient
if(process.env.NODE_ENV === 'production'){
    prisma = new PrismaClient()
}else{
    // @ts-ignore
    if(!global.cachedPrisma) {
        // @ts-ignore
        global.cachedPrisma = new PrismaClient()
    }
    // @ts-ignore
    prisma = global.cachedPrisma
}

export const db = prisma