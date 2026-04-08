import React from "react";
import ReactDOM from "react-dom";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { primaryThemeMap, type Theme, ThemeContext, useCurrentTheme } from "./Theme";
import { cn } from "./utils";

export interface ImageSource {
  srcSet: string;
  type: "image/avif" | "image/webp" | "image/jpeg" | "image/png";
}

interface ImageVariant {
  width: number;
  avif: string;
  webp: string;
  jpg: string;
}

interface ManifestImageEntry {
  width: number;
  height: number;
  placeholder: string;
  variants: ImageVariant[];
}

type ImageManifest = Record<string, ManifestImageEntry>;
const EMPTY_SOURCES: ImageSource[] = [];

export interface ImageElementProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  "data-theme"?: string;
  src: string;
  alt: string;
  variant?: "surface" | "outline" | "highlight" | "thumbnail" | "inline";
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

const resolveNearestDataTheme = (element: HTMLElement | null): string | undefined => {
  if (!element || typeof document === "undefined") {
    return undefined;
  }

  const themedAncestor = element.closest("[data-theme]");
  return themedAncestor?.getAttribute("data-theme") ?? undefined;
};

const manifestPromiseCache = new Map<string, Promise<ImageManifest | null>>();
const componentOrigin = new URL(import.meta.url).origin;

const normalizeKey = (value: string): string => value.toLowerCase().replace(/[^a-z0-9-]/g, "-");

const resolveAssetUrlFromOrigin = (origin: string, assetPath: string): string => {
  if (
    assetPath.startsWith("http://") ||
    assetPath.startsWith("https://") ||
    assetPath.startsWith("data:")
  ) {
    return assetPath;
  }

  const normalizedPath = assetPath.startsWith("/") ? assetPath : `/${assetPath}`;
  return `${origin}${normalizedPath}`;
};

const buildImageSources = (origin: string, variants: ImageVariant[]): ImageSource[] => {
  const sorted = [...variants].sort((a, b) => a.width - b.width);
  const avifSrcSet = sorted
    .map((variant) => `${resolveAssetUrlFromOrigin(origin, variant.avif)} ${variant.width}w`)
    .join(", ");
  const webpSrcSet = sorted
    .map((variant) => `${resolveAssetUrlFromOrigin(origin, variant.webp)} ${variant.width}w`)
    .join(", ");

  return [
    { type: "image/avif", srcSet: avifSrcSet },
    { type: "image/webp", srcSet: webpSrcSet },
  ];
};

const loadImageManifest = (manifestUrl: string): Promise<ImageManifest | null> => {
  const existing = manifestPromiseCache.get(manifestUrl);
  if (existing) {
    return existing;
  }

  const request = fetch(manifestUrl)
    .then((response) => {
      if (!response.ok) {
        return null;
      }
      return response.json() as Promise<ImageManifest>;
    })
    .catch(() => null);

  manifestPromiseCache.set(manifestUrl, request);
  return request;
};

const normalizeImageSrc = (src: string): string => {
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) {
    return src;
  }

  if (!src.includes("/")) {
    return `${componentOrigin}/images/${src}.jpg`;
  }

  const normalizedPath = src.startsWith("/") ? src : `/${src}`;
  return `${componentOrigin}${normalizedPath}`;
};

const decodeSafe = (value: string): string => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

/**
 * Lightweight, themed image primitive for editorial/media usage.
 * Supports responsive <picture> sources and a blur placeholder while loading.
 * If `/images/manifest.json` exists for the image origin, optimization data is auto-applied.
 */
/**
 * Themed image with optional caption, lazy loading, and AVIF/WebP source switching.
 * Use for article images, character portraits, and illustrated content blocks.
 * Supports an optional full-screen modal expand (`enableModal`).
 *
 * @summary themed image with caption and source switching; variant: surface/outline/highlight/thumbnail/inline
 */
