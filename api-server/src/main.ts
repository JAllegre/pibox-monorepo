import bodyParser from "body-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import http from "http";
import morgan from "morgan";
import { CHECKLIST_WS_NAMESPACE } from "../../common/checklistConstants";
import { API_PATH } from "../../common/constants";
import checklistRouter from "./features/checklist/checklistRouter";
import miamRouter from "./features/miam/miamRouter";
import AppError from "./lib/AppError";
import { initWebSocketServer } from "./lib/socketManager";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(morgan("combined"));

app.use(bodyParser.json({ limit: "50mb" }));

app.use(cors());

// HEALTH CHECK
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ message: "OK" });
});

// ROUTERS
app.use([`${API_PATH}/miam`, "/miam"], miamRouter);
app.use([`${API_PATH}/checklists`, "/checklists"], checklistRouter);

// ERROR MANAGEMENT
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "404 Not found" });
});

app.use(function (err: Error | AppError, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  const httpCode = err instanceof AppError ? err.httpCode || 500 : 500;
  res.status(httpCode).json({ message: http.STATUS_CODES[httpCode] });
});

// START SERVER
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

initWebSocketServer(server, CHECKLIST_WS_NAMESPACE);

// KILL SIGNALS
function shutDown() {
  console.log("Received kill signal, shutting down gracefully");

  server.close(() => {
    console.log("Closed out remaining connections");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Could not close connections in time, forcefully shutting down");
    process.exit(1);
  }, 4000);
}

process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);
