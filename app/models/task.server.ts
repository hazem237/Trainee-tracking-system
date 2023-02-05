import { PrismaClient } from "@prisma/client";
import { getUserId } from "./user.server";

const prisma = new PrismaClient();

export async function getTasks(request: Request) {
  return prisma.task.findMany({
    where: { TraineeId: await getUserId(request) },
    orderBy: { createdAt: "desc" },
  });
}

export async function getColumns() {
  return prisma.columns.findMany();
}

export async function editTaskCoulmn(taskId: string, coulmnId: string) {
  return prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      ColumnsId: coulmnId,
    },
  });
}
export async function createTask(task) {
  return prisma.task.create({ data: task });
}

export async function getRequiredCoulmn(coulmnId) {
  return prisma.columns.findUnique({
    where: { id: coulmnId },
  });
}
export async function getSingleTask(id: string) {
  return prisma.task.findUnique({
    where: { id: id },
    select: {
      title: true,
      content: true,
      ColumnsId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
export async function getSingleColumn(id: string) {
  return prisma.columns.findUnique({
    where: { id: id },
  });
}

export async function deleteTask(id) {
  return prisma.task.delete({
    where: { id: id },
  });
}

export async function updateTask(id, data) {
  return prisma.task.update({
    where: {
      id: id,
    },
    data: data,
  });
}

export async function getTasksBasedTraineeId(traineeId: string) {
  return prisma.task.findMany({
    where: { TraineeId: traineeId },
  });
}
