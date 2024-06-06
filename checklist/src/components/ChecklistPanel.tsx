import { Box, HStack, List } from "@chakra-ui/react";
import { ChecklistCategory, ChecklistInput, ChecklistItem } from "@common/checklistTypes";
import { matchSearch } from "@common/stringUtils";
import { DisplayMode } from "@src/types";
import { useChecklistStore } from "@src/utils/ChecklistStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { sortBy } from "lodash";
import { FC, useCallback, useEffect, useMemo } from "react";
import { FaEdit } from "react-icons/fa";
import MyReactQuerySuspense from "../utils/MyReactQuerySuspense";
import { getChecklist, updateList } from "../utils/api";
import eventMgr from "../utils/eventMgr";
import CheckCategoryPanel from "./CheckCategoryPanel";
import { MyIconButton } from "./MyIconButton";
import SearchInput from "./SearchInput";
import ValidatedInput from "./ValidatedInput";

const ChecklistPanel: FC = () => {
  const isEditMode = useChecklistStore((state) => state.displayMode === DisplayMode.Edit);

  const searchFilter = useChecklistStore((state) => state.searchFilter);
  const setDisplayMode = useChecklistStore((state) => state.setDisplayMode);

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

  const handleEditModeClick = useCallback(() => {
    setDisplayMode(isEditMode ? DisplayMode.View : DisplayMode.Edit);
  }, [setDisplayMode, isEditMode]);

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
    <Box className="checklist-panel" p={0} flexGrow={1} bgColor="gray.900">
      <MyReactQuerySuspense isPending={isPending} error={error}>
        <HStack
          justifyContent="space-between"
          py={1}
          px={1}
          gap={4}
          position={"fixed"}
          w="100%"
          maxW="2xl"
          bgColor="gray.900"
          sx={{ zIndex: 100, top: 0 }}
        >
          <ValidatedInput
            defaultValue={data?.checklist?.title || ""}
            placeholder="Nom de la liste"
            onValidated={handleTitleInputValidated}
            color="teal.200"
            fontSize={"2xl"}
            fontWeight={"bold"}
          />
          <MyIconButton
            ReactIcon={FaEdit}
            color={isEditMode ? "teal.300" : "gray.600"}
            onClick={handleEditModeClick}
            fontSize={30}
          />
          <SearchInput />
        </HStack>
        <List py="44px">
          {filteredCategories.map((checklistCategory) => {
            return <CheckCategoryPanel key={checklistCategory.id} checklistCategory={checklistCategory} />;
          })}
        </List>
      </MyReactQuerySuspense>
    </Box>
  );
};
export default ChecklistPanel;
