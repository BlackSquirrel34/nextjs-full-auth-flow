import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

/* quick reference only
const testUser = {
  id: "1",
  email: "myemail@world.com",
  password: "12345678",
};
*/

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  const session = await encrypt({ userId, expiresAt }); // yields string: JWT token
console.log("## Session created: ", session);

  (await cookies()).set("session", session, {
    httpOnly: true, // not accessible from client
    secure: true,
    expires: expiresAt,
  });
}

export async function deleteSession() {
  (await cookies()).delete("session");
}

type SessionPayload = {
  userId: string;
  expiresAt: Date;
};

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()

    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
    } catch (error: unknown) {
    // Check if error is an instance of Error to access its properties
        if (error instanceof Error) {
      console.error("Failed to verify session:", error.message);
        } else {
      console.error("Failed to verify session: An unknown error occurred.", error);
        }
    }
}