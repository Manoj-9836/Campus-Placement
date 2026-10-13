const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const env = require("./config/env");
const authRoutes = require("./modules/auth/auth.routes");
const { notFoundHandler, errorHandler } = require("./middleware/error");

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGINS, credentials: true }));
app.use(express.json({ limit: "10kb" }));

const healthCheck = (req, res) => res.status(200).json({ status: "ok" });
app.get("/health", healthCheck);
app.get("/api/v1/health", healthCheck);
app.use("/api/v1/auth", authRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
