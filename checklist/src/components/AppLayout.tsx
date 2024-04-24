import { HStack } from "@chakra-ui/react";
import BottomBar from "./BottomBar";
import ChecklistPanel from "./ChecklistPanel";

const AppLayout = () => {
  return (
    <HStack m="auto" w="100%" maxW="2xl" pos="relative">
      <ChecklistPanel />
      <BottomBar />
    </HStack>
  );
};

export default AppLayout;
