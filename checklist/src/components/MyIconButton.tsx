import { Box, BoxProps } from "@chakra-ui/react";
import { IconType } from "react-icons";

interface MyIconButtonProps extends BoxProps {
  ReactIcon: IconType;
}

export function MyIconButton({ ReactIcon, ...props }: MyIconButtonProps) {
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
      <ReactIcon />
    </Box>
  );
}
