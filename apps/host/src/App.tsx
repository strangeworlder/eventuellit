import React, { useState, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Button } from "@repo/ui/components/Button";
import { Heading } from "@repo/ui/components/Heading";

// Initialize the global query client for server-state caching
const queryClient = new QueryClient();

// Lazily load the exposed Vite Federation micro-frontends
const GeneratorApp = React.lazy(() => import("generator/App"));
const RulesetApp = React.lazy(() => import("ruleset/App"));

function App() {
  const [activeTab, setActiveTab] = useState<"generator" | "ruleset">("generator");

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-text p-8 selection:bg-accent selection:text-white">
        <header className="mb-10 border-b-2 border-primary/40 pb-6">
          <Heading as="h1">
            Eventuellit: The RPG Experience
          </Heading>
          <nav className="flex gap-6">
            <Button
              variant={activeTab === "generator" ? "primary" : "secondary"}
              onClick={() => setActiveTab("generator")}
              className={activeTab === "generator" ? "scale-105" : "hover:scale-105"}
            >
              Hahmogeneraattori
            </Button>
            <Button
              variant={activeTab === "ruleset" ? "primary" : "secondary"}
              onClick={() => setActiveTab("ruleset")}
              className={activeTab === "ruleset" ? "scale-105" : "hover:scale-105"}
            >
              Sääntökirja
            </Button>
          </nav>
        </header>

        <main className="max-w-7xl mx-auto">
          <Suspense fallback={<div className="text-primary animate-pulse uppercase tracking-widest font-black text-2xl">Ladataan kohdetta...</div>}>
            {activeTab === "generator" ? <GeneratorApp /> : <RulesetApp />}
          </Suspense>
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;
