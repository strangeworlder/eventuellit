import { Button } from "@repo/ui/components/Button";
import { Heading } from "@repo/ui/components/Heading";
import { Sidebar, SidebarContent, SidebarHeader, SidebarItem } from "@repo/ui/components/Sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BookOpen, Dice5, Menu } from "lucide-react";
import React, { Suspense, useState } from "react";

// Initialize the global query client for server-state caching
const queryClient = new QueryClient();

// Lazily load the exposed Vite Federation micro-frontends
const GeneratorApp = React.lazy(() => import("generator/App"));
const RulesetApp = React.lazy(() => import("ruleset/App"));

type ViewType = "generator" | "ruleset";

function App() {
  const [activeView, setActiveView] = useState<ViewType>("generator");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen w-screen overflow-hidden bg-background text-text selection:bg-accent selection:text-white">
        <Sidebar
          className="flex-shrink-0 z-20 shadow-xl"
          theme="base"
          expanded={sidebarOpen}
          onExpandedChange={setSidebarOpen}
        >
          <SidebarHeader>
            <div className="w-8 h-8 rounded bg-[var(--theme-primary)] text-[var(--theme-primary-foreground)] flex items-center justify-center font-bold flex-shrink-0">
              E
            </div>
            <Heading as="h4" className="ml-3 truncate">
              Eventuellit
            </Heading>
          </SidebarHeader>

          <SidebarContent>
            <SidebarItem
              icon={<Dice5 size={20} />}
              active={activeView === "generator"}
              onClick={() => setActiveView("generator")}
            >
              Hahmopaja
            </SidebarItem>
            <SidebarItem
              icon={<BookOpen size={20} />}
              active={activeView === "ruleset"}
              onClick={() => setActiveView("ruleset")}
            >
              Sääntökirja
            </SidebarItem>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 overflow-y-auto w-full h-full relative">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 z-10 desktop:hidden text-[var(--theme-primary)] hover:bg-transparent"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={28} />
          </Button>

          <header className="absolute top-[88px] left-5 desktop:top-5 desktop:left-5 origin-top-right -rotate-90 -translate-x-full whitespace-nowrap z-10">
            {activeView === "generator" && (
              <Heading as="h1" className="m-0">
                Eventuellit: Hahmopaja
              </Heading>
            )}
            {activeView === "ruleset" && (
              <Heading as="h1" className="m-0">
                Eventuellit: Säännöt
              </Heading>
            )}
          </header>

          <div className="pl-16 desktop:pl-24 md:pl-32 max-w-7xl mx-auto w-full">
            <Suspense
              fallback={
                <div className="text-primary animate-pulse uppercase tracking-widest font-black text-2xl mt-6">
                  Ladataan kohdetta...
                </div>
              }
            >
              <div className="animate-in fade-in duration-500">
                {activeView === "generator" && <GeneratorApp />}
                {activeView === "ruleset" && <RulesetApp />}
              </div>
            </Suspense>
          </div>
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;
