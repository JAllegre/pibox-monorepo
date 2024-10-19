import type {} from "@redux-devtools/extension"; // required for devtools typing
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface ChecklistState {
  searchFilter: string;
  setSearchFilter: (newSearchFilter: string) => void;
  itemIdToDelete: number;
  setItemIdToDelete: (newItemIdToDelete: number) => void;
}

export const useChecklistStore = create<ChecklistState>()(
  devtools(
    persist(
      (set) => ({
        searchFilter: "",
        setSearchFilter: (newSearchFilter) => set(() => ({ searchFilter: newSearchFilter })),
        itemIdToDelete: 0,
        setItemIdToDelete: (newItemIdToDelete: number) => set(() => ({ itemIdToDelete: newItemIdToDelete })),
      }),
      {
        name: "checklist-store",
      }
    )
  )
);
