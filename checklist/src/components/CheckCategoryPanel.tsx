import { Box, Card, Stack } from "@chakra-ui/react";
import { DisplayMode } from "@src/types";
import { useChecklistStore, usePersistChecklistStore } from "@src/utils/ChecklistStore";
import { useMutation } from "@tanstack/react-query";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { RiMenuAddLine } from "react-icons/ri";
import { ChecklistCategory, ChecklistCategoryInput, ChecklistItemStatus } from "../../../common/checklistTypes";
import { addItem, updateCategory } from "../utils/api";
import "./CheckCategoryPanel.scss";
import CheckItemLine from "./CheckItemLine";
import MyIconButton from "./MyIconButton";
import ValidatedInput from "./ValidatedInput";
interface CheckCategoryPanelProps {
  checklistCategory: ChecklistCategory;
}

function CheckCategoryPanel({ checklistCategory }: CheckCategoryPanelProps) {
  const displayMode = usePersistChecklistStore((state) => state.displayMode);
  const [lastAddedItemId, setLastAddedItemId] = useState<number>(0);
  const currentListId = useChecklistStore((state) => state.currentListId);
  const searchFilter = useChecklistStore((state) => state.searchFilter);

  const updateCategoryMutation = useMutation({
    mutationFn: (checklistCategoryInput: Partial<ChecklistCategoryInput>) => {
      return updateCategory(currentListId, checklistCategory.id, checklistCategoryInput);
    },
  });

  const handleTitleInputValidated = useCallback(
    async (value: string) => {
      await updateCategoryMutation.mutateAsync({ title: value });
    },

    [updateCategoryMutation]
  );

  const handleAddClick = useCallback(async () => {
    const maxSortOrder = checklistCategory.items.reduce((max, item) => {
      if (item.sortOrder > max) {
        max = item.sortOrder;
      }
      return max;
    }, 0);

    const sortOrder = maxSortOrder ? maxSortOrder + 10 : checklistCategory.items.length * 10000;
    const { id } = await addItem(currentListId, {
      checked: ChecklistItemStatus.Checked,
      categoryId: checklistCategory.id,
      title: "",
      sortOrder,
    });
    setLastAddedItemId(id);
  }, [checklistCategory.id, checklistCategory.items, currentListId]);

  useEffect(() => {
    let tt: number = 0;
    if (lastAddedItemId) {
      tt = window.setTimeout(() => {
        setLastAddedItemId(0);
      }, 10000);
    }

    return () => {
      clearTimeout(tt);
    };
  }, [lastAddedItemId]);

  const itemLines = useMemo(() => {
    return checklistCategory.items?.map((checkItem) => {
      return (
        <CheckItemLine
          key={checkItem.id}
          id={checkItem.id}
          title={checkItem.title}
          checked={checkItem.checked}
          sortOrder={checkItem.sortOrder}
          isNewItem={checkItem.id === lastAddedItemId}
        />
      );
    });
  }, [checklistCategory.items, lastAddedItemId]);

  const hasNoCheckedItems = useMemo(() => {
    return !checklistCategory.items.some((i) => i.checked);
  }, [checklistCategory?.items]);

  const isHidden =
    displayMode === DisplayMode.View ? hasNoCheckedItems : !checklistCategory?.items?.length && searchFilter;

  return (
    <Card className={`checklist-category-panel ${isHidden ? "hidden" : ""}`} pb={1} bgColor="gray.700" my={2}>
      <Stack direction="row" borderRadius={5} py={0} px={2} alignItems="center">
        <ValidatedInput
          remoteValue={checklistCategory.title || ""}
          placeholder="Nom catégorie"
          onValidated={handleTitleInputValidated}
          color="teal.200"
          fontSize={"sm"}
          py={0}
        />
        {/* <Box>{checklistCategory.sortOrder}</Box> */}
        <MyIconButton ReactIcon={RiMenuAddLine} color="teal.300" onClick={handleAddClick} fontSize={26} />
      </Stack>
      <Box sx={{ px: 1 }}>{itemLines}</Box>
    </Card>
  );
}

export default memo(CheckCategoryPanel);
