import { Box, HStack, VStack } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { ImSpinner } from "react-icons/im";
import { MdErrorOutline } from "react-icons/md";

const MyReactQuerySuspense = ({
  children,
  isPending,
  error,
}: PropsWithChildren<{ isPending: boolean; error: Error | null }>) => {
  if (isPending) {
    return (
      <HStack justifyContent="center" pt="40px">
        <Box className="spin">
          <ImSpinner fontSize="50px" />
        </Box>
      </HStack>
    );
  }

  if (error) {
    return (
      <VStack justifyContent="center" alignItems="center" pt="20px">
        <Box>
          <MdErrorOutline fontSize="50px" color="red" />
        </Box>
        <Box>An error has occurred</Box>
        <Box>{error.message}</Box>
      </VStack>
    );
  }

  return <Box>{children}</Box>;
};

export default MyReactQuerySuspense;
