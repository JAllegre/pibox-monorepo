import { Box, Input } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
  ChecklistCategory,
  ChecklistCategoryInput,
} from "../../common/checklistTypes";
import CheckItemLine from "./CheckItemLine";
import { updateCategory } from "./lib/api";

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

  const handleCategoryTitleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCategoryTitle(e.target.value);
  };

  const handleCategoryTitleBlur = () => {
    updateCategoryMutation.mutate({ title: categoryTitle });
  };

  return (
    <Box w={{ base: "100%", md: "800px" }}>
      <Box>{checklistCategory.title}</Box>
      <Input
        placeholder="Nom catégorie"
        value={categoryTitle}
        onChange={handleCategoryTitleChange}
        onBlur={handleCategoryTitleBlur}
      />
      <Box>
        {checklistCategory.items.map((checkItem) => (
          <CheckItemLine key={checkItem.id} checkItem={checkItem} />
        ))}
      </Box>
    </Box>
  );
}
