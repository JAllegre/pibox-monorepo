import { Box, Card, Input, Stack } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import { RiMenuAddLine } from "react-icons/ri";
import { ChecklistCategory, ChecklistCategoryInput, ChecklistItemStatus } from "../../../common/checklistTypes";
import { DisplayMode } from "../types";
import { useChecklistStore } from "../utils/ChecklistStore";
import { addItem, updateCategory } from "../utils/api";
import eventMgr from "../utils/eventMgr";
import CheckItemLine from "./CheckItemLine";

interface CheckCategoryPanelProps {
  checklistCategory: ChecklistCategory;
}
export default function CheckCategoryPanel({ checklistCategory }: CheckCategoryPanelProps) {
  const [categoryTitle, setCategoryTitle] = useState(checklistCategory.title);
  const [lastAddedItemId, setLastAddedItemId] = useState<number>(0);

  const updateCategoryMutation = useMutation({
    mutationFn: (checklistCategoryInput: Partial<ChecklistCategoryInput>) => {
      return updateCategory(checklistCategory.id, checklistCategoryInput);
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
    const { id } = await addItem({
      checkStatus: ChecklistItemStatus.SelectedChecked,
      categoryId: checklistCategory.id,
      title: "Nouveau",
    });
    eventMgr.dispatch("checklist-refresh");
    setLastAddedItemId(id);
  }, [checklistCategory.id]);

  const filteredCheckItemLines = checklistCategory.items?.map((checkItem) => {
    return <CheckItemLine key={checkItem.id} checkItem={checkItem} isNewItem={checkItem.id === lastAddedItemId} />;
  });

  const displayMe =
    isEditMode || (checklistCategory.items.length > 0 && checklistCategory.items.some((item) => item.checkStatus > ChecklistItemStatus.Unselected));
  return (
    <Card pb={1} bgColor="gray.900" my={2} style={{ display: displayMe ? "" : "none" }}>
      <Stack direction="row" borderRadius={5} py={1} px={2} alignItems="center">
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
        {isEditMode && (
          <Box
            color="teal.300"
            onClick={handleAddClick}
            sx={{
              "&:hover": {
                color: "teal.50",
              },
            }}
            cursor="pointer"
          >
            <RiMenuAddLine fontSize="30px" />
          </Box>
        )}
      </Stack>
      <Box sx={{ px: 1 }}>{filteredCheckItemLines}</Box>
    </Card>
  );
}
