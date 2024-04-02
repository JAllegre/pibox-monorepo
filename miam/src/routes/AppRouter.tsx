import RecipeEditorWithPassword from "@src/components/RecipeEditorWithPassword";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import ErrorPage from "../ErrorPage";
import RecipePage from "../components/RecipePage";
import RecipesPage from "../components/RecipesPage";
import { getAllRecipes, getOneRecipe } from "../lib/api";
import { Paths } from "../lib/constants";
import Root from "./Root";

const router = createBrowserRouter([
  {
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Navigate to={Paths.Recipes} replace />,
      },
      {
        path: "/miam/",
        element: <Navigate to={Paths.Recipes} replace />,
      },
      {
        path: Paths.Recipes,
        element: <RecipesPage />,
        loader: async () => {
          return getAllRecipes();
        },
      },
      {
        path: `${Paths.Recipes}/:recipeId`,
        element: <RecipePage />,
        loader: async ({ params: { recipeId } }) => {
          return getOneRecipe(parseInt(recipeId || "", 10));
        },
      },
      {
        path: `${Paths.Recipes}/:recipeId/update`,
        element: <RecipeEditorWithPassword />,
        loader: async ({ params: { recipeId } }) => {
          const { recipe } = await getOneRecipe(parseInt(recipeId || "", 10));
          return recipe;
        },
      },
      {
        path: `${Paths.Recipes}/create`,
        element: <RecipeEditorWithPassword />,
        loader: async () => {
          return null;
        },
      },
    ],
  },
]);

export default function AppRouterProvider() {
  return <RouterProvider router={router} />;
}
