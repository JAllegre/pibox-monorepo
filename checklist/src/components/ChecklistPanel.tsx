import { Box, HStack, Heading } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { FC, useEffect } from "react";
import MyReactQuerySuspense from "../utils/MyReactQuerySuspense";
import { getChecklist } from "../utils/api";
import eventMgr from "../utils/eventMgr";
import CheckCategoryPanel from "./CheckCategoryPanel";

const ChecklistPanel: FC = () => {
  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["getChecklist"],
    queryFn: getChecklist,
  });

  useEffect(() => {
    const cb = eventMgr.addListener("checklist-refresh", () => {
      refetch();
    });

    return () => {
      eventMgr.removeListener("checklist-refresh", cb);
    };
  }, [refetch]);

  const checklist = data?.checklist;

  return (
    <Box bgColor="gray.700" px={2} className="checklist-panel" flexGrow={1}>
      <MyReactQuerySuspense isPending={isPending} error={error}>
        <HStack justifyContent="space-between" py={2}>
          <Heading as="h1" size="lg">
            {checklist?.title}
          </Heading>
        </HStack>
        <ul>
          {checklist?.categories.map((checklistCategory) => {
            return <CheckCategoryPanel key={checklistCategory.id} checklistCategory={checklistCategory} />;
          })}
        </ul>
      </MyReactQuerySuspense>
    </Box>
  );
};
export default ChecklistPanel;
