// ./src/utils/shutdown.ts
import { logger } from "./logger";
import { closeMongo } from "../db/db";

export const shutdown = async (sig: string, server : any) => {
    logger.warn(`Reçu ${sig}, arrêt en cours...`);
    await closeMongo();

    server.close(() => {
        logger.info("Serveur arrêté proprement");
        process.exit(0);
    });
    setTimeout(() => process.exit(1), 5000).unref();
};