import {
  ChecklistCategoryInput,
  ChecklistInput,
  ChecklistItemInput,
  GetChecklistResponse,
  PostChecklistItemResponse,
} from "../../../common/checklistTypes";
import { del, fetchData, postData, putData } from "../../../common/clientApi";

const baseApiUrl = `${import.meta.env.VITE_API_HOST || ""}/api/checklists`;

export async function getChecklist(): Promise<GetChecklistResponse> {
  return fetchData(`${baseApiUrl}/0`);
}

export async function updateList(listId: number, checklistInput: Partial<ChecklistInput>): Promise<void> {
  return putData(`${baseApiUrl}/${listId}`, checklistInput);
}

export async function updateCategory(
  categoryId: number,
  checklistCategoryInput: Partial<ChecklistCategoryInput>
): Promise<void> {
  return putData(`${baseApiUrl}/0/categories/${categoryId}`, checklistCategoryInput);
}

export async function addItem(checklistItemInput: ChecklistItemInput): Promise<PostChecklistItemResponse> {
  return postData(`${baseApiUrl}/0/items`, checklistItemInput);
}

export async function updateItem(itemId: number, checklistItemInput: Partial<ChecklistItemInput>): Promise<void> {
  return putData(`${baseApiUrl}/0/items/${itemId}`, checklistItemInput);
}

export async function removeItem(itemId: number): Promise<void> {
  return del(`${baseApiUrl}/0/items/${itemId}`);
}
