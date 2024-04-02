export enum CheckListItemStatus {
  Unselected = 0,
  SelectedUnchecked = 1,
  SelectedChecked = 2,
}

export interface CheckListItem {
  id: number;
  checkStatus: CheckListItemStatus;
  title: string;
  subtitle?: string;
}

export interface CheckListCategory {
  id: number;
  title: string;
  items: CheckListItem[];
}
export interface CheckList {
  id: number;
  title: string;
  categories: CheckListCategory[];
}

export interface GetCheckListResponse {
  checkList: CheckList;
}
