import express from "express";
import cookieParser from "cookie-parser";
import authFunctionality from "./routes/user.routes.js";
import cors from "cors";

const app = express();

// ✅ Define allowed origins
const allowedOrigins = [
  "https://mitanpharma.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000"
];

// ✅ CORS configuration with proper origin validation
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman, or same-origin)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowed list
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"],
    maxAge: 86400, // 24 hours
  })
);

// Handle preflight requests explicitly
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ✅ Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Mitan Pharma Backend is running!",
    timestamp: new Date().toISOString(),
  });
});

// ✅ Test CORS endpoint
app.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CORS is working correctly!",
  });
});

// User authentication routes
app.use("/User", authFunctionality);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server Error",
    errors: err.errors || [],
  });
});

export default app;