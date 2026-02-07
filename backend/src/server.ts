import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { ClientToServerEvents, ServerToClientEvents } from "./socket/events";
import { setupSocketHandlers } from "./socket/handlers";

const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO with CORS configuration
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:5173"], // React dev servers
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (_req, res) => {
    res.json({ status: "OK", message: "Kanban Backend Server is running" });
});

// Setup Socket.IO connection handlers
io.on("connection", (socket) => {
    setupSocketHandlers(io, socket);
});

export { app, httpServer, io };
