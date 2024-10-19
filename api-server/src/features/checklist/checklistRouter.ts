import express, { NextFunction, Request, Response, Router } from "express";
import { CHECKLIST_WS_EVENT_REFRESHED, CHECKLIST_WS_NAMESPACE } from "../../../../common/checklistConstants";
import { Checklist } from "../../../../common/checklistTypes";
import { emitToWebSocketClient } from "../../lib/socketManager";
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

function grabRequestParameters(req: Request) {
  return {
    listId: req.params?.listId != null ? parseInt(req.params.listId, 10) : undefined,
    categoryId: req.params?.categoryId != null ? parseInt(req.params.categoryId, 10) : undefined,
    itemId: req.params?.itemId != null ? parseInt(req.params.itemId, 10) : undefined,
  };
}

checklistRouter.use((req, resp, next) => {
  if (["PUT", "POST", "DELETE", "PATCH"].includes(req.method)) {
    resp.on("finish", () => {
      emitToWebSocketClient(CHECKLIST_WS_NAMESPACE, CHECKLIST_WS_EVENT_REFRESHED);
    });
  }
  next();
});

checklistRouter.get("/:listId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { listId } = grabRequestParameters(req);
    if (listId == undefined) {
      throw new Error("No listId provided");
    }
    const rows: ChecklistListRow[] = await getAllChecklistItems(listId);

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
          sortOrder: row.categorySortOrder,
        };
        acc.push(category);
      }
      if (row.id) {
        // Can occur due to OUTER JOIN
        category.items.push({
          id: row.id,
          categoryId: row.categoryId,
          checked: row.checked,
          title: row.title,
          sortOrder: row.sortOrder,
        });
      }

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
    const { listId } = grabRequestParameters(req);
    if (listId == undefined) {
      throw new Error("No listId provided");
    }
    await updateOneList(listId, req.body);
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
    const { itemId } = grabRequestParameters(req);
    if (itemId == undefined) {
      throw new Error("No itemId provided");
    }
    await updateOneItem(itemId, req.body);
    res.json({ message: "Item successfully updated" });
  } catch (err) {
    next(err);
  }
});

checklistRouter.delete(`/:listId/items/:itemId`, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { itemId } = grabRequestParameters(req);
    if (!itemId) {
      throw new Error("No itemId provided");
    }
    await deleteOneItem(itemId);
    res.json({ message: "Item successfully deleted" });
  } catch (err) {
    next(err);
  }
});

checklistRouter.post(`/:listId/categories`, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = await insertOneCategory(req.body);
    res.json({ message: "Category successfully added", id });
  } catch (err) {
    next(err);
  }
});

checklistRouter.put(`/:listId/categories/:categoryId`, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId } = grabRequestParameters(req);
    if (categoryId == undefined) {
      throw new Error("No categoryId provided");
    }
    await updateOneCategory(categoryId, req.body);
    res.json({ message: "Category successfully updated" });
  } catch (err) {
    next(err);
  }
});

export default checklistRouter;
