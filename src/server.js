require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const initSocket = require("./socket");

const {
  initMqtt,
  getLatestData,
  getHistoryData
} = require("./mqtt");

const app = express();

const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000"
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend IoT funcionando");
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Servidor activo",
    time: new Date().toISOString()
  });
});

app.get("/api/data/latest", (req, res) => {
  res.json({
    success: true,
    data: getLatestData()
  });
});

app.get("/api/data/history", (req, res) => {
  const limit = parseInt(req.query.limit || "500");

  res.json({
    success: true,
    data: getHistoryData(limit)
  });
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

initSocket(io);
initMqtt(io);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});