export const ImageElement = React.forwardRef<HTMLElement, ImageElementProps>(
  (
    {
      className,
      "data-theme": dataThemeProp,
      src,
      alt,
      variant = "outline",
      theme,
      sources = EMPTY_SOURCES,
      sizes = "100vw",
      placeholderSrc,
      caption,
      loading = "lazy",
      decoding = "async",
      imgClassName,
      width,
      height,
      enableModal,
      ...props
    },
    ref,
  ) => {
    const isModalEnabled = enableModal ?? variant !== "inline";
    const safeAlt = alt.trim() || "Kuva";
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [modalDataTheme, setModalDataTheme] = React.useState<string | undefined>(undefined);
    const [manifestEntry, setManifestEntry] = React.useState<ManifestImageEntry | null>(null);
    const [manifestOrigin, setManifestOrigin] = React.useState<string | null>(null);
    const imgRef = React.useRef<HTMLImageElement | null>(null);
    const triggerRef = React.useRef<HTMLButtonElement | null>(null);
    const closeButtonRef = React.useRef<HTMLButtonElement | null>(null);
    const previouslyFocusedRef = React.useRef<HTMLElement | null>(null);
    const parentTheme = useCurrentTheme();
    const baseTheme = theme ?? parentTheme;
    const resolvedTheme = variant === "surface" ? primaryThemeMap[baseTheme] : theme;
    const childTheme = resolvedTheme ?? baseTheme;
    const captionId = React.useId();
    const autoSources = React.useMemo(() => {
      if (!manifestEntry || !manifestOrigin || sources.length > 0) {
        return undefined;
      }
      return buildImageSources(manifestOrigin, manifestEntry.variants);
    }, [manifestEntry, manifestOrigin, sources]);
    const resolvedSources = autoSources ?? sources;
    const resolvedSourcesKey = React.useMemo(
      () => resolvedSources.map((source) => `${source.type}:${source.srcSet}`).join("|"),
      [resolvedSources],
    );
    const resolvedPlaceholderSrc = placeholderSrc ?? manifestEntry?.placeholder;
    const resolvedWidth = width ?? manifestEntry?.width;
    const resolvedHeight = height ?? manifestEntry?.height;
    const normalizedSrc = React.useMemo(() => normalizeImageSrc(src), [src]);
    const sortedManifestVariants = React.useMemo(() => {
      if (!manifestEntry) {
        return [];
      }
      return [...manifestEntry.variants].sort((a, b) => a.width - b.width);
    }, [manifestEntry]);
    const smallestManifestJpg = React.useMemo(() => {
      const first = sortedManifestVariants[0];
      if (!manifestOrigin || !first) {
        return undefined;
      }
      return resolveAssetUrlFromOrigin(manifestOrigin, first.jpg);
    }, [manifestOrigin, sortedManifestVariants]);
    const largestManifestJpg = React.useMemo(() => {
      const last = sortedManifestVariants[sortedManifestVariants.length - 1];
      if (!manifestOrigin || !last) {
        return undefined;
      }
      return resolveAssetUrlFromOrigin(manifestOrigin, last.jpg);
    }, [manifestOrigin, sortedManifestVariants]);
    const shouldAutoResolveSrc = Boolean(
      manifestEntry && manifestOrigin && sources.length === 0 && smallestManifestJpg,
    );
    const resolvedSrc = React.useMemo(() => {
      if (shouldAutoResolveSrc && smallestManifestJpg) {
        return smallestManifestJpg;
      }
      return normalizedSrc;
    }, [shouldAutoResolveSrc, smallestManifestJpg, normalizedSrc]);
    const modalSrc = largestManifestJpg ?? resolvedSrc;
    const openModal = React.useCallback(() => {
      if (!isModalEnabled) {
        return;
      }
      setModalDataTheme(resolveNearestDataTheme(triggerRef.current));
      previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
      setIsModalOpen(true);
    }, [isModalEnabled]);
    const closeModal = React.useCallback(() => {
      setIsModalOpen(false);
    }, []);

    React.useEffect(() => {
      setIsLoaded(false);
    }, [resolvedSrc, resolvedSourcesKey]);

    React.useEffect(() => {
      if (imgRef.current?.complete) {
        setIsLoaded(true);
      }
    }, [resolvedSrc, resolvedSourcesKey]);

    React.useEffect(() => {
      if (typeof window === "undefined") {
        return;
      }

      if (src.startsWith("data:")) {
        setManifestEntry(null);
        setManifestOrigin(null);
        return;
      }

      let parsedUrl: URL;
      try {
        parsedUrl = new URL(normalizedSrc);
      } catch {
        setManifestEntry(null);
        setManifestOrigin(null);
        return;
      }

      const pathname = parsedUrl.pathname;
      const filename = pathname.split("/").pop() ?? "";
      const decodedFilename = decodeSafe(filename);
      const extensionless = decodedFilename.replace(/\.[^.]+$/, "");
      const key = normalizeKey(extensionless || src);
      const origin = parsedUrl.origin;
      const manifestUrl = `${origin}/images/manifest.json`;
      let cancelled = false;

      loadImageManifest(manifestUrl).then((manifest) => {
        if (cancelled) {
          return;
        }
        if (!manifest) {
          setManifestEntry(null);
          setManifestOrigin(null);
          return;
        }
        const entry = manifest[key];
        setManifestEntry(entry ?? null);
        setManifestOrigin(entry ? origin : null);
      });

      return () => {
        cancelled = true;
      };
    }, [normalizedSrc, src]);

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
                  variant="outline"
                  size="icon"
                  onClick={closeModal}
                  className="self-end"
                >
                  <Icon name="x" />
                </Button>
                <img
                  src={modalSrc}
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

    const pictureContent = (
      <picture
        className={cn("block", {
          "h-full w-full": variant === "thumbnail",
        })}
      >
        {resolvedSources.map((source) => (
          <source
            key={`${source.type}-${source.srcSet}`}
            srcSet={source.srcSet}
            type={source.type}
            sizes={sizes}
          />
        ))}
        <img
          ref={imgRef}
          src={resolvedSrc}
          sizes={sizes}
          alt={alt}
          loading={loading}
          decoding={decoding}
          width={resolvedWidth}
          height={resolvedHeight}
          onLoad={() => setIsLoaded(true)}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-300",
            variant === "thumbnail" && "h-full w-full",
            isLoaded ? "opacity-100" : "opacity-0",
            imgClassName,
          )}
        />
      </picture>
    );

    return (
      <ThemeContext.Provider value={childTheme}>
        <figure
          ref={ref}
          data-theme={resolvedTheme}
          data-variant={variant}
          className={cn(
            "relative overflow-visible rounded-xl",
            {
              // Surface: mirrors Card/StatBlock semantics — swapped theme surface.
              "bg-[var(--theme-bg)] text-[var(--theme-text)]": variant === "surface",
              // Outline: supporting component semantics.
              "bg-transparent text-[var(--theme-secondary)] border border-[var(--theme-secondary)]":
                variant === "outline" || variant === "inline",
              // Highlight: accent framing pattern.
              "bg-[var(--theme-bg)] text-[var(--theme-accent)] border-b-4 border-b-[var(--theme-accent)] border-t-0 border-l-0 border-r-0":
                variant === "highlight",
              // Thumbnail variant: compact media trigger for larger preview.
              "bg-transparent text-[var(--theme-secondary)] border border-[var(--theme-secondary)] w-14 h-14":
                variant === "thumbnail",
            },
            className,
          )}
          {...props}
        >
          {resolvedPlaceholderSrc && !isLoaded && (
            <img
              src={resolvedPlaceholderSrc}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-110 object-cover blur-lg opacity-90 transition-opacity duration-300"
            />
          )}
          {!resolvedPlaceholderSrc && !isLoaded && (
            <div
              aria-hidden="true"
              className={cn("absolute inset-0 animate-pulse", {
                "bg-[var(--theme-primary)]/10": variant === "surface",
                "bg-[var(--theme-secondary)]/20":
                  variant === "outline" || variant === "thumbnail" || variant === "inline",
                "bg-[var(--theme-accent)]/15": variant === "highlight",
              })}
            />
          )}

          {isModalEnabled ? (
            <button
              ref={triggerRef}
              type="button"
              onClick={openModal}
              className={cn(
                "group rounded-xl overflow-hidden block w-full text-left transition-transform duration-400 ease-in",
                variant === "thumbnail" && "h-full w-full rounded-lg",
                "cursor-zoom-in hover:scale-[1.02] hover:rotate-[0.25deg] hover:duration-200 hover:ease-out focus-visible:scale-[1.012] focus-visible:rotate-[0.5deg]",
              )}
              aria-label={`Avaa kuva suurempana: ${safeAlt}`}
              aria-haspopup="dialog"
            >
              {pictureContent}
            </button>
          ) : (
            <div
              className={cn(
                "rounded-xl overflow-hidden block w-full",
                variant === "thumbnail" && "h-full w-full rounded-lg",
              )}
            >
              {pictureContent}
            </div>
          )}

          {caption && (
            <figcaption
              className={cn("border-t px-3 py-2 text-sm", {
                "border-[var(--theme-primary)]/20 text-[var(--theme-text)]/80":
                  variant === "surface",
                "border-[var(--theme-secondary)]/30 text-[var(--theme-secondary)]":
                  variant === "outline" || variant === "inline",
                "border-[var(--theme-accent)]/40 text-[var(--theme-accent)] font-semibold":
                  variant === "highlight",
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
