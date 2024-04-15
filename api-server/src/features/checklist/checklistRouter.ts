import express, { NextFunction, Request, Response, Router } from "express";
import { Checklist } from "../../../../common/checklistTypes";
import {
  ChecklistListRow,
  getAllChecklistItems,
  updateOneChecklistCategory,
  updateOneChecklistItem,
} from "./checklistDb";

const checklistRouter: Router = express.Router();

checklistRouter.get(
  "/:listId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rows: ChecklistListRow[] = await getAllChecklistItems(
        Number(req.params.listId)
      );

      const checklist: Checklist = {
        id: rows?.[0]?.listId || 0,
        title: rows?.[0]?.listTitle || "Test Checklist",
        categories: [],
      };

      rows.reduce((acc, row) => {
        let category = acc.find((c) => c.id === row.categoryId);
        if (!category) {
          category = {
            id: row.categoryId,
            listId: row.listId,
            title: row.categoryTitle,
            items: [],
          };
          acc.push(category);
        }
        category.items.push({
          id: row.id,
          categoryId: row.categoryId,
          checkStatus: row.checkStatus,
          title: row.title,
          subtitle: row.subtitle,
        });
        return acc;
      }, checklist.categories);

      res.json({
        checklist,
      });
    } catch (err) {
      next(err);
    }
  }
);

checklistRouter.put(
  `/:listId/items/:itemId`,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await updateOneChecklistItem(parseInt(req.params.itemId, 10), req.body);
      res.json({ message: "Item successfully updated" });
    } catch (err) {
      next(err);
    }
  }
);

checklistRouter.put(
  `/:listId/categories/:categoryId`,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await updateOneChecklistCategory(
        parseInt(req.params.categoryId, 10),
        req.body
      );
      res.json({ message: "Item successfully updated" });
    } catch (err) {
      next(err);
    }
  }
);

export default checklistRouter;
