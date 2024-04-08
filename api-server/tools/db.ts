import readline from "readline";
import { connectDb } from "../src/lib/db";

async function header(): Promise<void> {
  const db = await connectDb();
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT name FROM sqlite_master WHERE type = "table"',
      [],
      (err, rows) => {
        if (err) {
          return reject(err);
        }
        let dbNames: string[] = [];
        rows.forEach((row) => {
          dbNames.push(row.name);
        });
        console.log("DB Names:", dbNames.join(" | "));
        resolve();
      }
    );
  });
}

async function query(sql: string): Promise<void> {
  const db = await connectDb();
  return new Promise((resolve, reject) => {
    db.all(sql, [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      rows.forEach((row) => {
        console.log(JSON.stringify(row));
      });
      console.log(`Total rows: ${rows.length}`);
      resolve();
    });
  });
}

async function ask() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question(`SQL: `, (sql) => {
    sql = sql || "SELECT * from checklistItems";
    console.log(``);
    rl.close();
    query(sql).then(() => {
      ask();
    });
  });
}

(async function run() {
  await header();
  await ask();
})();
