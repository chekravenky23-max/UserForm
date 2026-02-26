require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const apiRoutes = require("./routes/api");

const app = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 5000;

/*
=====================================
 CORS CONFIGURATION (FIXED)
=====================================
*/

const allowedOrigins = [
    "https://user-form-sand-sigma.vercel.app", // Production frontend
    "http://localhost:5173" // Local development (Vite)
];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like Postman or curl)
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

// Handle preflight requests
app.options("*", cors());

app.use(express.json());

/*
=====================================
 ROUTES
=====================================
*/

app.use("/api", apiRoutes);

// Root Endpoint
app.get("/", (req, res) => {
    res.json({ message: "User Collection API is running smoothly 🚀" });
});

// Health Check Endpoint
app.get("/health", async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;

        res.status(200).json({
            status: "success",
            message: "Server is healthy",
            database: "Connected",
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Server is running but database connection failed",
            database: "Failed",
        });
    }
});

/*
=====================================
 START SERVER
=====================================
*/

app.listen(PORT, "0.0.0.0", async () => {
    console.log(`🚀 Server is running on port ${PORT}`);

    try {
        await prisma.$connect();
        console.log("✅ Database connected successfully.");
    } catch (error) {
        console.error("❌ Database connection failed.", error);
    }
});