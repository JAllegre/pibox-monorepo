import { Box } from "@chakra-ui/react";
import CheckItemLine from "./CheckItemLine";
import { CheckListCategory } from "../../common/checkListTypes";

interface CheckCategoryPanelProps {
  checkListCategory: CheckListCategory;
}
export default function CheckCategoryPanel({
  checkListCategory,
}: CheckCategoryPanelProps) {
  return (
    <Box w={{ base: "100%", md: "800px" }}>
      <Box>{checkListCategory.title}</Box>
      <Box>
        {checkListCategory.items.map((checkItem) => (
          <CheckItemLine key={checkItem.id} checkItem={checkItem} />
        ))}
      </Box>
    </Box>
  );
}
