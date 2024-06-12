import sqlite3 from "sqlite3";
import { ChecklistCategoryInput, ChecklistInput, ChecklistItemInput } from "../../../../common/checklistTypes";
import { buildAddQueryParams, buildUpdateQueryParams, checkId, connectDb, endDb } from "../../lib/db";
import {
  DB_TABLE_CHECKLIST_CATEGORIES,
  DB_TABLE_CHECKLIST_ITEMS,
  DB_TABLE_CHECKLIST_LISTS,
} from "./checklistConstants";

export interface ChecklistListRow {
  id: number;
  title: string;
  checked: number;
  sortOrder: number;
  categoryId: number;
  categoryTitle: string;
  categorySortOrder: number;
  listId: number;
  listTitle: string;
}

export async function getAllChecklistItems(listId: number): Promise<ChecklistListRow[]> {
  const db = await connectDb();

  return new Promise((resolve, reject) => {
    try {
      db.all<ChecklistListRow>(
        `SELECT items.id as id, 
          items.title as title, 
          items.checked as checked,
          items.sortOrder as sortOrder, 
          categories.id as categoryId, 
          categories.title as categoryTitle,
          lists.title as listTitle,
          lists.id as listId,
          categories.sortOrder as categorySortOrder
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
          console.info("listId", rows?.length);
          resolve(rows);
        },
      );
    } catch (error) {
      reject(error);
    } finally {
      endDb(db);
    }
  });
}

export async function insertOneList(checklistInput: ChecklistInput): Promise<number> {
  console.log("checklistDb.tsx/insertOneList | checklistInput=", !!checklistInput);
  const db = await connectDb();
  return new Promise((resolve, reject) => {
    let stmt: sqlite3.Statement | undefined;
    try {
      db.serialize(() => {
        stmt = db.prepare(`INSERT INTO ${DB_TABLE_CHECKLIST_LISTS} (title) VALUES(?)`);
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

export async function updateOneList(listId: number, listInput: ChecklistInput): Promise<void> {
  console.log("checklistDb.tsx/updateOneChecklistList | listInput=", listInput);

  const db = await connectDb();
  return new Promise((resolve, reject) => {
    try {
      const { queryValues, querySet } = buildUpdateQueryParams(listId, listInput);

      db.run(`UPDATE ${DB_TABLE_CHECKLIST_LISTS} SET ${querySet} WHERE id=?`, queryValues, (err: Error) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    } catch (error) {
      reject(error);
    } finally {
      endDb(db);
    }
  });
}

export async function insertOneCategory(checklistCategoryInput: ChecklistCategoryInput): Promise<number> {
  console.log("checklistDb.tsx/insertOneCategory | checklistCategoryInput=", checklistCategoryInput);
  const db = await connectDb();
  return new Promise((resolve, reject) => {
    try {
      const { queryValues, queryKeys } = buildAddQueryParams(checklistCategoryInput);

      db.run(
        `INSERT INTO ${DB_TABLE_CHECKLIST_CATEGORIES} (${queryKeys.join(
          ",",
        )})  VALUES (${queryKeys.map(() => "?").join(",")})`,
        queryValues,
        function (err: Error) {
          if (err) {
            return reject(err);
          }
          // @ts-ignore
          resolve(this?.lastID);
        },
      );
    } catch (error) {
      reject(error);
    } finally {
      endDb(db);
    }
  });
}

export async function updateOneCategory(categoryId: number, categoryInput: ChecklistCategoryInput): Promise<void> {
  console.log("checklistDb.tsx/updateOneCategory | Params=", {
    categoryId,
    categoryInput,
  });

  const db = await connectDb();
  return new Promise((resolve, reject) => {
    try {
      const { queryValues, querySet } = buildUpdateQueryParams(categoryId, categoryInput);

      db.run(`UPDATE ${DB_TABLE_CHECKLIST_CATEGORIES} SET ${querySet} WHERE id=?`, queryValues, (err: Error) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    } catch (error) {
      reject(error);
    } finally {
      endDb(db);
    }
  });
}

export async function deleteOneCategory(categoryId: number): Promise<void> {
  console.log("checklistDb.tsx/deleteOneCategory | categoryId=", categoryId);
  checkId(categoryId);
  const db = await connectDb();
  return new Promise((resolve, reject) => {
    let stmt: sqlite3.Statement | undefined;
    try {
      db.serialize(() => {
        db.run(`DELETE FROM ${DB_TABLE_CHECKLIST_ITEMS}  WHERE categoryId=?`, [categoryId]).run(
          `DELETE FROM ${DB_TABLE_CHECKLIST_CATEGORIES}  WHERE id=?`,
          [categoryId],

          (err: Error) => {
            if (err) {
              return reject(err);
            }
            resolve();
          },
        );
      });
    } catch (error) {
      reject(error);
    } finally {
      endDb(db, stmt);
    }
  });
}

export async function insertOneItem(checklistItemInput: ChecklistItemInput): Promise<number> {
  console.log("checklistDb.tsx/insertOneItem | checklistItemInput=", checklistItemInput);
  const db = await connectDb();
  return new Promise((resolve, reject) => {
    try {
      const { queryValues, queryKeys } = buildAddQueryParams(checklistItemInput);

      db.run(
        `INSERT INTO ${DB_TABLE_CHECKLIST_ITEMS} (${queryKeys.join(
          ",",
        )})  VALUES (${queryKeys.map(() => "?").join(",")})`,
        queryValues,
        function (err: Error) {
          if (err) {
            return reject(err);
          }
          // @ts-ignore
          resolve(this?.lastID);
        },
      );
    } catch (error) {
      reject(error);
    } finally {
      endDb(db);
    }
  });
}

export async function updateOneItem(itemId: number, itemInput: ChecklistItemInput): Promise<void> {
  console.log("checklistDb.tsx/updateOneItem | Params=", {
    itemId,
    itemInput,
  });

  const db = await connectDb();

  return new Promise((resolve, reject) => {
    try {
      const { queryValues, querySet } = buildUpdateQueryParams(itemId, itemInput);
      db.run(`UPDATE ${DB_TABLE_CHECKLIST_ITEMS} SET ${querySet}  WHERE id=?`, queryValues, (err: Error) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    } catch (error) {
      reject(error);
    } finally {
      endDb(db);
    }
  });
}

export async function deleteOneItem(itemId: number): Promise<void> {
  console.log("checklistDb.tsx/deleteOneItem | itemId=", itemId);
  checkId(itemId);
  const db = await connectDb();
  return new Promise((resolve, reject) => {
    try {
      db.run(`DELETE FROM ${DB_TABLE_CHECKLIST_ITEMS} WHERE id=?`, [itemId], (err: Error) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    } catch (error) {
      reject(error);
    } finally {
      endDb(db);
    }
  });
}
