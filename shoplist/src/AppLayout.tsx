import { Stack } from "@chakra-ui/react";
import CheckListPanel from "./CheckListPanel";

const AppLayout = () => {
  return (
    <Stack direction="row" justify="center">
      <CheckListPanel />
    </Stack>
  );
};

export default AppLayout;
