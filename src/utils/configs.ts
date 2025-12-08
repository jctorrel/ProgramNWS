// src/utils/prompts.ts
import fs from "fs";
import path from "path";
import { logger } from "./logger";

const PROJECT_ROOT = process.cwd();

export default function loadConfig(name: string): any {
    let config: any = {};

    try {
        const raw = fs.readFileSync(
            path.join(PROJECT_ROOT, "config", name),
            "utf8"
        );
        const parsed = JSON.parse(raw);
        config = { ...config, ...parsed };
        logger.info(`✅ Fichier de config chargé : ${name}`);
    } catch (err) {
        logger.warn(
            `⚠️ Impossible de charger ${name}, utilisation des valeurs par défaut.`
        );
    }

    return config;
}