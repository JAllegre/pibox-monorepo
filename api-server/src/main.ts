import bodyParser from "body-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import checklistRouter from "./features/checklist/checklistRouter";
import miamRouter from "./features/miam/miamRouter";

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
app.use("/api/miam/", miamRouter);
app.use("/api/checklists", checklistRouter);

// ERROR MANAGEMENT
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "404 Not found" });
});

app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
  console.error("Got an unexpected error", err);
  res.status(500).json({ message: "500 Internal Server Error" });
});

// START SERVER
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// KILL SIGNALS
function shutDown() {
  console.log("Received kill signal, shutting down gracefully");

  server.close(() => {
    console.log("Closed out remaining connections");
    process.exit(0);
  });

  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, 4000);
}

process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);
