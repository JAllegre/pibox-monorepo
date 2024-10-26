import { Box, HStack, List, ListItem } from "@chakra-ui/react";
import { CHECKLIST_BASE_ROUTE } from "@src/AppRouter";
import { getChecklists } from "@src/utils/api";
import MyReactQuerySuspense from "@src/utils/MyReactQuerySuspense";
import { useQuery } from "@tanstack/react-query";
import { memo } from "react";
import { Link } from "react-router-dom";
import "./CheckListHome.scss";

const CheckListHome = () => {
  const { isPending, data, error } = useQuery({
    queryKey: ["getChecklists"],
    queryFn: () => getChecklists(),
  });

  return (
    <MyReactQuerySuspense isPending={isPending} error={error}>
      <Box className="checklist-home" flex={1}>
        <HStack justifyContent="center">
          <Box>Mes Listes</Box>
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
