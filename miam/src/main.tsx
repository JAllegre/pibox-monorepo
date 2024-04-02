import React from "react";
import ReactDOM from "react-dom/client";
import "./main.css";
import AppRouterProvider from "./routes/AppRouter";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppRouterProvider />
  </React.StrictMode>
);
