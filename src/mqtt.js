const mqtt = require("mqtt");

let latestData = null;

let historyData = [];

function initMqtt(io) {

  const client = mqtt.connect(
    `mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`
  );

  client.on("connect", () => {

    console.log("MQTT conectado");

    client.subscribe(
      process.env.MQTT_TOPIC
    );

    console.log(
      "Suscrito a:",
      process.env.MQTT_TOPIC
    );

  });

  client.on("message", (topic, message) => {

    try {

      const data = JSON.parse(
        message.toString()
      );

      const now = new Date();

      data.fecha = now.toLocaleDateString(
        "es-CO"
      );

      data.hora = now.toLocaleTimeString(
        "es-CO",
        {
          hour12: false
        }
      );

      data.timestamp =
        now.toISOString();

      latestData = data;

      historyData.push(data);

      if(historyData.length > 10000)
      {
        historyData.shift();
      }

      console.log("Dato recibido:");

      console.log(data);

      io.emit(
        "telemetry",
        data
      );

    }
    catch(error)
    {
      console.error(
        "Error procesando mensaje MQTT:",
        error
      );
    }

  });

  client.on("error", (err) => {

    console.error(
      "Error MQTT:",
      err
    );

  });

}

function getLatestData()
{
  return latestData;
}

function getHistoryData(limit = 500)
{
  return historyData.slice(-limit);
}

module.exports = {
  initMqtt,
  getLatestData,
  getHistoryData
};