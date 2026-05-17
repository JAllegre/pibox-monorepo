import { RecipeKind } from "@common/miamTypes";
import { CakeSlice, CookingPot, LucideIcon, Salad, ShieldQuestion, Wine } from "lucide-react";

const recipeKindProperties = {
  [RecipeKind.Appetizer]: {
    label: "Entrée",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    hover: "hover:bg-blue-100",
    Icon: Salad,
  },
  [RecipeKind.Course]: {
    label: "Plat",
    color: "text-fuchsia-600",
    bgColor: "bg-fuchsia-50",
    hover: "hover:bg-fuchsia-100",
    Icon: CookingPot,
  },
  [RecipeKind.Dessert]: {
    label: "Dessert",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    hover: "hover:bg-orange-100",
    Icon: CakeSlice,
  },
  [RecipeKind.Drink]: {
    label: "Boisson",
    color: "text-green-600",
    bgColor: "bg-green-50",
    hover: "hover:bg-green-100",
    Icon: Wine,
  },
};

export function getRecipeKindProperties(kind: RecipeKind): {
  label: string;
  color: string;
  Icon: LucideIcon;
  bgColor: string;
  hover: string;
} {
  if (recipeKindProperties[kind]) {
    return recipeKindProperties[kind];
  }

  return { label: "??????", color: "red", Icon: ShieldQuestion, bgColor: "bg-gray-100", hover: "hover:bg-gray-200" };
}
