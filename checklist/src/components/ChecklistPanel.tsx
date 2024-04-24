import { Box, HStack, Heading, Switch, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, FC, useCallback, useEffect } from "react";
import { DisplayMode } from "../types";
import { useChecklistStore } from "../utils/ChecklistStore";
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

  const isEditMode = useChecklistStore(
    (state) => state.displayMode === DisplayMode.Edit
  );
  const setDisplayMode = useChecklistStore((state) => state.setDisplayMode);

  const checklist = data?.checklist;

  const handleDisplayModeChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setDisplayMode(
        event.target.checked ? DisplayMode.Edit : DisplayMode.View
      );
    },
    [setDisplayMode]
  );

  return (
    <Box bgColor="gray.700" px={3}>
      <MyReactQuerySuspense isPending={isPending} error={error}>
        <HStack justifyContent="space-between" py={2}>
          <Heading as="h1" size="lg">
            {checklist?.title}
          </Heading>
          <HStack justifyContent="space-between">
            <Text>Edition:</Text>
            <Switch
              size="lg"
              isChecked={isEditMode}
              onChange={handleDisplayModeChange}
            />
          </HStack>
        </HStack>
        <ul>
          {checklist?.categories.map((checklistCategory) => {
            return (
              <CheckCategoryPanel
                key={checklistCategory.id}
                checklistCategory={checklistCategory}
              />
            );
          })}
        </ul>
      </MyReactQuerySuspense>
    </Box>
  );
};
export default ChecklistPanel;
