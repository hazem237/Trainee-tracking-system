import { Admin, Mentor, PrismaClient, Trainee } from "@prisma/client";
import { createCookieSessionStorage, redirect } from "@remix-run/node";
export type userType = Admin | Trainee | Mentor | null;

const prisma = new PrismaClient();

export async function createUser(user: {
  username: string;
  passwordHash: string;
  role: string;
}) {
  return prisma.trainee.create({
    data: {
      username: user.username,
      passwordHash: user.passwordHash,
      role: user.role,
    },
  });
}
export async function login(username: string, password: string) {
  let user: userType = await prisma.trainee.findUnique({
    where: { username },
  });
  if (!user) {
    user = await prisma.admin.findUnique({
      where: { username },
    });
    if (!user) {
      user = await prisma.mentor.findUnique({
        where: { username },
      });
      if (!user) {
        return null;
      }
    }
  }

  const isCorrectPassword = password === user.passwordHash;
  if (!isCorrectPassword) return " Incorrect password !";

  return user;
}
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}
function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}
export async function getTrainee(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }

  try {
    const user = await prisma.trainee.findUnique({
      where: { id: userId },
      select: { id: true, username: true },
    });
    return user;
  } catch {
    throw logout(request);
  }
}
export async function getAdmin(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }

  try {
    const user = await prisma.admin.findUnique({
      where: { id: userId },
      select: { id: true, username: true },
    });
    return user;
  } catch {
    throw logout(request);
  }
}
export async function getMentor(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }

  try {
    const user = await prisma.mentor.findUnique({
      where: { id: userId },
      select: { id: true, username: true },
    });
    return user;
  } catch {
    throw logout(request);
  }
}
export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}
