import express from "express";
import session from "express-session";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes";
import quizRoutes from "./routes/quizRoutes";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(helmet());
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: true,
  })
);

// Ensure routes are correctly set up
app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);

export default app;
