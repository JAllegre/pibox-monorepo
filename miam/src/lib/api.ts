const RECIPES_API_PATH = "/api/miam/recipes";

import {
  GetRecipeResponse,
  GetRecipesResponse,
  RecipeInput,
} from "@common/miamTypes";

const baseApiUrl = `${import.meta.env.VITE_API_HOST}${RECIPES_API_PATH}`;

function checkResponse(response: Response) {
  if (!response.ok) {
    console.log("api.ts/checkResponse | Bad response", response);
    throw new Error(response.statusText);
  }
  return response.json();
}

async function postData<T>(url: string, data: T, method = "POST") {
  const response = await fetch(url, {
    method: method,
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return checkResponse(response);
}

async function fetchData(url: string) {
  const response = await fetch(url);
  return checkResponse(response);
}

export async function getAllRecipes(): Promise<GetRecipesResponse> {
  return fetchData(baseApiUrl);
}

export async function getOneRecipe(
  recipeId: number
): Promise<GetRecipeResponse> {
  return fetchData(`${baseApiUrl}/${recipeId}`);
}

export async function updateOneRecipe(
  recipeId: number,
  recipeInput: RecipeInput
): Promise<GetRecipeResponse> {
  return postData<RecipeInput>(`${baseApiUrl}/${recipeId}`, recipeInput, "PUT");
}

export async function addOneRecipe(
  recipeInput: RecipeInput
): Promise<GetRecipeResponse> {
  return postData(`${baseApiUrl}`, recipeInput);
}

export async function checkPassword(password: string): Promise<undefined> {
  return postData(`${baseApiUrl}/check-pwd`, { password });
}
