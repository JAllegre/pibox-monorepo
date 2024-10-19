import { Box, BoxProps } from "@chakra-ui/react";
import { memo } from "react";
import { IconType } from "react-icons";

interface MyIconButtonProps extends BoxProps {
  ReactIcon: IconType;
}

function MyIconButton({ ReactIcon, ...props }: MyIconButtonProps) {
  return (
    <Box
      className="my-icon-button"
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

export default memo(MyIconButton);
