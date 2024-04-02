// Shared types between client and server

export enum RecipeKind {
  Appetizer = 1,
  Course = 2,
  Dessert = 4,
  Drink = 8,
}

export interface RecipeInput {
  name: string;
  ingredients: string;
  steps: string;
  kind: RecipeKind;
  peopleNumber?: number;
  imageDataUrl?: string;
}

export interface RecipeRow {
  id: number;
  name: string;
  ingredients: string;
  steps: string;
  kind: number;
  peopleNumber?: number;
  imageDataUrl?: string;
}

export interface RecipeRowShort {
  id: number;
  name: string;
  kind: number;
}

export interface GetRecipesResponse {
  recipes: RecipeRowShort[];
  numRows: number;
}

export interface GetRecipeResponse {
  recipe: RecipeRow;
}
