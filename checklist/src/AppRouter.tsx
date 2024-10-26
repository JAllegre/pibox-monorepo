import { FC } from "react";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import CheckListHome from "./components/CheckListHome";
import ChecklistPanel from "./components/ChecklistPanel";

export const CHECKLIST_BASE_ROUTE = "lists";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />} path="/">
      <Route path={`${CHECKLIST_BASE_ROUTE}/:lId`} element={<ChecklistPanel />} />
      <Route path={`${CHECKLIST_BASE_ROUTE}`} element={<CheckListHome />}></Route>
      <Route index element={<CheckListHome />} />
    </Route>
  )
);

const AppRouter: FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
