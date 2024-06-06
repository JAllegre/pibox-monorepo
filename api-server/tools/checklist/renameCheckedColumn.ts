import { Database } from "sqlite3";
import { DB_TABLE_CHECKLIST_ITEMS } from "../../src/features/checklist/checklistConstants";
import { connectDb, endDb } from "../../src/lib/db";
import { handleResult } from "./utils";

function addColumn(db: Database): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      db.run(
        `ALTER TABLE ${DB_TABLE_CHECKLIST_ITEMS} ADD checked INTEGER default 0;`,
        handleResult(`Table ${DB_TABLE_CHECKLIST_ITEMS} ALTERED ADDED`, resolve),
      );
    } catch (error) {
      reject(error);
    }
  });
}

function updateRows(db: Database): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      db.run(
        `UPDATE ${DB_TABLE_CHECKLIST_ITEMS} SET checked = (
            CASE WHEN checkStatus > 0 THEN 1
              WHEN checkStatus = 0 THEN 0 
            END
            );`,
        handleResult(`Table ${DB_TABLE_CHECKLIST_ITEMS} UPDATED`, resolve),
      );
    } catch (error) {
      reject(error);
    }
  });
}

function dropColumn(db: Database): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      db.run(
        `ALTER TABLE ${DB_TABLE_CHECKLIST_ITEMS} DROP checkStatus`,
        handleResult(`Table ${DB_TABLE_CHECKLIST_ITEMS} ALTERED DROPPED`, resolve),
      );
    } catch (error) {
      reject(error);
    }
  });
}

(async function () {
  try {
    const db = await connectDb(true);
    await addColumn(db);
    await updateRows(db);
    await dropColumn(db);
    endDb(db);
  } catch (error) {
    console.error("FINAL CATCH Error", error);
  }
})();
