import { Box, BoxProps } from "@chakra-ui/react";
import { IconType } from "react-icons";

interface MyIconButtonProps extends BoxProps {
  Icon: IconType;
}

export function MyIconButton({ Icon, ...props }: MyIconButtonProps) {
  return (
    <Box
      p={1}
      sx={{
        "&:hover": {
          opacity: "0.6",
        },
      }}
      cursor="pointer"
      {...props}
    >
      <Icon />
    </Box>
  );
}
