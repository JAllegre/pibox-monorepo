import http from "http";
import { Server } from "socket.io";
import { WS_API_PATH } from "../../../common/constants";

let ioServers: Record<string, Server> = {};

export function emitToWebSocketClient(nameSpace: string, eventName: string) {
  if (ioServers[nameSpace]) {
    ioServers[nameSpace].of(nameSpace).emit(eventName);
  }
}

export function initWebSocketServer(server: http.Server, nameSpace: string) {
  ioServers[nameSpace] = new Server(server, {
    path: WS_API_PATH,
    cors: {
      origin: "*", // TODO: Set correct cors
    },
  });

  // All namespace log
  ioServers[nameSpace].of(nameSpace).on("connection", (socket) => {
    console.info("socketManager.initWebSocketServer", "New connection", socket.nsp.name);
  });
}
