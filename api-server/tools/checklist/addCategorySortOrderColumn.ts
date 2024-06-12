import { Database } from "sqlite3";
import { ChecklistCategory } from "../../../common/checklistTypes";
import { DB_TABLE_CHECKLIST_CATEGORIES } from "../../src/features/checklist/checklistConstants";
import { connectDb, endDb } from "../../src/lib/db";
import { handleResult } from "./utils";

function addColumn(db: Database): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      db.run(
        `ALTER TABLE ${DB_TABLE_CHECKLIST_CATEGORIES} ADD sortOrder INTEGER default 0;`,
        handleResult(`Table ${DB_TABLE_CHECKLIST_CATEGORIES} ALTERED`, resolve),
      );
    } catch (error) {
      reject(error);
    }
  });
}

export async function getAllChecklistCategories(db: Database): Promise<ChecklistCategory[]> {
  return new Promise((resolve, reject) => {
    try {
      db.all<ChecklistCategory>(
        `SELECT * FROM ${DB_TABLE_CHECKLIST_CATEGORIES};`,

        (err, rows) => {
          if (err) {
            return reject(err);
          }
          console.info("GET ", rows?.length, "rows");
          resolve(rows);
        },
      );
    } catch (error) {
      reject(error);
    }
  });
}

// Update the sortOrder value of a row by multiplying the id by 100
function updateOrderValue(db: Database, rowId: number): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      db.run(
        `UPDATE ${DB_TABLE_CHECKLIST_CATEGORIES} SET sortOrder = ? WHERE id = ?;`,
        [rowId * 10000, rowId],
        handleResult(`Row ${rowId} updated`, resolve),
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
    const rows = await getAllChecklistCategories(db);
    // Update each row with the id value multiplied by 100
    for (const row of rows) {
      await updateOrderValue(db, row.id);
    }
    endDb(db);
  } catch (error) {
    console.error("FINAL CATCH Error", error);
  }
})();
