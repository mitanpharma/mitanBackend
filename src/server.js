import express from "express";
import cookieParser from "cookie-parser";
import authFunctionality from "./routes/user.routes.js";
import cors from "cors";

const app = express();

// CORS configuration - supports both local development and production
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Health check routes
app.get("/", (req, res) => {
  res.json({ 
    message: "Mitan Pharma API is running",
    status: "ok",
    timestamp: new Date().toISOString()
  });
});

app.get("/health_Check", (req, res) => {
  res.json({ status: "ok" });
});

// API routes
app.use("/User", authFunctionality);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal server Error",
    errors: err.errors || [],
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default app;