import sqlite3 from "sqlite3";
import {
  ChecklistCategoryInput,
  ChecklistInput,
  ChecklistItem,
  ChecklistItemInput,
} from "../../../../common/checklistTypes";
import { connectDb, endDb } from "../../lib/db";
import {
  DB_TABLE_CHECKLIST_CATEGORIES,
  DB_TABLE_CHECKLIST_ITEMS,
  DB_TABLE_CHECKLIST_LISTS,
} from "./checklistConstants";

export async function getAllChecklistItems(): Promise<ChecklistItem[]> {
  const db = await connectDb();

  return new Promise((resolve, reject) => {
    try {
      db.all<ChecklistItem>(
        `SELECT items.title as itemTitle, items.subtitle as itemSubtitle, items.checkStatus as itemCheckStatus,items.categoryId as categoryId, categories.title as categoryTitle    FROM ${DB_TABLE_CHECKLIST_ITEMS} items
        INNER JOIN ${DB_TABLE_CHECKLIST_CATEGORIES} categories
        ON items.categoryId=categories.id;
        `,
        (err, rows) => {
          if (err) {
            return reject(err);
          }
          resolve(rows);
        }
      );
    } catch (error) {
      reject(error);
    } finally {
      endDb(db);
    }
  });
}

export async function insertOneList(
  checklistInput: ChecklistInput
): Promise<number> {
  console.log("db.tsx/insertOneList | checklistInput=", !!checklistInput);
  const db = await connectDb();
  return new Promise((resolve, reject) => {
    let stmt: sqlite3.Statement | undefined;
    try {
      db.serialize(() => {
        stmt = db.prepare(
          `INSERT INTO ${DB_TABLE_CHECKLIST_LISTS} (title) VALUES(?)`
        );
        stmt.run([checklistInput.title], (err: Error) => {
          if (err) {
            return reject(err);
          }
          // @ts-ignore
          resolve(stmt?.lastID);
        });
      });
    } catch (error) {
      reject(error);
    } finally {
      endDb(db, stmt);
    }
  });
}

export async function insertOneCategory(
  checklistCategoryInput: ChecklistCategoryInput
): Promise<number> {
  console.log(
    "db.tsx/insertOneCategory | checklistCategoryInput=",
    !!checklistCategoryInput
  );
  const db = await connectDb();
  return new Promise((resolve, reject) => {
    let stmt: sqlite3.Statement | undefined;
    try {
      db.serialize(() => {
        stmt = db.prepare(
          `INSERT INTO ${DB_TABLE_CHECKLIST_CATEGORIES} (title, listId) VALUES(?,?)`
        );
        stmt.run(
          [checklistCategoryInput.title, checklistCategoryInput.listId],
          (err: Error) => {
            if (err) {
              return reject(err);
            }
            // @ts-ignore
            resolve(stmt?.lastID);
          }
        );
      });
    } catch (error) {
      reject(error);
    } finally {
      endDb(db, stmt);
    }
  });
}

export async function insertOneItem(
  checklistItemInput: ChecklistItemInput
): Promise<number> {
  console.log(
    "db.tsx/insertOneItem | checklistItemInput=",
    !!checklistItemInput
  );
  const db = await connectDb();
  return new Promise((resolve, reject) => {
    let stmt: sqlite3.Statement | undefined;
    try {
      db.serialize(() => {
        stmt = db.prepare(
          `INSERT INTO ${DB_TABLE_CHECKLIST_ITEMS} (title, subtitle, checkStatus, categoryId) VALUES(?,?,?,?)`
        );
        stmt.run(
          [
            checklistItemInput.title,
            checklistItemInput.subtitle,
            checklistItemInput.checkStatus,
            checklistItemInput.categoryId,
          ],
          (err: Error) => {
            if (err) {
              return reject(err);
            }
            // @ts-ignore
            resolve(stmt?.lastID);
          }
        );
      });
    } catch (error) {
      reject(error);
    } finally {
      endDb(db, stmt);
    }
  });
}
