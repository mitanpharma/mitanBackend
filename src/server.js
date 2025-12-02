import express from "express";
import cookieParser from "cookie-parser";
import authFunctionality from "./routes/user.routes.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/User", authFunctionality);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 402).json({
    message: err.message || "Internal server Error",
    errors: err.errors || [],
  });
});

export default app;
