// !!! Use TSX to run this script (npm i -g tsx && tsx scripts/deleteRow.ts )

import {
  DB_TABLE_CHECKLIST_CATEGORIES,
  DB_TABLE_CHECKLIST_ITEMS,
  DB_TABLE_CHECKLIST_LISTS,
} from "../../src/features/checklist/checklistConstants";
import { connectDb } from "../../src/lib/db";

// Connecting to or creating a new SQLite database file
connectDb(true).then((db) => {
  // Serialize method ensures that database queries are executed sequentially
  db.serialize(() => {
    db.run(
      `
    DROP TABLE IF EXISTS ${DB_TABLE_CHECKLIST_ITEMS};
    DROP TABLE IF EXISTS ${DB_TABLE_CHECKLIST_CATEGORIES};
    DROP TABLE IF EXISTS ${DB_TABLE_CHECKLIST_LISTS};
    `,

      (err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log(`DROPPED `);
      }
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS ${DB_TABLE_CHECKLIST_LISTS} (
        id INTEGER PRIMARY KEY,
        title TEXT
      )`,
      (err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log(`Created ${DB_TABLE_CHECKLIST_LISTS} table.`);
      }
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS ${DB_TABLE_CHECKLIST_CATEGORIES} (
        id INTEGER PRIMARY KEY,
        listId INTEGER,
        title TEXT,
        FOREIGN KEY(listId) REFERENCES ${DB_TABLE_CHECKLIST_LISTS}(id)
      )`,
      (err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log(`Created ${DB_TABLE_CHECKLIST_CATEGORIES} table.`);
      }
    );

    // Create the items table if it doesn't exist
    db.run(
      `CREATE TABLE IF NOT EXISTS ${DB_TABLE_CHECKLIST_ITEMS} (
        id INTEGER PRIMARY KEY,
        categoryId INTEGER ,
        title TEXT,
        subtitle TEXT,
        checkStatus INTEGER,
        FOREIGN KEY(categoryId) REFERENCES ${DB_TABLE_CHECKLIST_CATEGORIES}(id)
      )`,
      (err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log(`Created ${DB_TABLE_CHECKLIST_ITEMS} table.`);

        //   Close the database connection after all insertions are done
        db.close((err) => {
          if (err) {
            return console.error(err.message);
          }
          console.log("Closed the database connection.");
        });
        // });
      }
    );
  });
});
