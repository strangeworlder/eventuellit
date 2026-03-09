import React from "react";
import ReactDOM from "react-dom";
import { Button } from "./Button";
import { cn } from "./Heading";
import { type Theme, ThemeContext, primaryThemeMap, useCurrentTheme } from "./Theme";
import { Icon } from "./Icon";

export interface ImageSource {
  srcSet: string;
  type: "image/avif" | "image/webp" | "image/jpeg" | "image/png";
}

export interface ImageElementProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  "data-theme"?: string;
  src: string;
  alt: string;
  variant?: "primary" | "secondary" | "accent" | "thumbnail";
  theme?: Theme;
  sources?: ImageSource[];
  sizes?: string;
  placeholderSrc?: string;
  caption?: React.ReactNode;
  loading?: "lazy" | "eager";
  decoding?: "async" | "auto" | "sync";
  imgClassName?: string;
  width?: number;
  height?: number;
  enableModal?: boolean;
}

const resolveNearestDataTheme = (
  element: HTMLElement | null,
): string | undefined => {
  if (!element || typeof document === "undefined") {
    return undefined;
  }

  const themedAncestor = element.closest("[data-theme]");
  return themedAncestor?.getAttribute("data-theme") ?? undefined;
};

/**
 * Lightweight, themed image primitive for editorial/media usage.
 * Supports responsive <picture> sources and a blur placeholder while loading.
 */
