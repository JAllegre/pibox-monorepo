import { Stack } from "@chakra-ui/react";
import ChecklistPanel from "./ChecklistPanel";

const AppLayout = () => {
  return (
    <Stack direction="row" justify="center">
      <ChecklistPanel />
    </Stack>
  );
};

export default AppLayout;
