import { ArticleProgressNavigator } from "@repo/ui/components/ArticleProgressNavigator";
import {
  ARTICLE_JUMP_EVENT,
  ARTICLE_PROGRESS_EVENT,
  type ArticleJumpPayload,
  type ArticleProgressPayload,
  type ArticleProgressSource,
} from "@repo/ui/components/article-progress-events";
import { Button } from "@repo/ui/components/Button";
import { Heading } from "@repo/ui/components/Heading";
import { LoadingState } from "@repo/ui/components/LoadingState";
import { Sidebar, SidebarContent, SidebarHeader, SidebarItem } from "@repo/ui/components/Sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BookOpen, Dice5, MapIcon, Menu } from "lucide-react";
import React, { Suspense, useEffect, useRef, useState } from "react";

import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

// Initialize the global query client for server-state caching
const queryClient = new QueryClient();

import { LandingPage } from "./components/LandingPage";

// Lazily load the exposed Vite Federation micro-frontends
const GeneratorApp = React.lazy(() => import("generator/App"));
const RulesetApp = React.lazy(() => import("ruleset/App"));
const EpisodesApp = React.lazy(() => import("episodes/App"));
const DEFAULT_BURGER_HEIGHT_PX = 48;
const BURGER_TOP_OFFSET_PX = 16;
const PROGRESS_HEADING_GAP_PX = 12;

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const laneRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [articleProgress, setArticleProgress] = useState<ArticleProgressPayload | null>(null);
  const [burgerHeightPx, setBurgerHeightPx] = useState(DEFAULT_BURGER_HEIGHT_PX);
  const [headingVisualBottomPx, setHeadingVisualBottomPx] = useState(0);
  const [viewportHeightPx, setViewportHeightPx] = useState(0);
  const [progressIsPinned, setProgressIsPinned] = useState(false);
  const [progressFixedLeftPx, setProgressFixedLeftPx] = useState(8);

  const activeView = location.pathname.startsWith("/generator")
    ? "generator"
    : location.pathname.startsWith("/ruleset")
      ? "ruleset"
      : location.pathname.startsWith("/episodes")
        ? "episodes"
        : "home";

  useEffect(() => {
    const activeSource: ArticleProgressSource | null =
      activeView === "ruleset" || activeView === "episodes" ? activeView : null;
    const activeRoutePrefix = activeSource ? `/${activeSource}` : null;

    const isPayloadForActiveView = (payload: ArticleProgressPayload) => {
      if (!activeSource) {
        return false;
      }

      if (payload.source === activeSource) {
        return true;
      }

      return Boolean(activeRoutePrefix && payload.route?.startsWith(activeRoutePrefix));
    };

    const onArticleProgress = (event: Event) => {
      const customEvent = event as CustomEvent<ArticleProgressPayload>;
      const payload = customEvent.detail;

      if (!payload || !isPayloadForActiveView(payload)) {
        return;
      }

      setArticleProgress(payload);
    };

    window.addEventListener(ARTICLE_PROGRESS_EVENT, onArticleProgress as EventListener);
    return () => {
      window.removeEventListener(ARTICLE_PROGRESS_EVENT, onArticleProgress as EventListener);
    };
  }, [activeView]);

  useEffect(() => {
    if (activeView !== "ruleset" && activeView !== "episodes") {
      setArticleProgress(null);
    }
  }, [activeView]);

  const effectiveBurgerHeightPx = Math.max(burgerHeightPx, DEFAULT_BURGER_HEIGHT_PX);
  const progressStickyTopPx = BURGER_TOP_OFFSET_PX + effectiveBurgerHeightPx;
  const progressStartOffsetPx = headingVisualBottomPx + PROGRESS_HEADING_GAP_PX;
  const progressRailHeightPx = Math.max(0, viewportHeightPx - Math.round(effectiveBurgerHeightPx * 2) - 2);
  const progressRailHeight = `${progressRailHeightPx}px`;

  const scrollToSectionInScrollRoot = (sectionId: string) => {
    const scrollRoot = document.getElementById("app-scroll-root");
    const targetElement = document.getElementById(sectionId);
    if (!scrollRoot || !targetElement) {
      return;
    }

    const rootRect = scrollRoot.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();
    const targetTop = Math.max(targetRect.top - rootRect.top + scrollRoot.scrollTop - 96, 0);
    scrollRoot.scrollTo({ top: targetTop, behavior: "smooth" });
  };

  useEffect(() => {
    const updateViewportHeight = () => {
      setViewportHeightPx(window.innerHeight);
    };

    updateViewportHeight();
    window.addEventListener("resize", updateViewportHeight);

    return () => {
      window.removeEventListener("resize", updateViewportHeight);
    };
  }, []);

  useEffect(() => {
    const scrollRoot = document.getElementById("app-scroll-root");
    if (!scrollRoot) {
      return;
    }

    const updateProgressPinning = () => {
      const pinStartScrollTop = Math.max(0, progressStartOffsetPx - progressStickyTopPx);
      const nextPinned = scrollRoot.scrollTop >= pinStartScrollTop;
      setProgressIsPinned((previous) => (previous !== nextPinned ? nextPinned : previous));
    };

    updateProgressPinning();
    scrollRoot.addEventListener("scroll", updateProgressPinning, { passive: true });
    window.addEventListener("resize", updateProgressPinning);

    return () => {
      scrollRoot.removeEventListener("scroll", updateProgressPinning);
      window.removeEventListener("resize", updateProgressPinning);
    };
  }, [progressStartOffsetPx, progressStickyTopPx]);

  useEffect(() => {
    const updateLaneMetrics = () => {
      const laneElement = laneRef.current;
      if (!laneElement) {
        return;
      }

      const nextBurgerHeight =
        burgerRef.current && burgerRef.current.offsetHeight > 0
          ? burgerRef.current.offsetHeight
          : window.innerWidth >= 1024
            ? 0
            : DEFAULT_BURGER_HEIGHT_PX;

      const laneRect = laneElement.getBoundingClientRect();
      const headingRect = headingRef.current?.getBoundingClientRect();
      const nextHeadingVisualBottom = headingRect
        ? Math.max(0, headingRect.bottom - laneRect.top)
        : 0;

      setBurgerHeightPx((previous) =>
        Math.abs(previous - nextBurgerHeight) > 0.5 ? nextBurgerHeight : previous,
      );
      setHeadingVisualBottomPx((previous) =>
        Math.abs(previous - nextHeadingVisualBottom) > 0.5 ? nextHeadingVisualBottom : previous,
      );
      setProgressFixedLeftPx((previous) =>
        Math.abs(previous - laneRect.left) > 0.5 ? laneRect.left : previous,
      );
    };

    updateLaneMetrics();

    const resizeObserver = new ResizeObserver(updateLaneMetrics);
    if (laneRef.current) {
      resizeObserver.observe(laneRef.current);
    }
    if (headingRef.current) {
      resizeObserver.observe(headingRef.current);
    }
    if (burgerRef.current) {
      resizeObserver.observe(burgerRef.current);
    }

    window.addEventListener("resize", updateLaneMetrics);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateLaneMetrics);
    };
  }, [activeView, articleProgress]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--theme-bg)] text-[var(--theme-text)] selection:bg-[var(--theme-accent)] selection:text-[var(--theme-bg)]">
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
          <Heading
            variant="h4"
            className="ml-3 truncate"
            style={{ fontWeight: 700, letterSpacing: "-0.02em" }}
          >
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
            icon={<MapIcon size={20} />}
            active={activeView === "episodes"}
            onClick={() => navigate("/episodes")}
          >
            Jaksot
          </SidebarItem>
        </SidebarContent>
      </Sidebar>

      <main id="app-scroll-root" className="flex-1 overflow-y-auto w-full h-full relative">
        <div ref={laneRef} className="absolute top-0 left-2 desktop:left-3 z-30 w-72 pt-4">
          {/* Keep mobile controls always reachable above heading and progress lane. */}
          <Button
            ref={burgerRef}
            variant="ghost"
            size="icon"
            className="sticky top-4 z-40 max-desktop:z-50 desktop:hidden text-[var(--theme-primary)] hover:bg-transparent"
            onClick={() => setSidebarOpen(true)}
            aria-label="Avaa valikko"
          >
            <Menu size={28} />
          </Button>

          <header
            ref={headingRef}
            className="absolute left-0 top-16 origin-top-right -rotate-90 -translate-x-full whitespace-nowrap z-20 transition-all duration-300"
          >
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

          {(activeView === "ruleset" || activeView === "episodes") && articleProgress && (
            <div
              className="z-30"
              style={{
                position: "fixed",
                left: `${progressFixedLeftPx}px`,
                top: `${progressStickyTopPx}px`,
                opacity: progressIsPinned ? 1 : 0,
                transform: progressIsPinned ? "translateY(0px)" : "translateY(-8px)",
                transition: "opacity 180ms ease, transform 180ms ease",
                pointerEvents: progressIsPinned ? "auto" : "none",
              }}
            >
              <ArticleProgressNavigator
                variant="minimal"
                sections={articleProgress.sections}
                progress={articleProgress.progress}
                activeSectionId={articleProgress.activeSectionId}
                markerPositions={articleProgress.markerPositions}
                railHeight={progressRailHeight}
                onSelectSection={(sectionId) => {
                  scrollToSectionInScrollRoot(sectionId);
                  const payload: ArticleJumpPayload = {
                    source: activeView,
                    sectionId,
                  };
                  window.dispatchEvent(
                    new CustomEvent<ArticleJumpPayload>(ARTICLE_JUMP_EVENT, { detail: payload }),
                  );
                }}
              />
            </div>
          )}
        </div>

        <div className="pl-16 desktop:pl-24 tablet:pl-32 max-w-7xl mx-auto w-full">
          <Suspense
            fallback={<LoadingState message="Ladataan kohdetta..." size="large" className="mt-6" />}
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
