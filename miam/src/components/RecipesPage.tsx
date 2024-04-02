import { GetRecipesResponse, RecipeKind } from "@common/miamTypes";
import { matchSearch } from "@src/lib/tools";
import { CakeSlice, Plus, Soup, Wine } from "lucide-react";
import { ReactNode, useContext, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { SearchContext } from "../contexts/SearchContext";
import { Paths } from "../lib/constants";
import { Button } from "./ui/button";

export default function RecipesPage() {
  const [selectedKind, setSelectedKind] = useState(0);
  const { recipes } = useLoaderData() as GetRecipesResponse;

  const handleClickRecipeKind = (newRecipeKind: RecipeKind) => () => {
    setSelectedKind((currentRecipeKind) =>
      currentRecipeKind === newRecipeKind ? 0 : newRecipeKind
    );
  };

  const { searchText } = useContext(SearchContext);
  const toggleButtonClass = `border-primary-800 text-white select-none  border border-solid w-20 flex justify-center items-center`;
  const bgColor = "bg-primary-700";
  const bgColorSelected = "bg-primary-600";

  return (
    <main className="flex-col justify-between items-center p-2 min-h-[100vh]">
      <div className="flex justify-between p-1">
        <div className="flex flex-grow justify-center">
          <div className="flex rounded-md  text-sm cursor-pointer">
            <div
              className={`${toggleButtonClass} rounded-l-md ${
                selectedKind === RecipeKind.Course ? bgColorSelected : bgColor
              }`}
              onClick={handleClickRecipeKind(RecipeKind.Course)}
            >
              Plats
            </div>
            <div
              className={`${toggleButtonClass} ${
                selectedKind === RecipeKind.Dessert ? bgColorSelected : bgColor
              }`}
              onClick={handleClickRecipeKind(RecipeKind.Dessert)}
            >
              Desserts
            </div>
            <div
              className={`${toggleButtonClass} rounded-r-md ${
                selectedKind === RecipeKind.Drink ? bgColorSelected : bgColor
              }`}
              onClick={handleClickRecipeKind(RecipeKind.Drink)}
            >
              Boissons
            </div>
          </div>
        </div>
        <Button size="icon" className="bg-primary-700 h-7 w-7">
          <Link to={`${Paths.Recipes}/create`} className="text-[20px] p-5">
            <Plus />
          </Link>
        </Button>
      </div>

      <ul className="pl-2 pt-2">
        {recipes.reduce((acc, recipe) => {
          if (selectedKind && selectedKind !== recipe.kind) {
            return acc;
          }
          if (!matchSearch(searchText, recipe.name)) {
            return acc;
          }
          return [
            ...acc,
            <li
              key={`${recipe.name}-${recipe.id}`}
              className="px-2 py-1 hover:bg-gray-100"
            >
              <Link to={`${Paths.Recipes}/${recipe.id}`}>
                <div className="flex items-center justify-start gap-2">
                  {recipe.kind === RecipeKind.Course && (
                    <Soup
                      size={18}
                      strokeWidth={2}
                      color="purple"
                      className="mb-1"
                    />
                  )}

                  {recipe.kind === RecipeKind.Dessert && (
                    <CakeSlice
                      size={18}
                      strokeWidth={2}
                      color="orange"
                      className="mb-1"
                    />
                  )}

                  {recipe.kind === RecipeKind.Drink && (
                    <Wine
                      size={18}
                      strokeWidth={2}
                      color="green"
                      className="mb-1"
                    />
                  )}

                  <span className="font-semibold">{recipe.name}</span>
                </div>
              </Link>
            </li>,
          ];
        }, [] as ReactNode[])}
      </ul>
    </main>
  );
}
