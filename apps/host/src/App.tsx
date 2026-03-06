import { Button } from "@repo/ui/components/Button";
import { Heading } from "@repo/ui/components/Heading";
import { LoadingState } from "@repo/ui/components/LoadingState";
import { Sidebar, SidebarContent, SidebarHeader, SidebarItem } from "@repo/ui/components/Sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BookOpen, Dice5, Menu, Map } from "lucide-react";
import React, { Suspense, useState } from "react";

import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

// Initialize the global query client for server-state caching
const queryClient = new QueryClient();

import { LandingPage } from "./components/LandingPage";

// Lazily load the exposed Vite Federation micro-frontends
const GeneratorApp = React.lazy(() => import("generator/App"));
const RulesetApp = React.lazy(() => import("ruleset/App"));
const EpisodesApp = React.lazy(() => import("episodes/App"));

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeView = location.pathname.startsWith("/generator")
    ? "generator"
    : location.pathname.startsWith("/ruleset")
      ? "ruleset"
      : location.pathname.startsWith("/episodes")
        ? "episodes"
        : "home";

  return (
    <div data-theme="inverted" className="flex h-screen w-screen overflow-hidden bg-[var(--theme-bg)] text-[var(--theme-text)] selection:bg-[var(--theme-accent)] selection:text-[var(--theme-bg)]">
      <Sidebar
        className="flex-shrink-0 z-20 shadow-xl"
        expanded={sidebarOpen}
        onExpandedChange={setSidebarOpen}
      >
        <SidebarHeader
          className="cursor-pointer hover:bg-primary/5 transition-colors group"
          onClick={() => navigate("/")}
        >
          <div className="w-8 h-8 rounded bg-[var(--theme-primary)] text-[var(--theme-primary-foreground)] flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-110 transition-transform">
            E
          </div>
          <Heading variant="h4" className="ml-3 truncate" style={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
            Eventuellit
          </Heading>
        </SidebarHeader>

        <SidebarContent>
          <SidebarItem
            icon={<Dice5 size={20} />}
            active={activeView === "generator"}
            onClick={() => navigate("/generator")}
          >
            Hahmopaja
          </SidebarItem>
          <SidebarItem
            icon={<BookOpen size={20} />}
            active={activeView === "ruleset"}
            onClick={() => navigate("/ruleset")}
          >
            Sääntökirja
          </SidebarItem>
          <SidebarItem
            icon={<Map size={20} />}
            active={activeView === "episodes"}
            onClick={() => navigate("/episodes")}
          >
            Jaksot
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

        <header className="absolute top-20 left-5 desktop:top-5 desktop:left-5 origin-top-right -rotate-90 -translate-x-full whitespace-nowrap z-10 transition-all duration-300">
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
          {activeView === "episodes" && (
            <Heading as="h1" className="m-0">
              Eventuellit: Jaksot
            </Heading>
          )}
        </header>

        <div className="pl-16 desktop:pl-24 tablet:pl-32 max-w-7xl mx-auto w-full">
          <Suspense
            fallback={
              <LoadingState message="Ladataan kohdetta..." size="large" className="mt-6" />
            }
          >
            <div className="animate-in fade-in duration-500">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/generator/*" element={<GeneratorApp />} />
                <Route path="/ruleset/*" element={<RulesetApp />} />
                <Route path="/episodes/*" element={<EpisodesApp />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Suspense>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
