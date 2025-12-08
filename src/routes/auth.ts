// src/routes/auth.ts
import { Router, Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import getEnv from "../utils/env";

const router = Router();

const GOOGLE_CLIENT_ID = getEnv("GOOGLE_CLIENT_ID")
const JWT_SECRET = getEnv("JWT_SECRET");
const ALLOWED_DOMAIN = getEnv("ALLOWED_DOMAIN");

export default function createAuthRouter() {
    if (!GOOGLE_CLIENT_ID) {
        throw new Error("GOOGLE_CLIENT_ID manquant dans le .env");
    }
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET manquant dans le .env");
    }

    const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

    interface GooglePayload {
        email: string;
        email_verified: boolean;
        name?: string;
        picture?: string;
        hd?: string;
        sub: string;
    }

    router.post("/google", async (req: Request, res: Response) => {
        try {
            const { idToken } = req.body;

            if (!idToken) {
                return res.status(400).json({ error: "Missing idToken" });
            }

            // Vérification du token Google
            const ticket = await googleClient.verifyIdToken({
                idToken,
                audience: GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload() as unknown as GooglePayload | null;

            if (!payload) {
                return res.status(401).json({ error: "Invalid Google payload" });
            }

            const { email, email_verified, name, picture, hd, sub } = payload;

            if (!email || !email_verified) {
                return res.status(401).json({ error: "Email non vérifiée" });
            }

            // Vérification du domaine (via email)
            const domain = email.split("@")[1];
            if (domain !== ALLOWED_DOMAIN) {
                return res.status(403).json({ error: "Domaine non autorisé" });
            }

            // Création JWT
            const token = jwt.sign(
                {
                    sub, // identifiant Google
                    email,
                    name,
                    picture,
                },
                JWT_SECRET,
                { expiresIn: "1h" }
            );

            return res.json({
                token,
                user: {
                    email,
                    name,
                    picture,
                },
            });
        } catch (error) {
            console.error("Erreur /api/auth/google:", error);
            return res.status(401).json({ error: "Invalid token" });
        }
    });
    
    return router;
}
