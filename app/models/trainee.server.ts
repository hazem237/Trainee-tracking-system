import { Mentor, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getTrainees() {
  return prisma.trainee.findMany({
    select: {
      username: true,
      Mentor: true,
      id: true,
    },
  });
}

export async function getTraineeBasedName(traineeName: string) {
  return prisma.trainee.findUnique({
    where: { username: traineeName },
  });
}
export async function setTraineeMentor(id: string, mentorId: string) {
  return prisma.trainee.update({
    data: { MentorId: mentorId },
    where: {
      id: id,
    },
  });
}
