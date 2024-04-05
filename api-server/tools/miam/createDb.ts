// !!! Use TSX to run this script (npm i -g tsx && tsx scripts/deleteRow.ts )

import sqlite3 from "sqlite3";
import { DB_TABLE_RECIPES } from "../../src/features/miam/miamConstants";
import { DB_FILENAME } from "../../src/lib/constants";

const sqlite3v = sqlite3.verbose();
// Connecting to or creating a new SQLite database file
const db = new sqlite3v.Database(
  DB_FILENAME,
  sqlite3v.OPEN_READWRITE | sqlite3v.OPEN_CREATE,
  (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Connected to the SQlite database.");
  }
);

// Serialize method ensures that database queries are executed sequentially
db.serialize(() => {
  // Create the items table if it doesn't exist
  db.run(
    `CREATE TABLE IF NOT EXISTS ${DB_TABLE_RECIPES} (
        id INTEGER PRIMARY KEY,
        name TEXT,
        ingredients TEXT,
        steps TEXT,
        peopleNumber INTEGER,
        imageDataUrl TEXT,
        kind INTEGER
      )`,
    (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log(`Created ${DB_TABLE_RECIPES} table.`);

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
