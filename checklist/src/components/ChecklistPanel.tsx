import { Box, HStack, Heading } from "@chakra-ui/react";
import { ChecklistCategory, ChecklistItem, ChecklistItemStatus } from "@common/checklistTypes";
import { matchSearch } from "@common/stringUtils";
import { DisplayMode } from "@src/types";
import { useChecklistStore } from "@src/utils/ChecklistStore";
import { useQuery } from "@tanstack/react-query";
import { FC, useEffect, useMemo } from "react";
import MyReactQuerySuspense from "../utils/MyReactQuerySuspense";
import { getChecklist } from "../utils/api";
import eventMgr from "../utils/eventMgr";
import CheckCategoryPanel from "./CheckCategoryPanel";

const ChecklistPanel: FC = () => {
  const isEditMode = useChecklistStore((state) => state.displayMode === DisplayMode.Edit);

  const searchFilter = useChecklistStore((state) => state.searchFilter);

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

  const filteredCategories = useMemo(() => {
    return (
      data?.checklist?.categories.reduce<ChecklistCategory[]>((filteredCategories, category) => {
        const filteredCategory = { ...category };

        filteredCategory.items = filteredCategory.items.reduce<ChecklistItem[]>((filteredItems, item) => {
          if (
            matchSearch(searchFilter, item.title) &&
            (isEditMode || item.checkStatus > ChecklistItemStatus.Unselected)
          ) {
            filteredItems.push({ ...item });
          }

          return filteredItems;
        }, []);

        if (filteredCategory.items.length > 0) {
          filteredCategories.push(filteredCategory);
        }
        return filteredCategories;
      }, []) || []
    );
  }, [data, searchFilter, isEditMode]);

  return (
    <Box bgColor="gray.700" px={2} className="checklist-panel" flexGrow={1}>
      <MyReactQuerySuspense isPending={isPending} error={error}>
        <HStack justifyContent="space-between" py={2}>
          <Heading as="h1" size="lg">
            {data?.checklist?.title || ""}
          </Heading>
        </HStack>
        <ul>
          {filteredCategories.map((checklistCategory) => {
            return <CheckCategoryPanel key={checklistCategory.id} checklistCategory={checklistCategory} />;
          })}
        </ul>
      </MyReactQuerySuspense>
    </Box>
  );
};
export default ChecklistPanel;
