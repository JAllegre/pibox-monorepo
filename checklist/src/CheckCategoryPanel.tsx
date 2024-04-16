import { Box, Input } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  ChecklistCategory,
  ChecklistCategoryInput,
  ChecklistItemStatus,
} from "../../common/checklistTypes";
import CheckItemLine from "./CheckItemLine";
import { useChecklistStore } from "./lib/ChecklistStore";
import { updateCategory } from "./lib/api";
import eventMgr from "./lib/eventMgr";
import { DisplayMode } from "./types";

interface CheckCategoryPanelProps {
  checklistCategory: ChecklistCategory;
}
export default function CheckCategoryPanel({
  checklistCategory,
}: CheckCategoryPanelProps) {
  const [categoryTitle, setCategoryTitle] = useState(checklistCategory.title);

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

  const filteredCheckItemLines = checklistCategory.items?.reduce<
    React.ReactNode[]
  >((accu, checkItem) => {
    if (isEditMode || checkItem.checkStatus > ChecklistItemStatus.Unselected) {
      accu.push(<CheckItemLine key={checkItem.id} checkItem={checkItem} />);
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
      <Box sx={{ px: 1 }}>{filteredCheckItemLines}</Box>
    </Box>
  );
}

//!isEditMode ? { border: "none", paddingLeft: 0 } : {}
