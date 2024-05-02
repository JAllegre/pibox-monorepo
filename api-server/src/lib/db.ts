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
      console.log("Closed DB", DB_FILENAME, `${err ? "with error: " + err.message : ""}`);
    });
  });
}

export async function endDb(dbToClose?: sqlite3.Database, stmtToFinalize?: sqlite3.Statement) {
  if (stmtToFinalize) {
    stmtToFinalize.finalize();
    stmtToFinalize = undefined;
  }

  if (dbToClose) {
    await closeDb(dbToClose);
    dbToClose = undefined;
  }
}

export function checkId(id: number) {
  if (!id || isNaN(id)) {
    throw new Error("Missing id");
  }
}

export function buildUpdateQueryParams(id: number, input: Object) {
  const queryKeys: string[] = [];
  const queryValues: any[] = [];

  Object.entries(input).forEach(([key, value]) => {
    if (value == null) {
      return;
    }
    queryKeys.push(`${key}=?`);
    queryValues.push(value);
  });

  if (queryKeys.length <= 0) {
    throw new Error("No values to update");
  }
  // Always add the id at the end
  checkId(id);
  queryValues.push(id);
  return { querySet: queryKeys.join(","), queryValues };
}

export function buildAddQueryParams(input: Object) {
  const queryKeys: string[] = [];
  const queryValues: any[] = [];

  Object.entries(input).forEach(([key, value]) => {
    if (value == null) {
      return;
    }
    queryKeys.push(`${key}`);
    queryValues.push(value);
  });

  if (queryKeys.length <= 0) {
    throw new Error("No values to add");
  }

  return { queryKeys, queryValues };
}
