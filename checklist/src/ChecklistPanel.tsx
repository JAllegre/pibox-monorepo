import { FormControl, FormLabel, SimpleGrid, Switch } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, FC, useCallback, useEffect } from "react";
import CheckCategoryPanel from "./CheckCategoryPanel";
import { useChecklistStore } from "./lib/ChecklistStore";
import { getChecklist } from "./lib/api";
import eventMgr from "./lib/eventMgr";
import { DisplayMode } from "./types";
import MyReactQuerySuspense from "./utils/MyReactQuerySuspense";

const ChecklistPanel: FC = () => {
  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["getChecklist"],
    queryFn: getChecklist,
  });

  useEffect(() => {
    const cb = eventMgr.addListener("checklist-refresh", () => {
      refetch();
    });

    return () => {
      eventMgr.removeListener("checklist-refresh", cb);
    };
  }, [refetch]);

  const displayMode = useChecklistStore((state) => state.displayMode);
  const setDisplayMode = useChecklistStore((state) => state.setDisplayMode);

  const checklist = data?.checklist;

  const handleDisplayModeChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setDisplayMode(
        event.target.checked ? DisplayMode.Edit : DisplayMode.View
      );
    },
    [setDisplayMode]
  );

  return (
    <div>
      <MyReactQuerySuspense isPending={isPending} error={error}>
        <div>{checklist?.title}</div>
        <FormControl as={SimpleGrid} columns={{ base: 2, lg: 4 }}>
          <FormLabel htmlFor="isDisplayModeChecked">Mode Edition:</FormLabel>
          <Switch
            id="isDisplayModeChecked"
            isChecked={displayMode === DisplayMode.Edit}
            onChange={handleDisplayModeChange}
          />
        </FormControl>

        <ul>
          {checklist?.categories.map((checklistCategory) => (
            <CheckCategoryPanel
              key={checklistCategory.id}
              checklistCategory={checklistCategory}
            />
          ))}
        </ul>
      </MyReactQuerySuspense>
    </div>
  );
};
export default ChecklistPanel;
