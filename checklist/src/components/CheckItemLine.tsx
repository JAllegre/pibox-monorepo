import {
  Box,
  Card,
  CardBody,
  Input,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Stack,
  Switch,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import {
  ChecklistItem,
  ChecklistItemInput,
} from "../../../common/checklistTypes";
import { DisplayMode } from "../types";
import { useChecklistStore } from "../utils/ChecklistStore";
import { removeItem, updateItem } from "../utils/api";
import eventMgr from "../utils/eventMgr";
interface CheckItemLineProps {
  checkItem: ChecklistItem;
  isNewItem?: boolean;
}

export default function CheckItemLine({
  checkItem,
  isNewItem,
}: CheckItemLineProps) {
  const [title, setTitle] = useState(checkItem.title);
  const [subtitle, setSubtitle] = useState(checkItem.subtitle);
  const [isNew, setIsNew] = useState(isNewItem);
  const cardRef = useRef<HTMLDivElement>(null);

  const isEditMode = useChecklistStore(
    (state) => state.displayMode === DisplayMode.Edit
  );

  const updateItemMutation = useMutation({
    mutationFn: (checklistCategoryInput: Partial<ChecklistItemInput>) => {
      return updateItem(checkItem.id, checklistCategoryInput);
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: (itemId: number) => {
      return removeItem(itemId);
    },
  });

  const handleCheckSwitch = async (event: ChangeEvent<HTMLInputElement>) => {
    await updateItemMutation.mutateAsync({
      checkStatus: event.target.checked ? 2 : 0,
    });
    eventMgr.dispatch("checklist-refresh");
  };

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

  const handleSubtitleChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      setSubtitle(event.target.value);
    },
    [setSubtitle]
  );

  const handleSubtitleBlur = useCallback(async () => {
    if (subtitle === checkItem.subtitle) {
      return;
    }
    await updateItemMutation.mutateAsync({
      subtitle,
    });
    eventMgr.dispatch("checklist-refresh");
  }, [checkItem.subtitle, subtitle, updateItemMutation]);

  const handleDeleteClick = useCallback(async () => {
    await removeItemMutation.mutateAsync(checkItem.id);
    eventMgr.dispatch("checklist-refresh");
  }, [checkItem.id, removeItemMutation]);

  useEffect(() => {
    let tt: number = 0;
    if (isNew) {
      cardRef.current?.scrollIntoView({ block: "center" });
      tt = window.setTimeout(() => {
        setIsNew(false);
      }, 10000);
    }

    console.log("CheckItemLine render", checkItem.id, isNew);

    return () => {
      clearTimeout(tt);
    };
  }, [checkItem.id, isNew]);

  return (
    <Card
      ref={cardRef}
      m="1"
      // sx={isNew ? { bgColor: "mistyrose" } : { bgColor: "grey.100" }}
      bgColor={isNew ? "red.100" : "gray.600"}
      color="teal.50"
    >
      <CardBody px={2} py={1}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box w={50}>
            <Switch
              isChecked={!!checkItem.checkStatus}
              onChange={handleCheckSwitch}
              size="md"
            />
          </Box>
          <Input
            size="sm"
            placeholder="Titre"
            value={title || ""}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            readOnly={!isEditMode}
            sx={{ border: !isEditMode ? "none" : "" }}
          />
          <Input
            size="sm"
            placeholder={isEditMode ? "Sous titre..." : ""}
            value={subtitle || ""}
            onChange={handleSubtitleChange}
            onBlur={handleSubtitleBlur}
            readOnly={!isEditMode}
            sx={{ border: !isEditMode ? "none" : "" }}
          />

          {isEditMode && (
            <Menu colorScheme="black">
              <MenuButton as={Box} cursor="pointer">
                <Box color="red.400">
                  <FaRegTrashAlt />
                </Box>
              </MenuButton>
              <MenuList bgColor="black">
                <MenuGroup title="Êtes vous sur ?" bgColor="black">
                  <MenuItem bgColor="black" onClick={handleDeleteClick}>
                    Oui
                  </MenuItem>
                  <MenuItem bgColor="black">Non</MenuItem>
                </MenuGroup>
              </MenuList>
            </Menu>
          )}
        </Stack>
      </CardBody>
    </Card>
  );
}
