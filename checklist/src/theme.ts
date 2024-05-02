import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";

const theme = extendTheme(withDefaultColorScheme({ colorScheme: "teal" }), {
  colorScheme: "teal",
  styles: {
    global: {
      body: {
        bg: "gray.900",
        color: "teal.200",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "bold",
        textTransform: "uppercase",
      },
    },
  },
});

export default theme;
