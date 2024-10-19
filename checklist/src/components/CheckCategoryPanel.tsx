import { Box, Card, Stack } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { RiMenuAddLine } from "react-icons/ri";
import { ChecklistCategory, ChecklistCategoryInput, ChecklistItemStatus } from "../../../common/checklistTypes";
import { addItem, updateCategory, updateItem } from "../utils/api";
import "./CheckCategoryPanel.scss";
import CheckItemLine from "./CheckItemLine";
import MyIconButton from "./MyIconButton";
import ValidatedInput from "./ValidatedInput";
interface CheckCategoryPanelProps {
  checklistCategory: ChecklistCategory;
}

function CheckCategoryPanel({ checklistCategory }: CheckCategoryPanelProps) {
  const [lastAddedItemId, setLastAddedItemId] = useState<number>(0);
  const [lastMovedItemId, setLastMovedItemId] = useState<number>(0);

  const updateCategoryMutation = useMutation({
    mutationFn: (checklistCategoryInput: Partial<ChecklistCategoryInput>) => {
      return updateCategory(checklistCategory.id, checklistCategoryInput);
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ itemId, sortOrder }: { itemId: number; sortOrder: number }) => {
      return updateItem(itemId, { sortOrder });
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
    const { id } = await addItem({
      checked: ChecklistItemStatus.Checked,
      categoryId: checklistCategory.id,
      title: "",
      sortOrder,
    });
    setLastAddedItemId(id);
  }, [checklistCategory.id, checklistCategory.items]);

  const handleMoveItem = useCallback(
    async (itemId: number, isMovedUp: boolean) => {
      const itemIndex = checklistCategory.items.findIndex((item) => item.id === itemId);
      if (itemIndex === -1) {
        console.error("CheckCategoryPanel.tsx", "handleMoveItem", "item not found");
        return;
      }
      let newOrder = checklistCategory.items[itemIndex].sortOrder;
      if (isMovedUp) {
        if (itemIndex === 0) {
          return;
        }
        const itemBefore = checklistCategory.items[itemIndex - 1];
        if (itemIndex === 1) {
          newOrder = itemBefore.sortOrder / 2;
        } else {
          const itemBeforeBefore = checklistCategory.items[itemIndex - 2];
          newOrder = (itemBeforeBefore.sortOrder + itemBefore.sortOrder) / 2;
        }
      } else {
        if (itemIndex >= checklistCategory.items.length - 1) {
          return;
        }
        const itemAfter = checklistCategory.items[itemIndex + 1];
        if (itemIndex >= checklistCategory.items.length - 2) {
          newOrder = itemAfter.sortOrder + 50;
        } else {
          const itemAfterAfter = checklistCategory.items[itemIndex + 2];
          newOrder = (itemAfter.sortOrder + itemAfterAfter.sortOrder) / 2;
        }
      }
      setLastMovedItemId(itemId);
      await updateItemMutation.mutateAsync({ itemId, sortOrder: newOrder });
    },
    [checklistCategory.items, updateItemMutation]
  );

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

  useEffect(() => {
    let tt: number = 0;
    if (lastMovedItemId) {
      tt = window.setTimeout(() => {
        setLastMovedItemId(0);
      }, 5000);
    }

    return () => {
      clearTimeout(tt);
    };
  }, [lastMovedItemId]);

  const itemLines = useMemo(() => {
    return checklistCategory.items?.map((checkItem) => {
      return (
        <CheckItemLine
          key={"" + checkItem.id + ""}
          id={checkItem.id}
          title={checkItem.title}
          checked={checkItem.checked}
          isNewItem={checkItem.id === lastAddedItemId}
          isModifiedItem={checkItem.id === lastMovedItemId}
          onMove={handleMoveItem}
        />
      );
    });
  }, [checklistCategory.items, handleMoveItem, lastAddedItemId, lastMovedItemId]);

  // console.log(
  //   "@@@@@@ju@@@@@CheckCategoryPanel.tsx/136",
  //   checklistCategory?.id,
  //   checklistCategory?.title,
  //   checklistCategory.items[0]
  // );
  const isEmpty = useMemo(() => {
    return !checklistCategory.items.some((i) => i.checked);
  }, [checklistCategory?.items]);

  return (
    <Card className={`checklist-category-panel ${isEmpty ? "empty" : ""}`} pb={1} bgColor="gray.700" my={2}>
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
