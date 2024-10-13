import { io } from "socket.io-client";
import { CHECKLIST_WS_EVENT_REFRESHED, CHECKLIST_WS_NAMESPACE } from "../../../common/checklistConstants";
import eventMgr, { EventType } from "./eventMgr";

const wsUrl = `${import.meta.env.VITE_WS_HOST}${CHECKLIST_WS_NAMESPACE}`;

function init() {
  console.log("socketManager.init - Connecting to", wsUrl);
  const socket = io(wsUrl);

  console.log(wsUrl);
  socket.on("connect", () => {
    console.log("socketManager.init.on.connect - Connected to", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("socketManager.init.on.disconnect - Disconnected from", socket.id);
  });

  socket.on(CHECKLIST_WS_EVENT_REFRESHED, () => {
    console.log("socketManager.ts - got event", CHECKLIST_WS_EVENT_REFRESHED);
    eventMgr.dispatch(EventType.Refresh);
  });

  socket.on("error", (error) => {
    console.error("socketManager.init.on.error", error);
  });
}

export default {
  init,
};
