// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import getEnv from "../utils/env";
import { logger } from "../utils/logger";

const JWT_SECRET = getEnv("JWT_SECRET");

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET manquant dans le .env");
}

export interface AuthRequest extends Request {
  user?: JwtPayload | string;
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ error: "Invalid Authorization header" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "token_expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
}
