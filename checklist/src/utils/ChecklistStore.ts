import type {} from "@redux-devtools/extension"; // required for devtools typing
import { DisplayMode } from "@src/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface ChecklistState {
  currentListId: number;
  searchFilter: string;
  setSearchFilter: (newSearchFilter: string) => void;
  itemIdToDelete: number;
  setItemIdToDelete: (newItemIdToDelete: number) => void;
}

export const useChecklistStore = create<ChecklistState>()(
  devtools(
    (set) => ({
      currentListId: 1,
      searchFilter: "",
      setSearchFilter: (newSearchFilter) => set(() => ({ searchFilter: newSearchFilter })),
      itemIdToDelete: 0,
      setItemIdToDelete: (newItemIdToDelete: number) => set(() => ({ itemIdToDelete: newItemIdToDelete })),
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
