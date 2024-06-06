import express, { NextFunction, Request, Response, Router } from "express";
import { Checklist } from "../../../../common/checklistTypes";
import {
  ChecklistListRow,
  deleteOneItem,
  getAllChecklistItems,
  insertOneCategory,
  insertOneItem,
  updateOneCategory,
  updateOneItem,
  updateOneList,
} from "./checklistDb";

const checklistRouter: Router = express.Router();

checklistRouter.get("/:listId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rows: ChecklistListRow[] = await getAllChecklistItems(Number(req.params.listId));

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
        checked: row.checked,
        title: row.title,
        sortOrder: row.sortOrder,
      });
      return acc;
    }, checklist.categories);

    res.json({
      checklist,
    });
  } catch (err) {
    next(err);
  }
});

checklistRouter.put(`/:listId`, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await updateOneList(parseInt(req.params.listId, 10), req.body);
    res.json({ message: "List successfully updated" });
  } catch (err) {
    next(err);
  }
});

checklistRouter.post(`/:listId/items`, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = await insertOneItem(req.body);
    res.json({ message: "Item successfully added", id });
  } catch (err) {
    next(err);
  }
});

checklistRouter.put(`/:listId/items/:itemId`, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await updateOneItem(parseInt(req.params.itemId, 10), req.body);
    res.json({ message: "Item successfully updated" });
  } catch (err) {
    next(err);
  }
});

checklistRouter.delete(`/:listId/items/:itemId`, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteOneItem(parseInt(req.params.itemId, 10));
    res.json({ message: "Item successfully deleted" });
  } catch (err) {
    next(err);
  }
});

checklistRouter.post(`/:listId/categories`, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await insertOneCategory(req.body);
    res.json({ message: "Category successfully added" });
  } catch (err) {
    next(err);
  }
});

checklistRouter.put(`/:listId/categories/:categoryId`, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await updateOneCategory(parseInt(req.params.categoryId, 10), req.body);
    res.json({ message: "Category successfully updated" });
  } catch (err) {
    next(err);
  }
});

export default checklistRouter;
