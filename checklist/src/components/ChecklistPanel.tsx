import { Box, HStack, List } from "@chakra-ui/react";
import {
  ChecklistCategory,
  ChecklistCategoryInput,
  ChecklistItem,
  ChecklistItemInput,
  ChecklistListInput,
} from "@common/checklistTypes";
import { matchSearch } from "@common/stringUtils";
import { buildLinkPath } from "@src/AppRouter";
import { DisplayMode } from "@src/types";
import { useChecklistStore, usePersistChecklistStore } from "@src/utils/ChecklistStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { sortBy } from "lodash";
import { FC, memo, useCallback, useEffect, useMemo } from "react";
import { FaEdit, FaEye } from "react-icons/fa";
import { FaFolderPlus } from "react-icons/fa6";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import MyReactQuerySuspense from "../utils/MyReactQuerySuspense";
import { addCategory, getChecklist, updateItem, updateList } from "../utils/api";
import eventMgr, { CustomEventDetailsMoveItem, EventType } from "../utils/eventMgr";
import CheckCategoryPanel from "./CheckCategoryPanel";
import "./ChecklistPanel.scss";
import DeleteModal from "./DeleteModal";
import MyIconButton from "./MyIconButton";
import SearchInput from "./SearchInput";
import ValidatedInput from "./ValidatedInput";

