import { HStack } from "@chakra-ui/react";
import ChecklistPanel from "./ChecklistPanel";

const AppLayout = () => {
  return (
    <HStack justify="center">
      <ChecklistPanel />
    </HStack>
  );
};

export default AppLayout;