export const ImageElement = React.forwardRef<HTMLElement, ImageElementProps>(
  (
    {
      className,
      "data-theme": dataThemeProp,
      src,
      alt,
      variant = "secondary",
      theme,
      sources = [],
      sizes = "100vw",
      placeholderSrc,
      caption,
      loading = "lazy",
      decoding = "async",
      imgClassName,
      width,
      height,
      enableModal = true,
      ...props
    },
    ref,
  ) => {
    const safeAlt = alt.trim() || "Kuva";
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [modalDataTheme, setModalDataTheme] = React.useState<string | undefined>(undefined);
    const imgRef = React.useRef<HTMLImageElement | null>(null);
    const triggerRef = React.useRef<HTMLButtonElement | null>(null);
    const closeButtonRef = React.useRef<HTMLButtonElement | null>(null);
    const previouslyFocusedRef = React.useRef<HTMLElement | null>(null);
    const parentTheme = useCurrentTheme();
    const baseTheme = theme ?? parentTheme;
    const resolvedTheme = variant === "primary" ? primaryThemeMap[baseTheme] : theme;
    const childTheme = resolvedTheme ?? baseTheme;
    const captionId = React.useId();
    const sourcesKey = React.useMemo(
      () => sources.map((source) => `${source.type}:${source.srcSet}`).join("|"),
      [sources],
    );
    const openModal = React.useCallback(() => {
      if (!enableModal) {
        return;
      }
      setModalDataTheme(resolveNearestDataTheme(triggerRef.current));
      previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
      setIsModalOpen(true);
    }, [enableModal]);
    const closeModal = React.useCallback(() => {
      setIsModalOpen(false);
    }, []);

    React.useEffect(() => {
      setIsLoaded(false);
    }, [src, sourcesKey]);

    React.useEffect(() => {
      if (imgRef.current?.complete) {
        setIsLoaded(true);
      }
    }, [src, sourcesKey]);

    React.useEffect(() => {
      if (!isModalOpen) {
        return;
      }

      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          closeModal();
        }
      };

      window.addEventListener("keydown", onKeyDown);
      return () => {
        window.removeEventListener("keydown", onKeyDown);
      };
    }, [closeModal, isModalOpen]);

    React.useEffect(() => {
      if (!isModalOpen) {
        return;
      }

      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      closeButtonRef.current?.focus();

      return () => {
        document.body.style.overflow = previousOverflow;
        const fallbackTarget = triggerRef.current;
        (previouslyFocusedRef.current ?? fallbackTarget)?.focus();
      };
    }, [isModalOpen]);

    const modalContent =
      isModalOpen && typeof document !== "undefined"
        ? ReactDOM.createPortal(
            <div
              data-theme={modalDataTheme ?? dataThemeProp ?? childTheme}
              className="fixed inset-0 z-50 desktop:z-50 max-desktop:z-50 flex items-center justify-center bg-black/80 p-4"
              onClick={closeModal}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-label={`Kuvan tarkastelu: ${safeAlt}`}
                aria-describedby={caption ? captionId : undefined}
                className="relative flex max-h-[95vh] w-full max-w-6xl flex-col gap-3 rounded-xl border border-[var(--theme-secondary)] bg-[var(--theme-bg)] p-3 shadow-2xl"
                onClick={(event) => event.stopPropagation()}
              >
                <Button
                  ref={closeButtonRef}
                  type="button"
                  variant="secondary"
                  size="icon"
                  onClick={closeModal}
                  className="self-end"
                >
                  <Icon name="x" />
                </Button>
                <img
                  src={src}
                  alt={alt}
                  className="max-h-[80vh] w-full rounded-md object-contain"
                />
                {caption && (
                  <div
                    id={captionId}
                    className="border-t border-[var(--theme-secondary)]/30 pt-2 text-sm text-[var(--theme-secondary)]"
                  >
                    {caption}
                  </div>
                )}
              </div>
            </div>,
            document.body,
          )
        : null;

    return (
      <ThemeContext.Provider value={childTheme}>
        <figure
          ref={ref}
          data-theme={resolvedTheme}
          data-variant={variant}
          className={cn(
            "relative overflow-visible rounded-xl",
            {
              // Primary mirrors Card/StatBlock semantics: swapped theme surface.
              "bg-[var(--theme-bg)] text-[var(--theme-text)]":
                variant === "primary",
              // Secondary follows supporting component semantics.
              "bg-transparent text-[var(--theme-secondary)] border border-[var(--theme-secondary)]":
                variant === "secondary",
              // Accent mirrors the DS accent framing pattern.
              "bg-[var(--theme-bg)] text-[var(--theme-accent)] border-b-4 border-b-[var(--theme-accent)] border-t-0 border-l-0 border-r-0":
                variant === "accent",
              // Thumbnail variant is a compact media trigger for larger preview.
              "bg-transparent text-[var(--theme-secondary)] border border-[var(--theme-secondary)] w-14 h-14":
                variant === "thumbnail",
            },
            className,
          )}
          {...props}
        >
          {placeholderSrc && !isLoaded && (
            <img
              src={placeholderSrc}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-110 object-cover blur-lg opacity-90 transition-opacity duration-300"
            />
          )}
          {!placeholderSrc && !isLoaded && (
            <div
              aria-hidden="true"
              className={cn("absolute inset-0 animate-pulse", {
                "bg-[var(--theme-primary)]/10": variant === "primary",
                "bg-[var(--theme-secondary)]/20": variant === "secondary" || variant === "thumbnail",
                "bg-[var(--theme-accent)]/15": variant === "accent",
              })}
            />
          )}

          <button
            ref={triggerRef}
            type="button"
            onClick={openModal}
            className={cn(
              "group rounded-xl overflow-hidden block w-full text-left transition-transform duration-200 ease-out",
              variant === "thumbnail" && "h-full w-full rounded-lg",
              enableModal &&
                "cursor-zoom-in hover:scale-[1.02] hover:rotate-[0.25deg] focus-visible:scale-[1.012] focus-visible:rotate-[0.5deg]",
            )}
            aria-label={enableModal ? `Avaa kuva suurempana: ${safeAlt}` : undefined}
            aria-haspopup={enableModal ? "dialog" : undefined}
          >
            <picture
              className={cn("block", {
                "h-full w-full": variant === "thumbnail",
              })}
            >
              {sources.map((source) => (
                <source
                  key={`${source.type}-${source.srcSet}`}
                  srcSet={source.srcSet}
                  type={source.type}
                  sizes={sizes}
                />
              ))}
              <img
                ref={imgRef}
                src={src}
                sizes={sizes}
                alt={alt}
                loading={loading}
                decoding={decoding}
                width={width}
                height={height}
                onLoad={() => setIsLoaded(true)}
                className={cn(
                  "h-full w-full object-cover transition-opacity duration-300",
                  variant === "thumbnail" && "h-full w-full",
                  isLoaded ? "opacity-100" : "opacity-0",
                  imgClassName,
                )}
              />
            </picture>
          </button>

          {caption && (
            <figcaption
              className={cn("border-t px-3 py-2 text-sm", {
                "border-[var(--theme-primary)]/20 text-[var(--theme-text)]/80":
                  variant === "primary",
                "border-[var(--theme-secondary)]/30 text-[var(--theme-secondary)]":
                  variant === "secondary",
                "border-[var(--theme-accent)]/40 text-[var(--theme-accent)] font-semibold":
                  variant === "accent",
              })}
            >
              {caption}
            </figcaption>
          )}
        </figure>
        {modalContent}
      </ThemeContext.Provider>
    );
  },
);

ImageElement.displayName = "ImageElement";
