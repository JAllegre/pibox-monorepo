import { HStack } from "@chakra-ui/react";
import { memo } from "react";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <HStack className="app-layout" m="auto" w="100%" maxW="2xl" pos="relative">
      <Outlet />
    </HStack>
  );
};

export default memo(AppLayout);
