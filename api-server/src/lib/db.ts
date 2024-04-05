import sqlite3 from "sqlite3";
const sqlite3v = sqlite3.verbose();

import { DB_FILENAME } from "./constants";

export async function connectDb(create?: boolean): Promise<sqlite3.Database> {
  return new Promise((resolve, reject) => {
    let openOptions = sqlite3v.OPEN_READWRITE;
    if (create) {
      openOptions |= sqlite3v.OPEN_CREATE;
    }

    const db = new sqlite3v.Database(DB_FILENAME, openOptions, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(db);
      console.log("Connected to DB", DB_FILENAME);
    });
  });
}

export async function closeDb(db: sqlite3.Database): Promise<sqlite3.Database> {
  return new Promise((resolve) => {
    db.close((err) => {
      resolve(db);
      console.log(
        "Closed DB",
        DB_FILENAME,
        `${err ? "with error: " + err.message : ""}`
      );
    });
  });
}

export async function endDb(
  dbToClose?: sqlite3.Database,
  stmtToFinalize?: sqlite3.Statement
) {
  if (stmtToFinalize) {
    stmtToFinalize.finalize();
    stmtToFinalize = undefined;
  }

  if (dbToClose) {
    await closeDb(dbToClose);
    dbToClose = undefined;
  }
}
