import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import AppRouter from "./AppRouter";
import theme from "./theme";
import socketManager from "./utils/socketManager";

const queryClient = new QueryClient();

function App() {
  const isMountedRef = useRef(false);
  useEffect(() => {
    if (isMountedRef.current) {
      return;
    }
    isMountedRef.current = true;
    socketManager.init();
  }, []);
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
