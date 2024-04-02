import { Box } from "@chakra-ui/react";
import CheckItemLine from "./CheckItemLine";
import { ChecklistCategory } from "../../common/checklistTypes";

interface CheckCategoryPanelProps {
  checklistCategory: ChecklistCategory;
}
export default function CheckCategoryPanel({
  checklistCategory,
}: CheckCategoryPanelProps) {
  return (
    <Box w={{ base: "100%", md: "800px" }}>
      <Box>{checklistCategory.title}</Box>
      <Box>
        {checklistCategory.items.map((checkItem) => (
          <CheckItemLine key={checkItem.id} checkItem={checkItem} />
        ))}
      </Box>
    </Box>
  );
}
