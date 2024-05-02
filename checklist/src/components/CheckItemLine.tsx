import { Box, Card, CardBody, Input, Stack, Switch } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { ChecklistItem, ChecklistItemInput, ChecklistItemStatus } from "../../../common/checklistTypes";
import { DisplayMode } from "../types";
import { useChecklistStore } from "../utils/ChecklistStore";
import { updateItem } from "../utils/api";
import eventMgr from "../utils/eventMgr";
import { MyIconButton } from "./MyIconButton";
interface CheckItemLineProps {
  checkItem: ChecklistItem;
  isNewItem?: boolean;
}

export default function CheckItemLine({ checkItem, isNewItem }: CheckItemLineProps) {
  const [title, setTitle] = useState(checkItem.title);
  const [isNew, setIsNew] = useState(isNewItem);
  const [isItemChecked, setIsItemChecked] = useState(checkItem.checkStatus > ChecklistItemStatus.Unselected);
  const cardRef = useRef<HTMLDivElement>(null);
  const isEditMode = useChecklistStore((state) => state.displayMode === DisplayMode.Edit);
  const setItemIdToDelete = useChecklistStore((state) => state.setItemIdToDelete);

  const updateItemMutation = useMutation({
    mutationFn: (checklistCategoryInput: Partial<ChecklistItemInput>) => {
      return updateItem(checkItem.id, checklistCategoryInput);
    },
  });

  const handleCheckSwitch = async (event: ChangeEvent<HTMLInputElement>) => {
    // Want to update the local state immediately
    setIsItemChecked(event.target.checked);
    setTimeout(() => {
      updateItemMutation
        .mutateAsync({
          checkStatus: event.target.checked ? 2 : 0,
        })
        .then(() => {
          eventMgr.dispatch("checklist-refresh");
        });
    }, 1);
  };

  useEffect(() => {
    // reset to the remote state when changed
    setIsItemChecked(checkItem.checkStatus > ChecklistItemStatus.Unselected);
  }, [checkItem.checkStatus]);

  const handleTitleChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      setTitle(event.target.value);
    },
    [setTitle]
  );

  const handleTitleBlur = useCallback(async () => {
    if (title === checkItem.title) {
      return;
    }
    await updateItemMutation.mutateAsync({
      title,
    });
    eventMgr.dispatch("checklist-refresh");
  }, [checkItem.title, title, updateItemMutation]);

  useEffect(() => {
    let tt: number = 0;
    if (isNew) {
      cardRef.current?.scrollIntoView({ block: "center" });
      tt = window.setTimeout(() => {
        setIsNew(false);
      }, 10000);
    }

    return () => {
      clearTimeout(tt);
    };
  }, [checkItem.id, isNew]);

  const handleDeleteClick = useCallback(async () => {
    setItemIdToDelete(checkItem.id);
  }, [setItemIdToDelete, checkItem.id]);

  return (
    <Card ref={cardRef} my="1" bgColor={isNew ? "teal.700" : "gray.600"} color="teal.50">
      <CardBody px={2} py={1}>
        <Stack direction="row" alignItems="center" gap={1}>
          <Box>
            <Switch isChecked={isItemChecked} onChange={handleCheckSwitch} size="md" />
          </Box>
          <Input
            size="sm"
            p={1}
            placeholder="Entrez un nom"
            value={title || ""}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            readOnly={!isEditMode}
            sx={{ border: !isEditMode ? "none" : "" }}
            flexGrow={1}
          />
          <MyIconButton
            ReactIcon={FaRegTrashAlt}
            color="red.400"
            display={isEditMode ? "" : "none"}
            onClick={handleDeleteClick}
            fontSize={20}
          />
        </Stack>
      </CardBody>
    </Card>
  );
}
