import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import userRoutes from "./routes/userRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import groupMembersRoutes from "./routes/groupMembersRoutes.js";
import groupCodesRoutes from "./routes/groupCodesRoutes.js";
import openingRoutes from "./routes/openingRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import statisticsRoutes from "./routes/statisticsRoutes.js";
import sequelize from "./config/database.js";

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  methods: "GET,POST,PUT,DELETE,PATCH",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https:"],
      styleSrc: ["'self'", "https:", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'", "https:"],
      fontSrc: ["'self'", "https:"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, "public");

app.use(express.static(publicPath));

app.use("/api", userRoutes);
app.use("/api", groupRoutes);
app.use("/api", groupMembersRoutes);
app.use("/api", groupCodesRoutes);
app.use("/api", openingRoutes);
app.use("/api", authRoutes);
app.use("/api", statisticsRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

sequelize
  .sync()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log("Database connection failed:", error));
