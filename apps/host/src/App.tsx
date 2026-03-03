import React, { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Heading } from "@repo/ui/components/Heading";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@repo/ui/components/Tabs";

// Initialize the global query client for server-state caching
const queryClient = new QueryClient();

// Lazily load the exposed Vite Federation micro-frontends
const GeneratorApp = React.lazy(() => import("generator/App"));
const RulesetApp = React.lazy(() => import("ruleset/App"));

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-text p-8 selection:bg-accent selection:text-white">
        <Tabs defaultValue="generator">
          <header className="mb-10">
            <Heading as="h1" className="mb-6">
              Eventuellit: The RPG Experience
            </Heading>
            <TabsList>
              <TabsTrigger value="generator">Hahmogeneraattori</TabsTrigger>
              <TabsTrigger value="ruleset">Sääntökirja</TabsTrigger>
            </TabsList>
          </header>

          <main>
            <Suspense fallback={<div className="text-primary animate-pulse uppercase tracking-widest font-black text-2xl mt-6">Ladataan kohdetta...</div>}>
              <TabsContent value="generator">
                <GeneratorApp />
              </TabsContent>
              <TabsContent value="ruleset">
                <RulesetApp />
              </TabsContent>
            </Suspense>
          </main>
        </Tabs>
      </div>
    </QueryClientProvider>
  );
}

export default App;
