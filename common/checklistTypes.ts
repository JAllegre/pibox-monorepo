export enum ChecklistItemStatus {
  Unselected = 0,
  SelectedUnchecked = 1,
  SelectedChecked = 2,
}

export interface ChecklistItem {
  id: number;
  categoryId: number;
  checkStatus: ChecklistItemStatus;
  title: string;
  subtitle?: string;
}

export type ChecklistItemInput = Omit<ChecklistItem, "id">;

export interface ChecklistCategory {
  id: number;
  listId: number;
  title: string;
  items: ChecklistItem[];
}
export type ChecklistCategoryInput = Omit<ChecklistCategory, "items" | "id">;

export interface Checklist {
  id: number;
  title: string;
  categories: ChecklistCategory[];
}
export type ChecklistInput = Omit<Checklist, "id" | "categories">;

export interface GetChecklistResponse {
  checklist: Checklist;
}

export interface PostChecklistItemResponse {
  message: string;
  id: number;
}
