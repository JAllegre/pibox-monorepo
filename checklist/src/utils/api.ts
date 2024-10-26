import {
  ChecklistCategoryInput,
  ChecklistGetListResponse,
  ChecklistItemInput,
  ChecklistListInput,
  ChecklistPostCategoryResponse,
  ChecklistPostItemResponse,
  ChecklistsGetListsResponse,
  PostChecklistListResponse,
} from "../../../common/checklistTypes";
import { del, fetchData, postData, putData } from "../../../common/clientApi";

const baseApiUrl = `${import.meta.env.VITE_API_HOST || ""}/api/checklists`;

export async function getChecklists(): Promise<ChecklistsGetListsResponse> {
  return fetchData(`${baseApiUrl}/`);
}

export async function getChecklist(listId: number): Promise<ChecklistGetListResponse> {
  return fetchData(`${baseApiUrl}/${listId}`);
}

export async function addList(checklistItemInput: ChecklistListInput): Promise<PostChecklistListResponse> {
  return postData(`${baseApiUrl}`, checklistItemInput);
}

export async function updateList(listId: number, checklistInput: Partial<ChecklistListInput>): Promise<void> {
  return putData(`${baseApiUrl}/${listId}`, checklistInput);
}

export async function addCategory(
  listId: number,
  checklistCategoryInput: ChecklistCategoryInput
): Promise<ChecklistPostCategoryResponse> {
  return postData(`${baseApiUrl}/${listId}/categories`, checklistCategoryInput);
}

export async function updateCategory(
  listId: number,
  categoryId: number,
  checklistCategoryInput: Partial<ChecklistCategoryInput>
): Promise<void> {
  return putData(`${baseApiUrl}/${listId}/categories/${categoryId}`, checklistCategoryInput);
}

export async function addItem(
  listId: number,
  checklistItemInput: ChecklistItemInput
): Promise<ChecklistPostItemResponse> {
  return postData(`${baseApiUrl}/${listId}/items`, checklistItemInput);
}

export async function updateItem(
  listId: number,
  itemId: number,
  checklistItemInput: Partial<ChecklistItemInput>
): Promise<void> {
  return putData(`${baseApiUrl}/${listId}/items/${itemId}`, checklistItemInput);
}

export async function removeItem(listId: number, itemId: number): Promise<void> {
  return del(`${baseApiUrl}/${listId}/items/${itemId}`);
}
