import { HStack } from "@chakra-ui/react";
import ChecklistPanel from "./ChecklistPanel";

const AppLayout = () => {
  return (
    <HStack m="auto" w="100%" maxW="2xl">
      <ChecklistPanel />
    </HStack>
  );
};

export default AppLayout;
