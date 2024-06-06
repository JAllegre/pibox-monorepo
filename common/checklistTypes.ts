export enum ChecklistItemStatus {
  Unchecked = 0,
  Checked = 1,
}

export interface ChecklistItem {
  id: number;
  categoryId: number;
  checked: ChecklistItemStatus;
  title: string;
  sortOrder: number;
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
