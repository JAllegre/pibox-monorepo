import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import socketManager from "./utils/socketManager";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

socketManager.init();
