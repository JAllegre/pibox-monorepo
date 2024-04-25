// !!! Use TSX to run this script (npm i -g tsx && tsx scripts/deleteRow.ts )

import { Database } from "sqlite3";
import {
  DB_TABLE_CHECKLIST_CATEGORIES,
  DB_TABLE_CHECKLIST_ITEMS,
  DB_TABLE_CHECKLIST_LISTS,
} from "../../src/features/checklist/checklistConstants";
import { insertOneCategory, insertOneItem, insertOneList } from "../../src/features/checklist/checklistDb";
import { connectDb } from "../../src/lib/db";
import extractedData from "./extractFromSheet.json";

function handleResult(successMessage: string, resolve?: () => void) {
  return function (err: Error | null) {
    if (err) {
      throw err;
    }
    if (resolve) {
      resolve();
    }
    console.log(successMessage);
  };
}

function dropTables(db: Database): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      db.serialize(() => {
        db.run(
          `DROP TABLE IF EXISTS ${DB_TABLE_CHECKLIST_ITEMS};`,
          handleResult(`Table ${DB_TABLE_CHECKLIST_ITEMS} DROPPED`),
        )
          .run(
            `DROP TABLE IF EXISTS ${DB_TABLE_CHECKLIST_CATEGORIES};`,
            handleResult(`Table ${DB_TABLE_CHECKLIST_CATEGORIES} DROPPED`),
          )
          .run(
            `DROP TABLE IF EXISTS ${DB_TABLE_CHECKLIST_LISTS};`,
            handleResult(`Table ${DB_TABLE_CHECKLIST_LISTS} DROPPED`, resolve),
          );
      });
    } catch (error) {
      reject(error);
    }
  });
}

function createTables(db: Database): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      db.serialize(() => {
        db.run(
          `CREATE TABLE IF NOT EXISTS ${DB_TABLE_CHECKLIST_LISTS} (
          id INTEGER PRIMARY KEY,
          title TEXT
        )`,
          handleResult(`Created ${DB_TABLE_CHECKLIST_LISTS} table`),
        )
          .run(
            `CREATE TABLE IF NOT EXISTS ${DB_TABLE_CHECKLIST_CATEGORIES} (
          id INTEGER PRIMARY KEY,
          listId INTEGER,
          title TEXT,
          FOREIGN KEY(listId) REFERENCES ${DB_TABLE_CHECKLIST_LISTS}(id)
        )`,
            handleResult(`Created ${DB_TABLE_CHECKLIST_CATEGORIES} table`),
          )
          .run(
            `CREATE TABLE IF NOT EXISTS ${DB_TABLE_CHECKLIST_ITEMS} (
          id INTEGER PRIMARY KEY,
          categoryId INTEGER ,
          title TEXT,
          checkStatus INTEGER,
          FOREIGN KEY(categoryId) REFERENCES ${DB_TABLE_CHECKLIST_CATEGORIES}(id)
        )`,
            handleResult(`Created ${DB_TABLE_CHECKLIST_ITEMS} table`, resolve),
          );
      });
    } catch (error) {
      reject(error);
    }
  });
}

// Fill the db tables using the extractFromSheet.json file
async function fillDB() {
  const listId = await insertOneList({ title: extractedData.title });

  for (const category of extractedData.categories) {
    const categoryId = await insertOneCategory({
      title: category.title,
      listId,
    });

    for (const item of category.items) {
      await insertOneItem({
        title: item.title,
        categoryId,
        checkStatus: 0,
      });
    }
  }
}

(async function () {
  try {
    const db = await connectDb(true);
    await dropTables(db);
    await createTables(db);
    await fillDB();
  } catch (error) {
    console.error("FINAL CATCH Error", error);
  }
})();
