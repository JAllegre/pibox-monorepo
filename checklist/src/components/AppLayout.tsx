import { HStack } from "@chakra-ui/react";
import ChecklistPanel from "./ChecklistPanel";
import { DeleteModal } from "./DeleteModal";

const AppLayout = () => {
  return (
    <HStack className="app-layout" m="auto" w="100%" maxW="2xl" pos="relative">
      <ChecklistPanel />
      <DeleteModal />
    </HStack>
  );
};

export default AppLayout;
