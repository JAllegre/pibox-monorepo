import express, { NextFunction, Request, Response, Router } from "express";
import {
  getAllRecipes,
  getOneRecipe,
  insertOneRecipe,
  updateOneRecipe,
} from "./miamDb";

const miamRouter: Router = express.Router();

const RECIPES_API = "/recipes";

// RECIPE API
miamRouter.get(
  `${RECIPES_API}`,
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const recipes = await getAllRecipes();
      res.json({
        count: recipes.length,
        recipes,
      });
    } catch (err) {
      next(err);
    }
  }
);

miamRouter.get(
  `${RECIPES_API}/:recipeId`,
  async (req: Request, res: Response, next) => {
    try {
      const recipe = await getOneRecipe(parseInt(req.params.recipeId, 10));
      res.json({
        recipe,
      });
    } catch (err) {
      next(err);
    }
  }
);

miamRouter.post(
  `${RECIPES_API}`,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await insertOneRecipe(req.body);
      res.status(201).json({ message: "Recipe successfully added" });
    } catch (err) {
      next(err);
    }
  }
);

miamRouter.put(
  `${RECIPES_API}/:recipeId`,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await updateOneRecipe(parseInt(req.params.recipeId, 10), req.body);
      res.json({ message: "Recipe successfully updated" });
    } catch (err) {
      next(err);
    }
  }
);

miamRouter.post(
  `${RECIPES_API}/check-pwd`,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { password } = req.body;
      if (password !== "leaju") {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      res.status(200).json({ message: "Authorized" });
    } catch (err) {
      next(err);
    }
  }
);

export default miamRouter;
