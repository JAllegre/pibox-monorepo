import { RecipeKind } from "@common/miamTypes";
import { CakeSlice, CookingPot, LucideIcon, Salad, Wine } from "lucide-react";

/**
 * Returns the label corresponding to a RecipeKind.
 * @param kind - The RecipeKind value.
 * @returns The label string.
 */
export function getLabelFromRecipeKind(kind?: RecipeKind): string {
  switch (kind) {
    case RecipeKind.Appetizer:
      return "Entrée";
    case RecipeKind.Course:
      return "Plat";
    case RecipeKind.Dessert:
      return "Dessert";
    case RecipeKind.Drink:
      return "Boisson";
    default:
      return "???";
  }
}

export function getColorAndIconFromRecipeKind(kind?: RecipeKind): { color: string; Icon: LucideIcon } {
  switch (kind) {
    case RecipeKind.Appetizer:
      return { color: "cornflowerblue", Icon: Salad };
    case RecipeKind.Course:
      return { color: "purple", Icon: CookingPot };
    case RecipeKind.Dessert:
      return { color: "orange", Icon: CakeSlice };
    case RecipeKind.Drink:
      return { color: "green", Icon: Wine };
    default:
      return { color: "green", Icon: CookingPot };
  }
}
