import React, { useCallback, useMemo, useState } from "react";
import { type AnchorCardData, drawRandomAnchors, getAnchorById } from "../data/anchors";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { NoticePanel } from "./NoticePanel";
import { useObscured } from "./ObscuredWrapper";
import { type Theme, ThemeContext, useCurrentTheme } from "./Theme";
import { cn, obscureString } from "./utils";

/**
 * Categorise text length into a flex-grow tier so longer
 * labels claim proportionally more row space, matching SkillMasonry.
 */
function growTier(text: string): number {
  const len = text.length;
  if (len <= 10) return 1;
  if (len <= 20) return 2;
  return 3;
}

export interface AnchorSelectorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Currently selected anchor ID (null if none selected) */
  selectedAnchorId?: string | null;
  /** Callback fired when an anchor is selected or deselected */
  onSelectAnchor?: (anchorId: string | null) => void;
  /** List of already claimed anchor IDs excluded from draws */
  claimedAnchorIds?: string[];
  /** If the player already has a locked anchor, pass its ID to display locked state */
  lockedAnchorId?: string | null;
  /** Explicit list of 5 options to display (if omitted, drawn automatically) */
  options?: AnchorCardData[];
  /** Callback fired when a new 5-card batch is rerolled */
  onReroll?: (newOptions: AnchorCardData[]) => void;
  /** Whether the reroll button is allowed (defaults to true) */
  allowReroll?: boolean;
  /** Optional custom heading title */
  title?: string;
  /** Optional custom helper description */
  description?: string;
  /** Theme context override (defaults to "inverted") */
  theme?: Theme;
  /** When true, blurs and disables the selector with an obscured visual effect */
  obscured?: boolean;
  /** Whether to show the explanatory notice panel about permanence and player scope (defaults to true) */
  showNotice?: boolean;
}

/**
 * Organism for drawing and selecting a player-specific Anchor skill.
 * Sister component to skill selection (SkillMasonry): presents options as compact,
 * responsive skill buttons. When an anchor is selected, its hauntological flavor text
 * and dual operational polarities unfold side-by-side (rinnakkain).
 *
 * Uses the inverted theme by default to signal its hauntological, out-of-time origin.
 * Supports obscured mode for unrevealed or hidden content.
 *
 * @summary Skill-like selector for anchor skills with progressive disclosure of dual polarities
 */
