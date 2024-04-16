import { Box, Button, Input } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
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
    <Box w={{ base: "100%", md: "800px" }} pb={2}>
      <Input
        size="sm"
        placeholder="Nom catégorie"
        value={categoryTitle}
        onChange={handleCategoryTitleChange}
        onBlur={handleCategoryTitleBlur}
        readOnly={!isEditMode}
        sx={{ bg: "black", color: "white", border: !isEditMode ? "none" : "" }}
      />
      <Button onClick={handleAddClick}>Ajouter un produit</Button>
      <Box sx={{ px: 1 }}>{filteredCheckItemLines}</Box>
    </Box>
  );
}
