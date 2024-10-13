import http from "http";
import { Server } from "socket.io";

let io: Server;
function emitToNamespace(nameSpace: string, eventName: string) {
  if (io) {
    io.of(nameSpace).emit(eventName);
  }
}

function init(server: http.Server) {
  io = new Server(server, {
    cors: {
      origin: "*", // TODO: Set correct cors
    },
  });

  // All namespace log
  io.of(/.*/).on("connection", (socket) => {
    console.info("socketManager.init", "New connection", socket.nsp.name);
  });
}

export default {
  init,
  emitToNamespace,
};
