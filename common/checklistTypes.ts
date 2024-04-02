export enum ChecklistItemStatus {
  Unselected = 0,
  SelectedUnchecked = 1,
  SelectedChecked = 2,
}

export interface ChecklistItem {
  id: number;
  checkStatus: ChecklistItemStatus;
  title: string;
  subtitle?: string;
}

export interface ChecklistCategory {
  id: number;
  title: string;
  items: ChecklistItem[];
}
export interface Checklist {
  id: number;
  title: string;
  categories: ChecklistCategory[];
}

export interface GetChecklistResponse {
  checklist: Checklist;
}
