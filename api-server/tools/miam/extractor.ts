// !!! Use TSX to run this script (npm i -g tsx && tsx tools/deleteRow.ts )

import { readFileSync } from "node:fs";
import sqlite3 from "sqlite3";
import { DB_TABLE_RECIPES } from "../../src/features/miam/miamConstants";
import { DB_FILENAME } from "../../src/lib/constants";
import { RecipeKind } from "../src/features/miam/miamTypes";
interface RecipeData {
  recipeName: string;
  recipePeople: string;
  ingredientsList: string;
  stepsList: string;
  kind: RecipeKind;
}

function extractRecipeData(
  recipe: string,
  kind: RecipeKind
): RecipeData | undefined {
  const sections = recipe.split("<h2>");
  if (sections.length !== 3) {
    console.error(
      "extractor.js/extractRecipeData | Wrong number of sections",
      sections.length,
      sections
    );
    return;
  }

  const recipeName = sections[0].replace(
    /.*<\/a>(.*?)<\/h1>[\s\S]*/i,
    (c, p1) => `${p1}`
  );
  if (!recipeName) {
    console.error(
      "extractor.js/extractRecipeData | Empty recipe name",
      recipeName,
      sections
    );
    return;
  }

  const ingredientsSection = sections[1];
  const stepsSection = sections[2];

  const ingredientsParts = ingredientsSection.split("</h2>");
  if (ingredientsParts.length !== 2) {
    console.error(
      "extractor.js/extractRecipeData | Wrong number of ingredientsParts",
      ingredientsParts.length,
      ingredientsParts
    );
    return;
  }

  let recipePeople = ingredientsParts[0].replace(/.*?(\d+).*/i, (c, p1) =>
    p1 ? p1 : "0"
  );

  //@ts-ignore
  recipePeople = parseInt(recipePeople, 0) || 0; //ensure value

  const ingredientsList = ingredientsParts[1]
    .trim()
    .replace(/[\n\r]/gim, "")
    .replace(/\s*<p>/gim, "")
    .replace(/<\/p>\s*/gim, "\n")
    .replace(/\s{2,100}/gim, " ")
    .trim();

  const stepsParts = stepsSection.split("</h2>");
  if (stepsParts.length !== 2) {
    console.error(
      "extractor.js/extractRecipeData | Wrong number of stepsParts",
      stepsParts.length,
      stepsParts
    );
    return;
  }
  const stepsList = stepsParts[1]
    .trim()
    .replace(/[\n\r]/gim, "")
    .replace(/\s*<p>/gim, "")
    .replace(/<\/p>\s*/gim, "\n")
    .replace(/\s{2,100}/gim, " ")
    .trim()
    .replace(/<\/div> <div .*<\/html>/gim, ""); //special hack for the last recipe having end of the html file in it
  return {
    recipeName,
    recipePeople,
    ingredientsList,
    stepsList,
    kind,
  };
}

function extractRecipesData(recipePath: string, kind: RecipeKind) {
  console.log("Extracting", recipePath, "...");
  const fileStr = readFileSync(recipePath, "utf8");
  const recipes = fileStr.split("<h1><a id");
  recipes.shift(); // remove first element

  const recipesData = recipes.reduce((acc, recipe) => {
    const recipeData = extractRecipeData(recipe, kind);
    if (recipeData) {
      acc.push(recipeData);
    }
    return acc;
  }, [] as RecipeData[]);
  console.log(" DONE");
  return recipesData;
}

try {
  const saltyRecipes = extractRecipesData(
    "./tools/RecettesSalées.docx.html",
    RecipeKind.Course
  );
  //console.log("saltyRecipes", saltyRecipes);
  const sweetRecipes = extractRecipesData(
    "./tools/RecettesSucrées.docx.html",
    RecipeKind.Dessert
  );

  const drinkRecipes = extractRecipesData(
    "./tools/RecettesBoissons.docx.html",
    RecipeKind.Drink
  );

  const allRecipes = [...saltyRecipes, ...sweetRecipes, ...drinkRecipes];
  // connect and insert into DB
  const sqlite3v = sqlite3.verbose();
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

  db.serialize(() => {
    const insertSql = `INSERT INTO ${DB_TABLE_RECIPES}(name, ingredients, steps, peopleNumber, imageDataUrl, kind) VALUES(?, ?, ?,?, ?, ?)`;

    for (let cpt = 0; cpt < allRecipes.length; cpt++) {
      const recipe = allRecipes[cpt];
      const values = [
        recipe.recipeName,
        recipe.ingredientsList,
        recipe.stepsList,
        recipe.recipePeople,
        "",
        recipe.kind,
      ];
      db.run(insertSql, values, function (err) {
        if (err) {
          return console.error(err.message);
        }
        const id = this.lastID; // get the id of the last inserted row
        console.log(`Rows inserted, ID ${id}`);
      });
    }
    setTimeout(() => {
      db.close(() => {
        console.log("DB closed");
      });
    }, 2000);
  });
} catch (error) {
  console.error("extractor.js/main | Error", error);
}
