import { Box, HStack } from "@chakra-ui/react";
import { ChecklistCategory, ChecklistInput, ChecklistItem } from "@common/checklistTypes";
import { matchSearch } from "@common/stringUtils";
import { DisplayMode } from "@src/types";
import { useChecklistStore } from "@src/utils/ChecklistStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { sortBy } from "lodash";
import { FC, useCallback, useEffect, useMemo } from "react";
import MyReactQuerySuspense from "../utils/MyReactQuerySuspense";
import { getChecklist, updateList } from "../utils/api";
import eventMgr from "../utils/eventMgr";
import CheckCategoryPanel from "./CheckCategoryPanel";
import ValidatedInput from "./ValidatedInput";

const ChecklistPanel: FC = () => {
  const isEditMode = useChecklistStore((state) => state.displayMode === DisplayMode.Edit);

  const searchFilter = useChecklistStore((state) => state.searchFilter);

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["getChecklist"],
    queryFn: getChecklist,
  });

  const updateListMutation = useMutation({
    mutationFn: (checklistInput: Partial<ChecklistInput>) => {
      if (data?.checklist?.id) {
        return updateList(data?.checklist?.id, checklistInput);
      }
      return Promise.reject("No checklist id found");
    },
  });

  const handleTitleInputValidated = useCallback(
    async (value: string) => {
      await updateListMutation.mutateAsync({ title: value });
      eventMgr.dispatch("checklist-refresh");
    },

    [updateListMutation]
  );

  useEffect(() => {
    const cb = eventMgr.addListener("checklist-refresh", () => {
      refetch();
    });

    return () => {
      eventMgr.removeListener("checklist-refresh", cb);
    };
  }, [refetch]);

  useEffect(() => {
    if (data?.checklist?.title) {
      document.title = data?.checklist?.title;
    }
  }, [data?.checklist?.title]);

  const filteredCategories = useMemo(() => {
    return (
      data?.checklist?.categories.reduce<ChecklistCategory[]>((filteredCategories, category) => {
        const filteredCategory = { ...category };

        filteredCategory.items = sortBy(filteredCategory.items, ["sortOrder", "id"]).reduce<ChecklistItem[]>(
          (filteredItems, item) => {
            if (matchSearch(searchFilter, item.title) && (isEditMode || item.checked)) {
              filteredItems.push({ ...item });
            }

            return filteredItems;
          },
          []
        );

        if (filteredCategory.items.length > 0) {
          filteredCategories.push(filteredCategory);
        }
        return filteredCategories;
      }, []) || []
    );
  }, [data, searchFilter, isEditMode]);

  return (
    <Box className="checklist-panel" bgColor="gray.700" px={2} flexGrow={1} pb="60px">
      <MyReactQuerySuspense isPending={isPending} error={error}>
        <HStack justifyContent="space-between" py={2}>
          <ValidatedInput
            defaultValue={data?.checklist?.title || ""}
            placeholder="Nom de la liste"
            onValidated={handleTitleInputValidated}
            color="teal.200"
            fontSize={"2xl"}
            fontWeight={"bold"}
          />
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