const ChecklistPanel: FC = () => {
  const displayMode = usePersistChecklistStore((state) => state.displayMode);
  const setDisplayMode = usePersistChecklistStore((state) => state.setDisplayMode);
  const searchFilter = useChecklistStore((state) => state.searchFilter);
  const { lId } = useParams();
  const listId = Number(lId);

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["getChecklist"],
    queryFn: () => getChecklist(listId),
  });

  const updateListMutation = useMutation({
    mutationFn: (checklistInput: Partial<ChecklistListInput>) => {
      if (data?.checklist?.id) {
        return updateList(data.checklist.id, checklistInput);
      }
      return Promise.reject("No checklist id found");
    },
  });

  const addCategoryMutation = useMutation({
    mutationFn: (checklistCategoryInput: ChecklistCategoryInput) => {
      if (data?.checklist?.id) {
        return addCategory(data.checklist.id, checklistCategoryInput);
      }
      return Promise.reject("No checklist id found");
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({
      itemId,
      checklistCategoryInput,
    }: {
      itemId: number;
      checklistCategoryInput: Partial<ChecklistItemInput>;
    }) => {
      if (data?.checklist?.id) {
        return updateItem(data.checklist.id, itemId, checklistCategoryInput);
      }
      return Promise.reject("No checklist id found");
    },
  });

  const handleTitleInputValidated = useCallback(
    async (value: string) => {
      await updateListMutation.mutateAsync({ title: value });
    },

    [updateListMutation]
  );

  const handleEditModeClick = useCallback(() => {
    setDisplayMode(displayMode === DisplayMode.Edit ? DisplayMode.View : DisplayMode.Edit);
  }, [setDisplayMode, displayMode]);

  const handleAddACategoryClick = useCallback(async () => {
    const newSortOrder = data?.checklist?.categories.reduce((acc, cat) => Math.max(acc, cat.sortOrder), 0);
    await addCategoryMutation.mutateAsync({
      listId: data?.checklist?.id || 0,
      title: "Nouvelle catégorie",
      sortOrder: newSortOrder ? newSortOrder + 10000 : 0,
    });
  }, [addCategoryMutation, data?.checklist?.categories, data?.checklist?.id]);

  useEffect(() => {
    const cb = eventMgr.addListener(EventType.Refresh, () => {
      refetch();
    });

    return () => {
      eventMgr.removeListener(EventType.Refresh, cb);
    };
  }, [refetch]);

  useEffect(() => {
    if (data?.checklist?.title) {
      document.title = data?.checklist?.title;
    }
  }, [data?.checklist?.title]);

  const sortedAndFilteredCategories = useMemo(() => {
    const filteredCategories =
      data?.checklist?.categories.reduce<ChecklistCategory[]>((currentFilteredCategories, category) => {
        const filteredCategory = { ...category };

        filteredCategory.items = sortBy(filteredCategory.items, ["sortOrder", "id"]).reduce<ChecklistItem[]>(
          (filteredItems, item) => {
            if (matchSearch(searchFilter, item.title)) {
              filteredItems.push({ ...item });
            }

            return filteredItems;
          },
          []
        );

        currentFilteredCategories.push(filteredCategory);

        return currentFilteredCategories;
      }, []) || [];

    return sortBy(filteredCategories, ["sortOrder", "id"]);
  }, [data?.checklist?.categories, searchFilter]);

  const handleMoveItem = useCallback(
    async (itemId: number, isMovedUp: boolean) => {
      let itemIndex = -1;
      const checklistCategory = sortedAndFilteredCategories.find((c) => {
        itemIndex = c.items.findIndex((item) => item.id === itemId);
        return itemIndex >= 0;
      });
      if (!checklistCategory) {
        return;
      }
      if (itemIndex === -1) {
        console.error("CheckListPanel.tsx", "handleMoveItem", "item not found");
        return;
      }

      const currentOrder = checklistCategory.items[itemIndex].sortOrder;
      let newOrder = currentOrder;

      if (isMovedUp) {
        if (itemIndex === 0) {
          return;
        }
        const itemBefore = checklistCategory.items[itemIndex - 1];
        if (itemIndex === 1) {
          newOrder = itemBefore.sortOrder / 2;
        } else {
          const itemBeforeBefore = checklistCategory.items[itemIndex - 2];
          newOrder = (itemBeforeBefore.sortOrder + itemBefore.sortOrder) / 2;
        }
        if (newOrder === currentOrder) {
          // Should never occur but I see it
          newOrder -= 2;
        }
      } else {
        if (itemIndex >= checklistCategory.items.length - 1) {
          return;
        }
        const itemAfter = checklistCategory.items[itemIndex + 1];
        if (itemIndex >= checklistCategory.items.length - 2) {
          newOrder = itemAfter.sortOrder + 50;
        } else {
          const itemAfterAfter = checklistCategory.items[itemIndex + 2];
          newOrder = (itemAfter.sortOrder + itemAfterAfter.sortOrder) / 2;
          if (newOrder === currentOrder) {
            // Should never occur but I see it
            newOrder += 1;
          }
        }
      }
      // setLastMovedItemId(itemId);
      await updateItemMutation.mutateAsync({ itemId: itemId, checklistCategoryInput: { sortOrder: newOrder } });
    },
    [sortedAndFilteredCategories, updateItemMutation]
  );

  useEffect(() => {
    const cb = eventMgr.addListener(
      EventType.MoveItem,
      // @ts-expect-error to fix later
      ({ detail: { id, isUp } }: { detail: CustomEventDetailsMoveItem }) => {
        handleMoveItem(id, isUp);
      }
    );

    return () => {
      eventMgr.removeListener(EventType.MoveItem, cb);
    };
  }, [handleMoveItem]);
  const isEditMode = displayMode === DisplayMode.Edit;

  return (
    <Box className={`checklist-panel ${isEditMode ? "mode-edit" : "view-mode"}`} p={0} flexGrow={1} bgColor="gray.900">
      <MyReactQuerySuspense isPending={isPending} error={error}>
        <Box
          className="check-header"
          position={"fixed"}
          w="100%"
          maxW="2xl"
          bgColor="gray.900"
          pt={0}
          pb={2}
          sx={{ zIndex: 100, top: 0 }}
        >
          <HStack alignItems="center" px={1} pb={1}>
            <Box pt="5px">
              <Link to={buildLinkPath()}>
                <IoIosArrowDropleftCircle fontSize="35px" />
              </Link>
            </Box>
            <ValidatedInput
              remoteValue={data?.checklist?.title || ""}
              placeholder="Nom de la liste"
              onValidated={handleTitleInputValidated}
            />
          </HStack>
          <HStack justifyContent="space-between" px={2} gap={4}>
            <MyIconButton
              title={isEditMode ? "Mode Vue" : "Mode Edition"}
              ReactIcon={isEditMode ? FaEye : FaEdit}
              onClick={handleEditModeClick}
              fontSize={40}
            />

            <SearchInput />
            <MyIconButton
              title={"Ajouter une catégorie"}
              ReactIcon={FaFolderPlus}
              onClick={handleAddACategoryClick}
              fontSize={35}
            />
          </HStack>
        </Box>
        <List py="85px">
          {sortedAndFilteredCategories.map((category, idx) => {
            return <CheckCategoryPanel key={category.id} idx={idx} checklistCategory={category} listId={listId} />;
          })}
        </List>
      </MyReactQuerySuspense>
      <DeleteModal listId={listId} />
    </Box>
  );
};
export default memo(ChecklistPanel);
