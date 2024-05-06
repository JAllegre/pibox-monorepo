import { Database } from "sqlite3";
import { DB_TABLE_CHECKLIST_ITEMS } from "../../src/features/checklist/checklistConstants";
import { connectDb, endDb } from "../../src/lib/db";
import { handleResult } from "./utils";

function addColumn(db: Database): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      db.run(
        `ALTER TABLE ${DB_TABLE_CHECKLIST_ITEMS} ADD sortOrder INTEGER default 0;`,
        handleResult(`Table ${DB_TABLE_CHECKLIST_ITEMS} ALTERED`, resolve),
      );
    } catch (error) {
      reject(error);
    }
  });
}

interface ChecklistListRow {
  id: number;
  title: string;
  checkStatus: number;
  sortOrder: number;
  categoryId: number;
}

export async function getAllChecklistItems(db: Database): Promise<ChecklistListRow[]> {
  return new Promise((resolve, reject) => {
    try {
      db.all<ChecklistListRow>(
        `SELECT * FROM ${DB_TABLE_CHECKLIST_ITEMS};`,

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
function updateOrderValue(db: Database, rowId: number, categoryId: number): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      db.run(
        `UPDATE ${DB_TABLE_CHECKLIST_ITEMS} SET sortOrder = ? WHERE id = ?;`,
        [categoryId * 100000 + rowId * 10, rowId],
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
    const rows = await getAllChecklistItems(db);
    // Update each row with the id value multiplied by 100
    for (const row of rows) {
      await updateOrderValue(db, row.id, row.categoryId);
    }
    endDb(db);
  } catch (error) {
    console.error("FINAL CATCH Error", error);
  }
})();