export const AnchorSelector = React.forwardRef<HTMLDivElement, AnchorSelectorProps>(
  (
    {
      className,
      selectedAnchorId = null,
      onSelectAnchor,
      claimedAnchorIds = [],
      lockedAnchorId = null,
      options: controlledOptions,
      onReroll,
      allowReroll = true,
      title,
      description,
      theme,
      obscured: obscuredProp,
      showNotice = true,
      ...props
    },
    ref,
  ) => {
    const parentTheme = useCurrentTheme();
    // Default to "inverted" if neither explicit prop nor non-base theme context is provided
    const effectiveTheme: Theme = theme ?? (parentTheme !== "base" ? parentTheme : "inverted");
    const contextObscured = useObscured();
    const isObscured = Boolean(obscuredProp || contextObscured);

    // ── 5 Options State ──
    const [internalOptions, setInternalOptions] = useState<AnchorCardData[]>(
      () => controlledOptions ?? drawRandomAnchors(5, claimedAnchorIds),
    );
    const activeOptions = controlledOptions ?? internalOptions;

    // Handle reroll action: draw 5 fresh available cards
    const handleReroll = useCallback(() => {
      if (isObscured) return;
      const newBatch = drawRandomAnchors(5, claimedAnchorIds);
      setInternalOptions(newBatch);
      if (onReroll) {
        onReroll(newBatch);
      }
    }, [claimedAnchorIds, onReroll, isObscured]);

    // Active selected anchor details
    const selectedAnchor = useMemo(() => {
      if (lockedAnchorId) return getAnchorById(lockedAnchorId);
      if (!selectedAnchorId) return null;
      return getAnchorById(selectedAnchorId);
    }, [lockedAnchorId, selectedAnchorId]);

    // ── Locked Anchor View (Returning player with existing persistent anchor) ──
    if (lockedAnchorId) {
      return (
        <ThemeContext.Provider value={effectiveTheme}>
          <div
            ref={ref}
            data-theme={effectiveTheme}
            aria-hidden={isObscured ? "true" : undefined}
            className={cn(
              "space-y-4 font-sans text-[var(--theme-text)]",
              isObscured && "obscured-wrapper select-none pointer-events-none",
              className,
            )}
            {...props}
          >
            {showNotice && (
              <NoticePanel variant="info" title="Pelaajakohtainen ankkuri">
                <p className="text-sm text-text-muted leading-relaxed">
                  Pelaajakohtainen ankkurisi on lukittu käyttäjätiliisi ja se periytyy
                  automaattisesti{" "}
                  <strong className="text-[var(--theme-text)]">kaikille hahmoillesi</strong>.
                </p>
              </NoticePanel>
            )}

            {selectedAnchor ? (
              <div className="space-y-3">
                {/* Skill-like locked button */}
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm" variant="solid" disabled className="text-left justify-start">
                    <Icon name="anchor" size={14} className="shrink-0" />
                    <span>
                      {isObscured ? obscureString(selectedAnchor.name) : selectedAnchor.name}
                    </span>
                  </Button>
                  <Badge variant="solid">Lukittu ankkuri</Badge>
                </div>

                {/* Side-by-side Dual Polarities Info Panel */}
                <div className="rounded-sm border border-[var(--theme-border-medium)] bg-[var(--theme-surface-tint)] p-4 space-y-3">
                  {selectedAnchor.description && (
                    <p className="text-sm text-text-muted leading-relaxed italic border-l-2 border-[var(--theme-border-medium)] pl-3">
                      {isObscured
                        ? obscureString(selectedAnchor.description)
                        : selectedAnchor.description}
                    </p>
                  )}

                  <div className="grid grid-cols-1 tablet:grid-cols-2 gap-3 pt-1">
                    <div className="rounded-sm border border-[var(--theme-border-soft)] bg-[var(--theme-bg)] p-3.5 space-y-1.5 border-l-[3px] border-l-[var(--theme-secondary)]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-secondary)]" />
                        <span className="text-2xs font-mono uppercase tracking-wider text-[var(--theme-secondary)] font-semibold">
                          Polariteetti A
                        </span>
                      </div>
                      <h5 className="font-heading text-sm font-bold uppercase tracking-wide text-[var(--theme-text)]">
                        {isObscured
                          ? obscureString(selectedAnchor.polarityA.title)
                          : selectedAnchor.polarityA.title}
                      </h5>
                      <p className="text-xs text-text-muted leading-relaxed">
                        {isObscured
                          ? obscureString(selectedAnchor.polarityA.description)
                          : selectedAnchor.polarityA.description}
                      </p>
                    </div>

                    <div className="rounded-sm border border-[var(--theme-border-soft)] bg-[var(--theme-bg)] p-3.5 space-y-1.5 border-l-[3px] border-l-[var(--theme-accent)]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-accent)]" />
                        <span className="text-2xs font-mono uppercase tracking-wider text-[var(--theme-accent)] font-semibold">
                          Polariteetti B
                        </span>
                      </div>
                      <h5 className="font-heading text-sm font-bold uppercase tracking-wide text-[var(--theme-text)]">
                        {isObscured
                          ? obscureString(selectedAnchor.polarityB.title)
                          : selectedAnchor.polarityB.title}
                      </h5>
                      <p className="text-xs text-text-muted leading-relaxed">
                        {isObscured
                          ? obscureString(selectedAnchor.polarityB.description)
                          : selectedAnchor.polarityB.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-text-muted">
                Ankkuria ei löytynyt tunnuksella ({lockedAnchorId}).
              </p>
            )}
          </div>
        </ThemeContext.Provider>
      );
    }

    return (
      <ThemeContext.Provider value={effectiveTheme}>
        <div
          ref={ref}
          data-theme={effectiveTheme}
          aria-hidden={isObscured ? "true" : undefined}
          className={cn(
            "space-y-4 font-sans text-[var(--theme-text)]",
            isObscured && "obscured-wrapper select-none pointer-events-none",
            className,
          )}
          {...props}
        >
          {/* Optional Header */}
          {(title || description) && (
            <div className="space-y-1 border-b border-[var(--theme-border-soft)] pb-2">
              {title && (
                <h3 className="font-heading text-base font-bold text-[var(--theme-text)] uppercase tracking-wide">
                  {title}
                </h3>
              )}
              {description && <p className="text-xs text-text-muted">{description}</p>}
            </div>
          )}

          {/* Empty state fallback */}
          {activeOptions.length === 0 ? (
            <NoticePanel variant="info" title="Ei vapaita ankkureita">
              <p className="text-sm text-text-muted">Kaikki ankkurit ovat varattuja.</p>
            </NoticePanel>
          ) : (
            <div className="space-y-4">
              {/* Informative notice about permanence and player-wide scope */}
              {showNotice && (
                <NoticePanel variant="info" title="Pysyvä pelaajakohtainen valinta">
                  <p className="text-sm text-text-muted leading-relaxed">
                    Ankkuri sidotaan käyttäjätiliisi ja se tulee voimaan{" "}
                    <strong className="text-[var(--theme-text)]">kaikille hahmoillesi</strong> (sekä
                    nykyisille että tuleville). Valintaa ei voi muuttaa myöhemmin, ja valitsemasi
                    ankkuri on uniikki – se varataan vain sinulle.
                  </p>
                </NoticePanel>
              )}

              {/* ── Skill-Like Selector Buttons (Mirroring SkillMasonry) ── */}
              <div className="flex flex-wrap gap-2.5">
                {activeOptions.map((opt) => {
                  const isSelected = selectedAnchorId === opt.id;
                  return (
                    <Button
                      key={opt.id}
                      size="sm"
                      variant={isSelected ? "solid" : "outline"}
                      disabled={isObscured}
                      className="text-left justify-start"
                      style={{
                        flexGrow: growTier(opt.name),
                        flexBasis: 0,
                        minWidth: "fit-content",
                      }}
                      onClick={() => {
                        if (isObscured) return;
                        onSelectAnchor?.(isSelected ? null : opt.id);
                      }}
                    >
                      <Icon name="anchor" size={14} className="shrink-0" />
                      <span>{isObscured ? obscureString(opt.name) : opt.name}</span>
                    </Button>
                  );
                })}

                {/* Reroll Button alongside options */}
                {allowReroll && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isObscured}
                    className="border-dashed text-text-muted hover:text-[var(--theme-text)] shrink-0"
                    onClick={handleReroll}
                    title="Arvo 5 uutta vaihtoehtoa vapaista ankkureista"
                  >
                    <Icon name="dice5" size={14} className="shrink-0" />
                    <span>Arvo uudet 5</span>
                  </Button>
                )}
              </div>

              {/* ── Progressive Disclosure: More Info Shown When Selected ── */}
              {selectedAnchor && (
                <div className="rounded-sm border border-[var(--theme-border-medium)] bg-[var(--theme-surface-tint)] p-4 space-y-3 animate-in fade-in duration-200">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--theme-border-soft)] pb-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-6 h-6 rounded flex items-center justify-center shrink-0 bg-[var(--theme-primary)] text-[var(--theme-primary-foreground)]">
                        <Icon name="anchor" size={13} />
                      </span>
                      <h4 className="font-heading text-sm font-bold uppercase tracking-wide text-[var(--theme-text)] truncate">
                        {isObscured ? obscureString(selectedAnchor.name) : selectedAnchor.name}
                      </h4>
                      <span className="text-2xs font-mono uppercase tracking-wider text-text-muted hidden phone:inline">
                        (Ankkuritaito)
                      </span>
                    </div>

                    <Button
                      variant="ghost"
                      size="compact"
                      disabled={isObscured}
                      className="text-xs text-text-muted hover:text-[var(--theme-primary)]"
                      onClick={() => {
                        if (isObscured) return;
                        onSelectAnchor?.(null);
                      }}
                    >
                      <Icon name="x" size={13} />
                      Poista valinta
                    </Button>
                  </div>

                  {selectedAnchor.description && (
                    <p className="text-sm text-text-muted leading-relaxed italic border-l-2 border-[var(--theme-border-medium)] pl-3">
                      {isObscured
                        ? obscureString(selectedAnchor.description)
                        : selectedAnchor.description}
                    </p>
                  )}

                  {/* ── Side-by-Side Dual Polarities (Rinnakkain) ── */}
                  <div className="grid grid-cols-1 tablet:grid-cols-2 gap-3 pt-1">
                    {/* Polariteetti A */}
                    <div className="rounded-sm border border-[var(--theme-border-soft)] bg-[var(--theme-bg)] p-3.5 space-y-1.5 border-l-[3px] border-l-[var(--theme-secondary)]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-secondary)]" />
                        <span className="text-2xs font-mono uppercase tracking-wider text-[var(--theme-secondary)] font-semibold">
                          Polariteetti A
                        </span>
                      </div>
                      <h5 className="font-heading text-sm font-bold uppercase tracking-wide text-[var(--theme-text)]">
                        {isObscured
                          ? obscureString(selectedAnchor.polarityA.title)
                          : selectedAnchor.polarityA.title}
                      </h5>
                      <p className="text-xs text-text-muted leading-relaxed">
                        {isObscured
                          ? obscureString(selectedAnchor.polarityA.description)
                          : selectedAnchor.polarityA.description}
                      </p>
                    </div>

                    {/* Polariteetti B */}
                    <div className="rounded-sm border border-[var(--theme-border-soft)] bg-[var(--theme-bg)] p-3.5 space-y-1.5 border-l-[3px] border-l-[var(--theme-accent)]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-accent)]" />
                        <span className="text-2xs font-mono uppercase tracking-wider text-[var(--theme-accent)] font-semibold">
                          Polariteetti B
                        </span>
                      </div>
                      <h5 className="font-heading text-sm font-bold uppercase tracking-wide text-[var(--theme-text)]">
                        {isObscured
                          ? obscureString(selectedAnchor.polarityB.title)
                          : selectedAnchor.polarityB.title}
                      </h5>
                      <p className="text-xs text-text-muted leading-relaxed">
                        {isObscured
                          ? obscureString(selectedAnchor.polarityB.description)
                          : selectedAnchor.polarityB.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </ThemeContext.Provider>
    );
  },
);

AnchorSelector.displayName = "AnchorSelector";
