// !!! use TSX to run this script (npm i -g tsx && tsx scripts/deleteRow.ts )
// Set ROW_TO_DELETE to the id of a recipe that you want to delete

import { argv, exit } from "node:process";
import { deleteOneRecipe } from "../../src/features/miam/miamDb";

const ROW_TO_DELETE = parseInt(argv[2], 10);

if (!ROW_TO_DELETE) {
  console.error("No Row Provided");
  exit(1);
}

deleteOneRecipe(ROW_TO_DELETE);
