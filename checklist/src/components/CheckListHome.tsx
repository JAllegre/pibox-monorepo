import { Box, HStack, List, ListItem } from "@chakra-ui/react";
import { ChecklistInput } from "@common/checklistTypes";
import { CHECKLIST_BASE_ROUTE } from "@src/AppRouter";
import { addList, getChecklists } from "@src/utils/api";
import MyReactQuerySuspense from "@src/utils/MyReactQuerySuspense";
import { useMutation, useQuery } from "@tanstack/react-query";
import { memo, useCallback } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./CheckListHome.scss";
import MyIconButton from "./MyIconButton";

const CheckListHome = () => {
  const { isPending, data, error, refetch } = useQuery({
    queryKey: ["getChecklists"],
    queryFn: () => getChecklists(),
  });

  const addListMutation = useMutation({
    mutationFn: (checklistListInput: ChecklistInput) => {
      return addList(checklistListInput);
    },
  });

  const handleAddClick = useCallback(async () => {
    await addListMutation.mutateAsync({ title: "Nouvelle liste" });
    refetch();
  }, [addListMutation, refetch]);

  return (
    <MyReactQuerySuspense isPending={isPending} error={error}>
      <Box className="checklist-home" flex={1}>
        <HStack justifyContent="space-between">
          <Box>Mes Listes</Box>
          <MyIconButton ReactIcon={FaPlusCircle} onClick={handleAddClick} fontSize={26} />
        </HStack>
        <List>
          {data?.checklists
            ? data.checklists.map((checkList) => (
                <ListItem key={checkList.id}>
                  <Link to={`${CHECKLIST_BASE_ROUTE}/${checkList.id}`}>{checkList.title}</Link>
                </ListItem>
              ))
            : "Pas de liste"}
        </List>
      </Box>
    </MyReactQuerySuspense>
  );
};

export default memo(CheckListHome);
