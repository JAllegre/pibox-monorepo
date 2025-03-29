import { Box, HStack, List, ListItem } from "@chakra-ui/react";
import { ChecklistListInput } from "@common/checklistTypes";
import { buildLinkPath } from "@src/AppRouter";
import { addList, getChecklists } from "@src/utils/api";
import { useChecklistStore } from "@src/utils/ChecklistStore";
import eventMgr, { EventType } from "@src/utils/eventMgr";
import MyReactQuerySuspense from "@src/utils/MyReactQuerySuspense";
import { useMutation, useQuery } from "@tanstack/react-query";
import { memo, useCallback, useEffect } from "react";
import { FaPlusCircle, FaRegTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./CheckListHome.scss";
import DeleteListModal from "./DeleteListModal";
import MyIconButton from "./MyIconButton";

const CheckListHome = () => {
  const setListIdToDelete = useChecklistStore((state) => state.setListIdToDelete);

  const { isPending, data, error, refetch } = useQuery({
    queryKey: ["getChecklists"],
    queryFn: () => getChecklists(),
  });

  const addListMutation = useMutation({
    mutationFn: (checklistListInput: ChecklistListInput) => {
      return addList(checklistListInput);
    },
  });

  const handleAddClick = useCallback(async () => {
    await addListMutation.mutateAsync({ title: "Nouvelle liste" });
    refetch();
  }, [addListMutation, refetch]);

  const handleDeleteClick = useCallback(
    (id: number) => () => {
      setListIdToDelete(id);
    },
    [setListIdToDelete]
  );

  useEffect(() => {
    const cb = eventMgr.addListener(EventType.Refresh, () => {
      refetch();
    });

    return () => {
      eventMgr.removeListener(EventType.Refresh, cb);
    };
  }, [refetch]);

  return (
    <Box className="checklist-home" flex={1}>
      <DeleteListModal />
      <MyReactQuerySuspense isPending={isPending} error={error}>
        <HStack justifyContent="space-between">
          <Box fontSize={"2xl"} fontWeight={"bold"}>
            Mes Listes
          </Box>
          <MyIconButton ReactIcon={FaPlusCircle} onClick={handleAddClick} fontSize={26} />
        </HStack>
        <List>
          {data?.checklists
            ? data.checklists.map((checkList) => (
                <ListItem
                  key={checkList.id}
                  bgColor={"teal.600"}
                  color="teal.50"
                  my="10px"
                  px="10px"
                  py="6px"
                  borderRadius="6px"
                >
                  <HStack justifyContent="space-between">
                    <Link to={`${buildLinkPath(String(checkList.id))}`}>
                      <Box>{checkList.title}</Box>
                    </Link>
                    <Box className="icon-button icon-button-danger" onClick={handleDeleteClick(checkList.id)}>
                      <FaRegTrashAlt />
                    </Box>
                  </HStack>
                </ListItem>
              ))
            : "Pas de liste"}
        </List>
      </MyReactQuerySuspense>
    </Box>
  );
};

export default memo(CheckListHome);
