import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export async function createMentor(data:{username:string , passwordHash:string , role:string}) {
    return prisma.mentor.create({
        data:{
            username:data.username ,
            passwordHash:data.passwordHash,
            role:data.role
        }
    })
}