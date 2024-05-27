import { RecipeKind } from "@common/miamTypes";
import { CakeSlice, CookingPot, LucideIcon, Salad, ShieldQuestion, Wine } from "lucide-react";

const recipeKindProperties = {
  [RecipeKind.Appetizer]: { label: "Entrée", color: "cornflowerblue", Icon: Salad },
  [RecipeKind.Course]: { label: "Plat", color: "purple", Icon: CookingPot },
  [RecipeKind.Dessert]: { label: "Dessert", color: "orange", Icon: CakeSlice },
  [RecipeKind.Drink]: { label: "Boisson", color: "green", Icon: Wine },
};

export function getRecipeKindProperties(kind: RecipeKind): { label: string; color: string; Icon: LucideIcon } {
  if (recipeKindProperties[kind]) {
    return recipeKindProperties[kind];
  }

  return { label: "??????", color: "red", Icon: ShieldQuestion };
}
