import { io } from "socket.io-client";
import { CHECKLIST_WS_EVENT_REFRESHED, CHECKLIST_WS_NAMESPACE } from "../../../common/checklistConstants";
import { WS_API_PATH } from "../../../common/constants";
import eventMgr, { EventType } from "./eventMgr";

function init() {
  console.log("socketManager.init - Connecting to", import.meta.env.VITE_API_HOST, WS_API_PATH, CHECKLIST_WS_NAMESPACE);
  const socket = io(`${import.meta.env.VITE_API_HOST}${CHECKLIST_WS_NAMESPACE}`, { path: WS_API_PATH });

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
