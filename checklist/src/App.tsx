import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider } from "@chakra-ui/react";
import AppLayout from "./AppLayout";

const queryClient = new QueryClient();

function App() {
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <AppLayout />
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
