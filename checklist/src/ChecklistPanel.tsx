import { Box, HStack, Heading, Switch, Text } from "@chakra-ui/react";
import { ChecklistItemStatus } from "@common/checklistTypes";
import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, FC, useCallback, useEffect } from "react";
import CheckCategoryPanel from "./CheckCategoryPanel";
import { useChecklistStore } from "./lib/ChecklistStore";
import { getChecklist } from "./lib/api";
import eventMgr from "./lib/eventMgr";
import { DisplayMode } from "./types";
import MyReactQuerySuspense from "./utils/MyReactQuerySuspense";

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
          {checklist?.categories.reduce<React.ReactNode[]>(
            (accu, checklistCategory) => {
              if (
                isEditMode ||
                (checklistCategory.items.length > 0 &&
                  checklistCategory.items.some(
                    (item) => item.checkStatus > ChecklistItemStatus.Unselected
                  ))
              ) {
                accu.push(
                  <CheckCategoryPanel
                    key={checklistCategory.id}
                    checklistCategory={checklistCategory}
                  />
                );
              }

              return accu;
            },
            []
          )}
        </ul>
      </MyReactQuerySuspense>
    </Box>
  );
};
export default ChecklistPanel;
