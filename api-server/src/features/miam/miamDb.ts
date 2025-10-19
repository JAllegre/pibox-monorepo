import sqlite3 from "sqlite3";
import { RecipeInput, RecipeRow, RecipeRowShort } from "../../../../common/miamTypes";
import { buildUpdateQueryParams, connectDb, endDb } from "../../lib/db";
import { DB_TABLE_RECIPES } from "./miamConstants";

export async function getAllRecipes(): Promise<RecipeRowShort[]> {
  const db = await connectDb();

  return new Promise((resolve, reject) => {
    try {
      db.all<RecipeRowShort>(
        `SELECT id,name,kind FROM  ${DB_TABLE_RECIPES} ORDER BY name COLLATE NOCASE ASC `,
        (err, rows) => {
          if (err) {
            return reject(err);
          }
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

export async function getOneRecipe(id: number): Promise<RecipeRow> {
  console.log("db.tsx/getOneRecipe | id=", id);
  const db = await connectDb();
  return new Promise((resolve, reject) => {
    let stmt: sqlite3.Statement | undefined;
    try {
      db.serialize(() => {
        stmt = db.prepare(`SELECT * FROM ${DB_TABLE_RECIPES} WHERE id=?`);

        stmt.get<RecipeRow>(id, (err, row) => {
          if (err) {
            return reject(err);
          }

          if (row) {
            return resolve(row);
          }
          reject(new Error("getOneRecipe : Row Not found"));
        });
      });
    } catch (error) {
      reject(error);
    } finally {
      endDb(db, stmt);
    }
  });
}

export async function insertOneRecipe(recipeInput: RecipeInput): Promise<void> {
  console.log("db.tsx/insertOneRecipe | recipeInput=", !!recipeInput);
  const db = await connectDb();
  return new Promise((resolve, reject) => {
    let stmt: sqlite3.Statement | undefined;
    try {
      db.serialize(() => {
        stmt = db.prepare(
          `INSERT INTO ${DB_TABLE_RECIPES} (name, ingredients, steps, peopleNumber, imageDataUrl, kind) VALUES(?,?,?,?,?, ?)`,
        );
        stmt.run(
          [
            recipeInput.name,
            recipeInput.ingredients,
            recipeInput.steps,
            recipeInput.peopleNumber,
            recipeInput.imageDataUrl,
            recipeInput.kind,
          ],
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

export async function updateOneRecipe(recipeId: number, recipeInput: RecipeInput): Promise<void> {
  console.log("db.tsx/updateOneRecipe | recipeInput=", !!recipeInput);
  const db = await connectDb();
  return new Promise((resolve, reject) => {
    try {
      const { queryValues, querySet } = buildUpdateQueryParams(recipeId, recipeInput);
      db.run(`UPDATE ${DB_TABLE_RECIPES} SET ${querySet}  WHERE id=?`, queryValues, (err: Error) => {
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

export async function deleteOneRecipe(recipeId: number): Promise<void> {
  console.log("db.tsx/deleteOneRecipe | recipeId=", recipeId);
  const db = await connectDb();
  return new Promise((resolve, reject) => {
    try {
      db.run(`DELETE FROM ${DB_TABLE_RECIPES} WHERE id=?`, [recipeId], (err: Error) => {
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
