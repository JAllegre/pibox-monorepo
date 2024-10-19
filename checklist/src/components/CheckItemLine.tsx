import { Box, Card, CardBody, HStack, Stack, Switch } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, memo, useCallback, useEffect, useRef, useState } from "react";
import { FaArrowAltCircleDown, FaArrowAltCircleUp, FaRegTrashAlt } from "react-icons/fa";
import { ChecklistItem, ChecklistItemInput } from "../../../common/checklistTypes";
import { useChecklistStore } from "../utils/ChecklistStore";
import { updateItem } from "../utils/api";
import "./CheckItemLine.scss";
import MyIconButton from "./MyIconButton";
import ValidatedInput from "./ValidatedInput";

type CheckItemLineProps = Pick<ChecklistItem, "id" | "checked" | "title"> & {
  isNewItem?: boolean;
  isModifiedItem?: boolean;
  onMove: (itemId: number, isMovedUp: boolean) => void;
};

function CheckItemLine({ id, checked, title, isNewItem, isModifiedItem, onMove }: CheckItemLineProps) {
  const [isItemChecked, setIsItemChecked] = useState(!!checked);
  const cardRef = useRef<HTMLDivElement>(null);
  const setItemIdToDelete = useChecklistStore((state) => state.setItemIdToDelete);

  const updateItemMutation = useMutation({
    mutationFn: (checklistCategoryInput: Partial<ChecklistItemInput>) => {
      return updateItem(id, checklistCategoryInput);
    },
  });

  const handleCheckSwitch = async (event: ChangeEvent<HTMLInputElement>) => {
    // Want to update the local state immediately
    setIsItemChecked(event.target.checked);
    setTimeout(() => {
      updateItemMutation.mutateAsync({
        checked: event.target.checked ? 1 : 0,
      });
    }, 0);
  };

  useEffect(() => {
    // reset to the remote state when changed
    setIsItemChecked(!!checked);
  }, [checked]);

  const handleTitleInputValidated = useCallback(
    async (value: string) => {
      await updateItemMutation.mutateAsync({
        title: value,
      });
    },

    [updateItemMutation]
  );

  useEffect(() => {
    if (isNewItem) {
      cardRef.current?.scrollIntoView({ block: "center" });
    }
  }, [isNewItem]);

  const handleDeleteClick = useCallback(async () => {
    setItemIdToDelete(id);
  }, [setItemIdToDelete, id]);

  const handleUpClick = useCallback(async () => {
    onMove(id, true);
  }, [onMove, id]);

  const handleDownClick = useCallback(async () => {
    onMove(id, false);
  }, [onMove, id]);

  return (
    <Card
      ref={cardRef}
      my="1"
      className={`checklist-line ${isItemChecked ? "checked" : ""}`}
      bgColor={isNewItem || isModifiedItem ? "teal.700" : "gray.600"}
      color="teal.50"
    >
      <CardBody px={2} py={1}>
        <Stack direction="row" alignItems="center" gap={1}>
          <Box>
            <Switch isChecked={isItemChecked} onChange={handleCheckSwitch} size="md" />
          </Box>
          <ValidatedInput placeholder="Entrez un titre" onValidated={handleTitleInputValidated} remoteValue={title} />
          {/* <Box>{checkItem.sortOrder}</Box> */}
          <HStack>
            <MyIconButton ReactIcon={FaArrowAltCircleUp} color="blue.400" onClick={handleUpClick} fontSize={20} />
            <MyIconButton ReactIcon={FaArrowAltCircleDown} color="blue.400" onClick={handleDownClick} fontSize={20} />
            <MyIconButton ReactIcon={FaRegTrashAlt} color="red.400" onClick={handleDeleteClick} fontSize={20} />
          </HStack>
        </Stack>
      </CardBody>
    </Card>
  );
}

export default memo(CheckItemLine);
