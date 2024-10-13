import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import AppLayout from "./components/AppLayout";
import theme from "./theme";
import socketManager from "./utils/socketManager";

const queryClient = new QueryClient();

function App() {
  const isMountedRef = useRef(false);
  useEffect(() => {
    if (isMountedRef.current) {
      return;
    }
    console.log("***ju***App.tsx/16", "");
    isMountedRef.current = true;
    socketManager.init();
  }, []);
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AppLayout />
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
