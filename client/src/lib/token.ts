import jwt, { JwtPayload } from "jsonwebtoken";

const secretKey = "your-secret-key";

interface CustomJwtPayload extends JwtPayload {
  userId: string;
}

export function generateToken(userId: string): string {
  const payload: CustomJwtPayload = { userId };
  const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
  return token;
}

export function verifyToken(token: string): CustomJwtPayload | null {
  try {
    const decoded = jwt.verify(token, secretKey) as CustomJwtPayload;
    return decoded;
  } catch (err) {
    console.error("JWT verification error:", err);
    return null;
  }
}
