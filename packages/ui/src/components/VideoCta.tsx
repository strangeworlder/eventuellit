import { Button } from "./Button";

export interface VideoCtaProps {
  /**
   * YouTube video ID
   */
  youtubeId: string;
  /**
   * Title of the iframe, useful for accessibility
   */
  title?: string;
  /**
   * Text for the call to action button
   */
  ctaText: string;
  /**
   * Handler for when the CTA button is clicked
   */
  onClickCta: () => void;
  /**
   * Optional custom classes for the container
   */
  className?: string;
}

export function VideoCta({
  youtubeId,
  title = "Videosoitin",
  ctaText,
  onClickCta,
  className = "",
}: VideoCtaProps) {
  return (
    <div className={`w-full flex flex-col items-center gap-6 mobile:gap-8 ${className}`}>
      <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-[var(--theme-text)]/10 bg-[var(--theme-bg)]/50 relative">
        <iframe
          className="absolute inset-0 w-full h-full border-0"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>

      <Button
        size="lg"
        variant="primary"
        onClick={onClickCta}
        className="w-full mobile:w-auto mobile:min-w-[280px] shadow-lg shadow-[var(--theme-primary)]/20 hover:shadow-xl hover:shadow-[var(--theme-primary)]/30 hover:-translate-y-1 transition-all duration-300"
      >
        {ctaText}
      </Button>
    </div>
  );
}
