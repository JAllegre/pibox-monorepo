import { Box, Card, Stack } from "@chakra-ui/react";
import { DisplayMode } from "@src/types";
import { useChecklistStore, usePersistChecklistStore } from "@src/utils/ChecklistStore";
import { useMutation } from "@tanstack/react-query";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { RiMenuAddLine } from "react-icons/ri";
import { ChecklistCategory, ChecklistCategoryInput, ChecklistItemStatus } from "../../../common/checklistTypes";
import { addItem, updateCategory } from "../utils/api";
import "./CheckCategoryPanel.scss";
import CheckItemLine from "./CheckItemLine";
import DeleteCategoryModal from "./DeleteCategoryModal";
import MyIconButton from "./MyIconButton";
import ValidatedInput from "./ValidatedInput";

interface CheckCategoryPanelProps {
  checklistCategory: ChecklistCategory;
  listId: number;
  idx: number;
}

function CheckCategoryPanel({ checklistCategory, listId }: CheckCategoryPanelProps) {
  const displayMode = usePersistChecklistStore((state) => state.displayMode);
  const [lastAddedItemId, setLastAddedItemId] = useState<number>(0);
  const searchFilter = useChecklistStore((state) => state.searchFilter);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const updateCategoryMutation = useMutation({
    mutationFn: (checklistCategoryInput: Partial<ChecklistCategoryInput>) => {
      return updateCategory(listId, checklistCategory.id, checklistCategoryInput);
    },
  });

  const handleTitleInputValidated = useCallback(
    async (value: string) => {
      await updateCategoryMutation.mutateAsync({ title: value });
    },

    [updateCategoryMutation]
  );

  const handleAddClick = useCallback(async () => {
    const maxSortOrder = checklistCategory.items.reduce((max, item) => {
      if (item.sortOrder > max) {
        max = item.sortOrder;
      }
      return max;
    }, 0);

    const sortOrder = maxSortOrder ? maxSortOrder + 10 : checklistCategory.items.length * 10000;
    const { id } = await addItem(listId, {
      checked: ChecklistItemStatus.Checked,
      categoryId: checklistCategory.id,
      title: "",
      sortOrder,
    });
    setLastAddedItemId(id);
  }, [checklistCategory.id, checklistCategory.items, listId]);

  const handleDeleteClick = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const onCloseDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  useEffect(() => {
    let tt: number = 0;
    if (lastAddedItemId) {
      tt = window.setTimeout(() => {
        setLastAddedItemId(0);
      }, 10000);
    }

    return () => {
      clearTimeout(tt);
    };
  }, [lastAddedItemId]);

  const hasNoCheckedItems = useMemo(() => {
    return !checklistCategory.items.some((i) => i.checked);
  }, [checklistCategory?.items]);

  const isHidden =
    displayMode === DisplayMode.View ? hasNoCheckedItems : !checklistCategory?.items?.length && searchFilter;

  return (
    <>
      <Card className={`checklist-category-panel ${isHidden ? "hidden" : ""}`} pb={1} bgColor="gray.700" my={2}>
        <Stack direction="row" borderRadius={5} py={0} px={2} alignItems="center">
          <ValidatedInput
            remoteValue={checklistCategory.title || ""}
            placeholder="Nom catégorie"
            onValidated={handleTitleInputValidated}
            color="teal.200"
            fontSize={"sm"}
            py={0}
          />
          <MyIconButton ReactIcon={RiMenuAddLine} color="teal.300" onClick={handleAddClick} fontSize={26} />
          <MyIconButton ReactIcon={FaRegTrashAlt} color="red.400" onClick={handleDeleteClick} fontSize={20} />
        </Stack>
        <Box sx={{ px: 1 }}>
          {checklistCategory.items?.map((item) => {
            return (
              <CheckItemLine
                key={item.id}
                id={item.id}
                checked={item.checked}
                title={item.title}
                sortOrder={item.sortOrder}
                isNewItem={item.id === lastAddedItemId}
                listId={listId}
              />
            );
          })}
        </Box>
      </Card>
      <DeleteCategoryModal
        listId={listId}
        categoryId={showDeleteModal ? checklistCategory.id : 0}
        onClose={onCloseDeleteModal}
      />
    </>
  );
}

export default memo(CheckCategoryPanel);
