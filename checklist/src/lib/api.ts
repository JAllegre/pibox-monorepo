import {
  ChecklistCategoryInput,
  ChecklistItemInput,
  GetChecklistResponse,
} from "../../../common/checklistTypes";
import { fetchData, putData } from "../../../common/clientApi";

const baseApiUrl = `${import.meta.env.VITE_API_HOST}/api/checklists`;

export async function getChecklist(): Promise<GetChecklistResponse> {
  return fetchData(`${baseApiUrl}/0`);
}

export async function updateCategory(
  categoryId: number,
  checklistCategoryInput: Partial<ChecklistCategoryInput>
): Promise<void> {
  return putData(
    `${baseApiUrl}/0/categories/${categoryId}`,
    checklistCategoryInput
  );
}

export async function updateItem(
  itemId: number,
  checklistItemInput: Partial<ChecklistItemInput>
): Promise<void> {
  return putData(`${baseApiUrl}/0/items/${itemId}`, checklistItemInput);
}
