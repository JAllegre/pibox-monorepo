import { HStack } from "@chakra-ui/react";
import BottomBar from "./BottomBar";
import ChecklistPanel from "./ChecklistPanel";
import { DeleteModal } from "./DeleteModal";

const AppLayout = () => {
  return (
    <HStack m="auto" w="100%" maxW="2xl" pos="relative">
      <ChecklistPanel />
      <BottomBar />
      <DeleteModal />
    </HStack>
  );
};

export default AppLayout;
