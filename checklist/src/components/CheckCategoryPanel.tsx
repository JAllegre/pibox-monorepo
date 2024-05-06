import { Box, Card, Input, Stack } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import React, { useCallback, useEffect, useState } from "react";
import { RiMenuAddLine } from "react-icons/ri";
import { ChecklistCategory, ChecklistCategoryInput, ChecklistItemStatus } from "../../../common/checklistTypes";
import { DisplayMode } from "../types";
import { useChecklistStore } from "../utils/ChecklistStore";
import { addItem, updateCategory, updateItem } from "../utils/api";
import eventMgr from "../utils/eventMgr";
import CheckItemLine from "./CheckItemLine";
import { MyIconButton } from "./MyIconButton";

interface CheckCategoryPanelProps {
  checklistCategory: ChecklistCategory;
}

export default function CheckCategoryPanel({ checklistCategory }: CheckCategoryPanelProps) {
  const [categoryTitle, setCategoryTitle] = useState(checklistCategory.title);
  const [lastAddedItemId, setLastAddedItemId] = useState<number>(0);
  const [lastModifiedItemId, setLastModifiedItemId] = useState<number>(0);

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

  const isEditMode = useChecklistStore((state) => state.displayMode === DisplayMode.Edit);

  const handleCategoryTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryTitle(e.target.value);
  };

  const handleCategoryTitleBlur = async () => {
    await updateCategoryMutation.mutateAsync({ title: categoryTitle });
    eventMgr.dispatch("checklist-refresh");
  };

  const handleAddClick = useCallback(async () => {
    const lastItem = checklistCategory.items[checklistCategory.items.length - 1];
    const sortOrder = lastItem?.sortOrder + 10 || 50;
    const { id } = await addItem({
      checkStatus: ChecklistItemStatus.SelectedChecked,
      categoryId: checklistCategory.id,
      title: "",
      sortOrder,
    });
    eventMgr.dispatch("checklist-refresh");
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
      setLastModifiedItemId(itemId);
      await updateItemMutation.mutateAsync({ itemId, sortOrder: newOrder });
      eventMgr.dispatch("checklist-refresh");
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
    if (lastModifiedItemId) {
      tt = window.setTimeout(() => {
        setLastModifiedItemId(0);
      }, 5000);
    }

    return () => {
      clearTimeout(tt);
    };
  }, [lastAddedItemId, lastModifiedItemId]);

  const itemLines = checklistCategory.items?.map((checkItem) => {
    return (
      <CheckItemLine
        key={checkItem.id}
        checkItem={checkItem}
        isNewItem={checkItem.id === lastAddedItemId}
        isMovedItem={checkItem.id === lastModifiedItemId}
        onMove={handleMoveItem}
      />
    );
  });

  return (
    <Card className="checklist-category-panel" pb={1} bgColor="gray.900" my={2}>
      <Stack direction="row" borderRadius={5} py={0} px={2} alignItems="center">
        <Input
          size="xs"
          placeholder="Nom catégorie"
          value={categoryTitle}
          onChange={handleCategoryTitleChange}
          onBlur={handleCategoryTitleBlur}
          readOnly={!isEditMode}
          sx={{
            border: !isEditMode ? "none" : "",
          }}
          color="teal.200"
          fontSize={"md"}
        />
        <MyIconButton
          ReactIcon={RiMenuAddLine}
          color="teal.300"
          display={isEditMode ? "" : "none"}
          onClick={handleAddClick}
          fontSize={26}
        />
      </Stack>
      <Box sx={{ px: 1 }}>{itemLines}</Box>
    </Card>
  );
}
