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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
} from "@repo/ui/components/Sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Icon } from "@repo/ui/components/Icon";
import React, { Suspense, useEffect, useRef, useState } from "react";

import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

// Initialize the global query client for server-state caching
const queryClient = new QueryClient();

import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/LoginPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { VerifyPage } from "./components/VerifyPage";
import { buildDocumentTitle } from "./route-title";
import { useAuth } from "@repo/auth/use-auth";


// Lazily load the exposed Vite Federation micro-frontends
const GeneratorApp = React.lazy(() => import("generator/App"));
const RulesetApp = React.lazy(() => import("ruleset/App"));
const EpisodesApp = React.lazy(() => import("episodes/App"));
const WorldApp = React.lazy(() => import("world/App"));
const DEFAULT_BURGER_HEIGHT_PX = 48;
const BURGER_TOP_OFFSET_PX = 16;
const PROGRESS_HEADING_GAP_PX = 12;

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();
  const laneRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
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
        : location.pathname.startsWith("/world")
          ? "world"
          : "home";

  useEffect(() => {
    const title = buildDocumentTitle(location.pathname);
    document.title = title;

    const setMeta = (selector: string, value: string) => {
      const el = document.querySelector<HTMLMetaElement>(selector);
      if (el) el.setAttribute("content", value);
    };

    setMeta('meta[property="og:title"]', title);
    setMeta('meta[name="twitter:title"]', title);
  }, [location.pathname]);

  // Close the mobile sidebar on route change so it doesn't stay open while the
  // page transitions in the background. Desktop sidebar stays unaffected.
  useEffect(() => {
    const DESKTOP_BREAKPOINT = 1024;
    if (window.innerWidth < DESKTOP_BREAKPOINT) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    const activeSource: ArticleProgressSource | null =
      activeView === "ruleset" || activeView === "episodes" || activeView === "world"
        ? activeView
        : null;
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
    if (activeView !== "ruleset" && activeView !== "episodes" && activeView !== "world") {
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

      // On desktop, anchor to sidebar's right edge; on mobile, use lane's left edge
      const isDesktop = window.innerWidth >= 1024;
      let nextProgressLeft: number;
      if (isDesktop && sidebarRef.current) {
        const sidebarRect = sidebarRef.current.getBoundingClientRect();
        nextProgressLeft = sidebarRect.right;
      } else {
        nextProgressLeft = laneRect.left;
      }

      setBurgerHeightPx((previous) =>
        Math.abs(previous - nextBurgerHeight) > 0.5 ? nextBurgerHeight : previous,
      );
      setHeadingVisualBottomPx((previous) =>
        Math.abs(previous - nextHeadingVisualBottom) > 0.5 ? nextHeadingVisualBottom : previous,
      );
      setProgressFixedLeftPx((previous) =>
        Math.abs(previous - nextProgressLeft) > 0.5 ? nextProgressLeft : previous,
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
    if (sidebarRef.current) {
      resizeObserver.observe(sidebarRef.current);
    }

    window.addEventListener("resize", updateLaneMetrics);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateLaneMetrics);
    };
  }, [activeView, articleProgress, sidebarOpen]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--theme-bg)] text-[var(--theme-text)] selection:bg-[var(--theme-accent)] selection:text-[var(--theme-bg)]">
      <Sidebar
        ref={sidebarRef}
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
          {isLoggedIn && (
            <SidebarItem
              icon={<Icon name="dice5" size={20} />}
              active={activeView === "generator"}
              onClick={() => navigate("/generator")}
            >
              Hahmopaja
            </SidebarItem>
          )}
          <SidebarItem
            icon={<Icon name="book" size={20} />}
            active={activeView === "ruleset"}
            onClick={() => navigate("/ruleset")}
          >
            Sääntökirja
          </SidebarItem>
          <SidebarItem
            icon={<Icon name="map" size={20} />}
            active={activeView === "episodes"}
            onClick={() => navigate("/episodes")}
          >
            Jaksot
          </SidebarItem>
          <SidebarItem
            icon={<Icon name="globe" size={20} />}
            active={activeView === "world"}
            onClick={() => navigate("/world")}
          >
            Maailma
          </SidebarItem>
        </SidebarContent>

        <SidebarFooter>
          {isLoggedIn ? (
            <>
              {user && (
                <div className="mb-2 px-2 py-1.5 rounded-md bg-[var(--theme-secondary)]/5 text-[var(--theme-secondary)]/80 text-sm truncate">
                  <div className="flex items-center gap-2">
                    <Icon name="user-circle" size={16} className="flex-shrink-0" />
                    <span className="truncate">{user.username || user.email}</span>
                  </div>
                </div>
              )}
              <SidebarItem
                icon={<Icon name="log-out" size={20} />}
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Kirjaudu ulos
              </SidebarItem>
            </>
          ) : (
            <SidebarItem
              icon={<Icon name="log-in" size={20} />}
              onClick={() => navigate("/kirjaudu")}
            >
              Kirjaudu sisään
            </SidebarItem>
          )}
        </SidebarFooter>
      </Sidebar>

      <main id="app-scroll-root" className="flex-1 overflow-y-auto w-full h-full relative">
        <div ref={laneRef} className="absolute top-0 left-2 desktop:left-3 z-30 pt-4">
          {/* Keep mobile controls always reachable above heading and progress lane. */}
          <Button
            ref={burgerRef}
            variant="ghost"
            size="icon"
            className="fixed top-4 left-2 z-10 desktop:hidden text-[var(--theme-primary)] hover:bg-transparent"
            onClick={() => setSidebarOpen(true)}
            aria-label="Avaa valikko"
          >
            <Icon name="menu" size={28} />
          </Button>

          <header
            ref={headingRef}
            className="bg-[var(--theme-bg)]/80 px-4 tablet:px-0 absolute left-0 top-16 origin-top-right -rotate-90 -translate-x-full whitespace-nowrap z-20 transition-all duration-300"
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
            {activeView === "world" && (
              <Heading as="h1" className="m-0">
                Eventuellit: Maailma
              </Heading>
            )}
          </header>

          {(activeView === "ruleset" || activeView === "episodes" || activeView === "world") && articleProgress && (
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
                <Route path="/kirjaudu" element={<LoginPage />} />
                <Route path="/auth/vahvista" element={<VerifyPage />} />
                <Route
                  path="/generator/*"
                  element={
                    <ProtectedRoute>
                      <GeneratorApp />
                    </ProtectedRoute>
                  }
                />
                <Route path="/ruleset/*" element={<RulesetApp />} />
                <Route path="/episodes/*" element={<EpisodesApp />} />
                <Route path="/world/*" element={<WorldApp />} />
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
