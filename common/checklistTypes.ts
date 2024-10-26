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

export interface ChecklistPostItemResponse {
  message: string;
  id: number;
}

export interface ChecklistCategory {
  id: number;
  listId: number;
  title: string;
  items: ChecklistItem[];
  sortOrder: number;
}

export type ChecklistCategoryInput = Omit<ChecklistCategory, "items" | "id">;

export interface ChecklistPostCategoryResponse {
  message: string;
  id: number;
}

export interface ChecklistList {
  id: number;
  title: string;
  categories: ChecklistCategory[];
}

export type ChecklistListInput = Omit<ChecklistList, "id" | "categories">;

export interface ChecklistListShort {
  id: number;
  title: string;
}
export interface ChecklistsGetListsResponse {
  checklists: ChecklistListShort[];
}

export interface ChecklistGetListResponse {
  checklist: ChecklistList;
}

export interface PostChecklistListResponse {
  message: string;
  id: number;
}
