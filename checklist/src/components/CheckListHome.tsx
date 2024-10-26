import { Box, HStack, List, ListItem } from "@chakra-ui/react";
import { ChecklistListInput } from "@common/checklistTypes";
import { buildLinkPath } from "@src/AppRouter";
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
    mutationFn: (checklistListInput: ChecklistListInput) => {
      return addList(checklistListInput);
    },
  });

  const handleAddClick = useCallback(async () => {
    await addListMutation.mutateAsync({ title: "Nouvelle liste" });
    refetch();
  }, [addListMutation, refetch]);

  return (
    <Box className="checklist-home" flex={1}>
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
                <ListItem key={checkList.id} bgColor={"teal.600"} color="teal.50" my="10px" borderRadius="6px">
                  <Link to={`${buildLinkPath(String(checkList.id))}`}>
                    <Box py="6px" px="10px">
                      {checkList.title}
                    </Box>
                  </Link>
                </ListItem>
              ))
            : "Pas de liste"}
        </List>
      </MyReactQuerySuspense>
    </Box>
  );
};

export default memo(CheckListHome);
