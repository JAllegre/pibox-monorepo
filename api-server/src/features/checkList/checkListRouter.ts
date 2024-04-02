import express, { NextFunction, Request, Response, Router } from "express";

const checkListRouter: Router = express.Router();

checkListRouter.get(
  "/",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({
        checkList,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default checkListRouter;

const checkList = {
  id: 1,
  title: "My Check List",
  categories: [
    {
      id: 1,
      title: "Entretien / Bazar",
      items: [
        {
          id: 1,
          checkStatus: 0,
          title: "Charbon",
        },
        {
          id: 2,
          checkStatus: 1,
          title: "Javel",
        },
        {
          id: 3,
          checkStatus: 2,
          title: "Sacs poubelle",
          subtitle: "100L/15L/30L/50L",
        },
      ],
    },
    {
      id: 2,
      title: "Pain / Pti Dej",
      items: [
        {
          id: 4,
          checkStatus: 0,
          title: "Pain de mie",
        },
        {
          id: 5,
          checkStatus: 1,
          title: "Gaufres",
        },
        {
          id: 6,
          checkStatus: 2,
          title: "Levure fraîche ",
        },
      ],
    },
  ],
};
