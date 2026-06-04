function initSocket(io) {

    io.on("connection", (socket) => {
  
      console.log(
        "Dashboard conectado:",
        socket.id
      );
  
      socket.on("disconnect", () => {
  
        console.log(
          "Dashboard desconectado:",
          socket.id
        );
  
      });
  
    });
  
  }
  
  module.exports = initSocket;