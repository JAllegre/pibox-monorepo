import type {} from "@redux-devtools/extension"; // required for devtools typing
import { DisplayMode } from "@src/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface ChecklistState {
  displayMode: DisplayMode;
  setDisplayMode: (newDisplayMode: DisplayMode) => void;
}

export const useChecklistStore = create<ChecklistState>()(
  devtools(
    persist(
      (set) => ({
        displayMode: DisplayMode.View,
        setDisplayMode: (newDisplayMode) =>
          set(() => ({ displayMode: newDisplayMode })),
      }),
      {
        name: "checklist-store",
      }
    )
  )
);
