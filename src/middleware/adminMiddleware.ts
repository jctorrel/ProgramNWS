// src/middleware/adminMiddleware.ts
import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";
import getEnv from "../utils/env";

const adminEmails = getEnv("ADMIN_EMAILS")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean);

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  const user = req.user as any;

  if (!user || !user.email) {
    return res.status(401).json({ error: "not_authenticated" });
  }

  if (!adminEmails.includes(user.email)) {
    return res.status(403).json({ error: "not_authorized" });
  }

  return next();
}
