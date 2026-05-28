import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { EpisodeWrapper } from "./components/EpisodeWrapper";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <EpisodeWrapper />
    </QueryClientProvider>
  );
}
