import { PrismaClient } from "@prisma/client"
import { createCookieSessionStorage, redirect } from "@remix-run/node";


const prisma = new PrismaClient()

export async function createUser(user:object)
{
    return prisma.trainee.create({
        data:user
    })
}
export async function login(username:string , password:string) {
    const user = await prisma.trainee.findUnique({
      where: { username },
    });
    if (!user) return null;
  
    const isCorrectPassword = password===user.passwordHash
    if (!isCorrectPassword) return null;
  
    return { id: user.id, username:user.username };
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

export async function createUserSession(
  userId: string,
  redirectTo: string
) {
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
      const searchParams = new URLSearchParams([
        ["redirectTo", redirectTo],
      ]);
      throw redirect(`/login?${searchParams}`);
    }
    return userId;
  }
  export async function getUser(request: Request) {
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
  
  export async function logout(request: Request) {
    const session = await getUserSession(request);
    return redirect("/login", {
      headers: {
        "Set-Cookie": await storage.destroySession(session),
      },
    });
  }