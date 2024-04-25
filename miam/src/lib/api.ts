import { GetRecipeResponse, GetRecipesResponse, RecipeInput } from "@common/miamTypes";

import { fetchData, postData } from "@common/clientApi";

const baseApiUrl = `${import.meta.env.VITE_API_HOST}/api/miam/recipes`;

export async function getAllRecipes(): Promise<GetRecipesResponse> {
  return fetchData(baseApiUrl);
}

export async function getOneRecipe(recipeId: number): Promise<GetRecipeResponse> {
  return fetchData(`${baseApiUrl}/${recipeId}`);
}

export async function updateOneRecipe(recipeId: number, recipeInput: RecipeInput): Promise<GetRecipeResponse> {
  return postData<RecipeInput>(`${baseApiUrl}/${recipeId}`, recipeInput, "PUT");
}

export async function addOneRecipe(recipeInput: RecipeInput): Promise<GetRecipeResponse> {
  return postData(`${baseApiUrl}`, recipeInput);
}

export async function checkPassword(password: string): Promise<undefined> {
  return postData(`${baseApiUrl}/check-pwd`, { password });
}
