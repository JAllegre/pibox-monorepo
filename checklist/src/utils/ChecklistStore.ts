import type {} from "@redux-devtools/extension"; // required for devtools typing
import { DisplayMode } from "@src/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface ChecklistState {
  searchFilter: string;
  setSearchFilter: (newSearchFilter: string) => void;
  itemIdToDelete: number;
  setItemIdToDelete: (newItemIdToDelete: number) => void;
  categoryIdToDelete: number;
  setCategoryIdToDelete: (newCategoryIdToDelete: number) => void;
  listIdToDelete: number;
  setListIdToDelete: (newListIdToDelete: number) => void;
}

export const useChecklistStore = create<ChecklistState>()(
  devtools(
    (set) => ({
      searchFilter: "",
      setSearchFilter: (newSearchFilter) => set(() => ({ searchFilter: newSearchFilter })),
      itemIdToDelete: 0,
      setItemIdToDelete: (newItemIdToDelete: number) => set(() => ({ itemIdToDelete: newItemIdToDelete })),
      categoryIdToDelete: 0,
      setCategoryIdToDelete: (newCategoryIdToDelete: number) =>
        set(() => ({ categoryIdToDelete: newCategoryIdToDelete })),
      listIdToDelete: 0,
      setListIdToDelete: (newListIdToDelete: number) => set(() => ({ listIdToDelete: newListIdToDelete })),
    }),
    {
      name: "checklist-store",
    }
  )
);

interface PersistentChecklistState {
  displayMode: DisplayMode;
  setDisplayMode: (newDisplayMode: DisplayMode) => void;
}

export const usePersistChecklistStore = create<PersistentChecklistState>()(
  devtools(
    persist(
      (set) => ({
        displayMode: DisplayMode.Edit,
        setDisplayMode: (newDisplayMode) => set(() => ({ displayMode: newDisplayMode })),
      }),
      {
        name: "checklist-store",
      }
    )
  )
);
