import { Box, Card, CardBody, Input, InputGroup, InputRightElement, Stack, Switch } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { FaArrowAltCircleDown, FaArrowAltCircleUp, FaRegTrashAlt } from "react-icons/fa";
import { ImCheckmark } from "react-icons/im";
import { ChecklistItem, ChecklistItemInput, ChecklistItemStatus } from "../../../common/checklistTypes";
import { DisplayMode } from "../types";
import { useChecklistStore } from "../utils/ChecklistStore";
import { updateItem } from "../utils/api";
import eventMgr from "../utils/eventMgr";
import { MyIconButton } from "./MyIconButton";

interface CheckItemLineProps {
  checkItem: ChecklistItem;
  isNewItem?: boolean;
  isMovedItem?: boolean;
  onMove: (itemId: number, isMovedUp: boolean) => void;
}

export default function CheckItemLine({ checkItem, isNewItem, isMovedItem, onMove }: CheckItemLineProps) {
  const [title, setTitle] = useState(checkItem.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputEdited, setInputEdited] = useState(false);
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
    setInputEdited(false);
    if (title === checkItem.title) {
      return;
    }
    await updateItemMutation.mutateAsync({
      title,
    });
    eventMgr.dispatch("checklist-refresh");
  }, [checkItem.title, title, updateItemMutation]);

  useEffect(() => {
    if (isNewItem) {
      cardRef.current?.scrollIntoView({ block: "center" });
    }
  }, [isNewItem]);

  const handleDeleteClick = useCallback(async () => {
    setItemIdToDelete(checkItem.id);
  }, [setItemIdToDelete, checkItem.id]);

  const handleInputDoubleClick = () => {
    setInputEdited(true);
  };

  const handleUpClick = useCallback(async () => {
    onMove(checkItem.id, true);
  }, [onMove, checkItem.id]);

  const handleDownClick = useCallback(async () => {
    onMove(checkItem.id, false);
  }, [onMove, checkItem.id]);

  const handleValidationIconClick = () => {
    inputRef.current?.blur();
  };

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

          <InputGroup>
            <Input
              ref={inputRef}
              size="sm"
              p={1}
              placeholder="Entrez un nom"
              defaultValue={checkItem.title || ""}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              readOnly={!isEditMode || !inputEdited}
              sx={{ border: !isEditMode ? "none" : "" }}
              flexGrow={1}
              onDoubleClick={handleInputDoubleClick}
            />
            <InputRightElement>
              <MyIconButton
                ReactIcon={ImCheckmark}
                color="green.200"
                onClick={handleValidationIconClick}
                display={title !== checkItem.title ? "" : "none"}
                mb={2}
              />
            </InputRightElement>
          </InputGroup>
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
