import { createServer } from "http";
import fs from "node:fs";

import buildApp from "./src/app";
import { logger } from "./src/utils/logger";
import getEnv from "./src/utils/env";
import { shutdown } from "./src/utils/shutdown";

const port = Number(getEnv("PORT", "4000"));

async function main() {

    // Start
    const app = await buildApp();
    const server = createServer(app);

    // Signaux
    process.on("SIGINT", () => shutdown("SIGINT", server));
    process.on("SIGTERM", () => shutdown("SIGTERM", server));
    process.on("uncaughtException", (e) => {
        logger.error("uncaughtException", e);
        shutdown("uncaughtException", server);
    });
    process.on("unhandledRejection", (e) => {
        logger.error("unhandledRejection", e as any);
        shutdown("unhandledRejection", server);
    });

    // Listen
    server.listen(port, () => {
        logger.info(`API démarrée sur ${getEnv("FRONTEND_ORIGIN")}`);
    });
}

main().catch((err) => {
    console.error("❌ Erreur au démarrage du server :", err);
    process.exit(1);
});