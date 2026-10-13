const app = require("./src/app");
const env = require("./src/config/env");
const { connectDatabase } = require("./src/config/database");

async function startServer() {
    await connectDatabase();

    const server = app.listen(env.PORT, () => {
        console.log(`Backend running on http://localhost:${env.PORT}`);
    });

    const shutdown = async (signal) => {
        console.log(`${signal} received. Shutting down...`);
        server.close(async () => {
            const mongoose = require("mongoose");
            await mongoose.disconnect();
            process.exit(0);
        });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
}

startServer().catch((error) => {
    console.error("Failed to start backend:", error.message);
    process.exit(1);
});