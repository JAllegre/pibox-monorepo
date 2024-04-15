import sqlite3 from "sqlite3";
import {
  ChecklistCategoryInput,
  ChecklistInput,
  ChecklistItemInput,
} from "../../../../common/checklistTypes";
import { connectDb, endDb } from "../../lib/db";
import {
  DB_TABLE_CHECKLIST_CATEGORIES,
  DB_TABLE_CHECKLIST_ITEMS,
  DB_TABLE_CHECKLIST_LISTS,
} from "./checklistConstants";

export interface ChecklistListRow {
  id: number;
  title: string;
  subtitle: string;
  checkStatus: number;
  categoryId: number;
  categoryTitle: string;
  listId: number;
  listTitle: string;
}

export async function getAllChecklistItems(
  listId: number
): Promise<ChecklistListRow[]> {
  const db = await connectDb();

  return new Promise((resolve, reject) => {
    try {
      db.all<ChecklistListRow>(
        `SELECT items.id as id, 
          items.title as title, 
          items.subtitle as subtitle, 
          items.checkStatus as checkStatus,
          categories.id as categoryId, 
          categories.title as categoryTitle,
          lists.title as listTitle,
          lists.id as listId
        FROM ${DB_TABLE_CHECKLIST_ITEMS} items
        INNER JOIN ${DB_TABLE_CHECKLIST_CATEGORIES} categories
        ON items.categoryId=categories.id
        INNER JOIN ${DB_TABLE_CHECKLIST_LISTS} lists
        ON categories.listId=lists.id
        ;`,
        //WHERE lists.id=${listId}

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
  console.log(
    "checklistDb.tsx/insertOneList | checklistInput=",
    !!checklistInput
  );
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
    "checklistDb.tsx/insertOneCategory | checklistCategoryInput=",
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
    "checklistDb.tsx/insertOneItem | checklistItemInput=",
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

export async function updateOneChecklistItem(
  itemId: number,
  itemInput: ChecklistItemInput
): Promise<void> {
  console.log("checklistDb.tsx/updateOneChecklistItem | itemInput=", itemInput);

  const queryKeys: string[] = [];
  const queryValues: any[] = [];
  Object.entries(itemInput).forEach(([key, value]) => {
    queryKeys.push(`${key}=?`);
    queryValues.push(value);
  });

  queryValues.push(itemId);
  const db = await connectDb();
  return new Promise((resolve, reject) => {
    try {
      db.run(
        `UPDATE ${DB_TABLE_CHECKLIST_ITEMS} SET ${queryKeys.join(
          ","
        )}  WHERE id=?`,
        queryValues,
        (err: Error) => {
          console.log("SUCCESS");
          if (err) {
            return reject(err);
          }
          resolve();
        }
      );
    } catch (error) {
      reject(error);
    } finally {
      endDb(db);
    }
  });
}

export async function updateOneChecklistCategory(
  categoryId: number,
  categoryInput: ChecklistCategoryInput
): Promise<void> {
  console.log(
    "checklistDb.tsx/updateOneChecklistCategory | categoryInput=",
    !!categoryInput
  );

  const db = await connectDb();
  return new Promise((resolve, reject) => {
    try {
      db.run(
        `UPDATE ${DB_TABLE_CHECKLIST_CATEGORIES} SET title=?,listId=? WHERE id=?`,
        [categoryInput.title, categoryInput.listId, categoryId],
        (err: Error) => {
          if (err) {
            return reject(err);
          }
          resolve();
        }
      );
    } catch (error) {
      reject(error);
    } finally {
      endDb(db);
    }
  });
}

export async function updateOneChecklistList(
  listId: number,
  listInput: ChecklistInput
): Promise<void> {
  console.log(
    "checklistDb.tsx/updateOneChecklistList | listInput=",
    !!listInput
  );

  const db = await connectDb();
  return new Promise((resolve, reject) => {
    try {
      db.run(
        `UPDATE ${DB_TABLE_CHECKLIST_LISTS} SET title=? WHERE id=?`,
        [listInput.title, listId],
        (err: Error) => {
          if (err) {
            return reject(err);
          }
          resolve();
        }
      );
    } catch (error) {
      reject(error);
    } finally {
      endDb(db);
    }
  });
}

export async function deleteOneChecklistCategory(
  categoryId: number
): Promise<void> {
  console.log(
    "checklistDb.tsx/deleteOneChecklistCategory | categoryId=",
    categoryId
  );

  const db = await connectDb();
  return new Promise((resolve, reject) => {
    let stmt: sqlite3.Statement | undefined;
    try {
      db.serialize(() => {
        stmt = db.prepare(
          `DELETE FROM ${DB_TABLE_CHECKLIST_ITEMS}  WHERE categoryId=?`
        );
        stmt.run([categoryId], (err: Error) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
        stmt = db.prepare(
          `DELETE FROM ${DB_TABLE_CHECKLIST_CATEGORIES}  WHERE id=?`
        );
        stmt.run([categoryId], (err: Error) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    } catch (error) {
      reject(error);
    } finally {
      endDb(db, stmt);
    }
  });
}
