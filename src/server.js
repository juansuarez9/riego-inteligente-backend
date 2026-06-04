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

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {

  res.send(
    "Backend IoT funcionando"
  );

});

app.get(
  "/api/data/latest",
  (req, res) => {

    res.json({
      success: true,
      data: getLatestData()
    });

  }
);

app.get(
  "/api/data/history",
  (req, res) => {

    const limit =
      parseInt(
        req.query.limit || "500"
      );

    res.json({
      success: true,
      data: getHistoryData(limit)
    });

  }
);

const server =
  http.createServer(app);

const io = new Server(server, {

  cors: {
    origin: "*"
  }

});

initSocket(io);

initMqtt(io);

server.listen(
  process.env.PORT,
  () => {

    console.log(
      `Servidor iniciado en puerto ${process.env.PORT}`
    );

  }
);