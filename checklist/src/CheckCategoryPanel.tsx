import { Box, Card, Input, Stack } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import { RiMenuAddLine } from "react-icons/ri";
import {
  ChecklistCategory,
  ChecklistCategoryInput,
  ChecklistItemStatus,
} from "../../common/checklistTypes";
import CheckItemLine from "./CheckItemLine";
import { useChecklistStore } from "./lib/ChecklistStore";
import { addItem, updateCategory } from "./lib/api";
import eventMgr from "./lib/eventMgr";
import { DisplayMode } from "./types";

interface CheckCategoryPanelProps {
  checklistCategory: ChecklistCategory;
}
export default function CheckCategoryPanel({
  checklistCategory,
}: CheckCategoryPanelProps) {
  const [categoryTitle, setCategoryTitle] = useState(checklistCategory.title);
  const [lastAddedItemId, setLastAddedItemId] = useState<number>(0);

  const updateCategoryMutation = useMutation({
    mutationFn: (checklistCategoryInput: Partial<ChecklistCategoryInput>) => {
      return updateCategory(checklistCategory.id, checklistCategoryInput);
    },
  });
  const isEditMode = useChecklistStore(
    (state) => state.displayMode === DisplayMode.Edit
  );

  const handleCategoryTitleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
      subtitle: "",
    });
    eventMgr.dispatch("checklist-refresh");
    setLastAddedItemId(id);
  }, [checklistCategory.id]);

  const filteredCheckItemLines = checklistCategory.items?.reduce<
    React.ReactNode[]
  >((accu, checkItem) => {
    if (isEditMode || checkItem.checkStatus > ChecklistItemStatus.Unselected) {
      accu.push(
        <CheckItemLine
          key={checkItem.id}
          checkItem={checkItem}
          isNewItem={checkItem.id === lastAddedItemId}
        />
      );
    }

    return accu;
  }, []);

  return (
    <Card w={{ base: "100%", md: "800px" }} pb={1} bgColor="gray.900" my={2}>
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
          // <Button onClick={handleAddClick}>Ajouter un produit</Button>
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
