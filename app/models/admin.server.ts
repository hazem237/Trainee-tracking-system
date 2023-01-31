import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export async function createAdmin(data:{username:string , passwordHash:string , role:string}) {
    return prisma.admin.create({
        data:{
            username:data.username ,
            passwordHash:data.passwordHash,
            role:data.role
        }
    })
}