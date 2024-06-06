import { Box, Card, CardBody, Stack, Switch } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { FaArrowAltCircleDown, FaArrowAltCircleUp, FaRegTrashAlt } from "react-icons/fa";
import { ChecklistItem, ChecklistItemInput } from "../../../common/checklistTypes";
import { DisplayMode } from "../types";
import { useChecklistStore } from "../utils/ChecklistStore";
import { updateItem } from "../utils/api";
import eventMgr from "../utils/eventMgr";
import { MyIconButton } from "./MyIconButton";
import ValidatedInput from "./ValidatedInput";

interface CheckItemLineProps {
  checkItem: ChecklistItem;
  isNewItem?: boolean;
  isMovedItem?: boolean;
  onMove: (itemId: number, isMovedUp: boolean) => void;
}

export default function CheckItemLine({ checkItem, isNewItem, isMovedItem, onMove }: CheckItemLineProps) {
  const [isItemChecked, setIsItemChecked] = useState(!!checkItem.checked);
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
          checked: event.target.checked ? 1 : 0,
        })
        .then(() => {
          eventMgr.dispatch("checklist-refresh");
        });
    }, 1);
  };

  useEffect(() => {
    // reset to the remote state when changed
    setIsItemChecked(!!checkItem.checked);
  }, [checkItem.checked]);

  const handleTitleInputValidated = useCallback(
    async (value: string) => {
      await updateItemMutation.mutateAsync({
        title: value,
      });
      eventMgr.dispatch("checklist-refresh");
    },

    [updateItemMutation]
  );

  useEffect(() => {
    if (isNewItem) {
      cardRef.current?.scrollIntoView({ block: "center" });
    }
  }, [isNewItem]);

  const handleDeleteClick = useCallback(async () => {
    setItemIdToDelete(checkItem.id);
  }, [setItemIdToDelete, checkItem.id]);

  const handleUpClick = useCallback(async () => {
    onMove(checkItem.id, true);
  }, [onMove, checkItem.id]);

  const handleDownClick = useCallback(async () => {
    onMove(checkItem.id, false);
  }, [onMove, checkItem.id]);

  return (
    <Card
      ref={cardRef}
      my="1"
      className="checklist-line"
      bgColor={isNewItem || isMovedItem ? "teal.700" : "gray.600"}
      color="teal.50"
    >
      <CardBody px={2} py={1}>
        <Stack direction="row" alignItems="center" gap={1}>
          <Box>
            <Switch isChecked={isItemChecked} onChange={handleCheckSwitch} size="md" />
          </Box>
          <ValidatedInput
            defaultValue={checkItem.title || ""}
            placeholder="Entrez un nom"
            onValidated={handleTitleInputValidated}
          />

          {/* <Box>{checkItem.sortOrder}</Box> */}
          <MyIconButton
            ReactIcon={FaArrowAltCircleUp}
            color="blue.400"
            display={isEditMode ? "" : "none"}
            onClick={handleUpClick}
            fontSize={20}
          />
          <MyIconButton
            ReactIcon={FaArrowAltCircleDown}
            color="blue.400"
            display={isEditMode ? "" : "none"}
            onClick={handleDownClick}
            fontSize={20}
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
