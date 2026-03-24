import React from "react";

/**
 * Encapsulates the randomised glitch-animation timing used by every
 * obscured form element so we don't repeat the same two `useMemo`
 * calls in every component.
 *
 * Returns a stable `style` object ready to spread onto the element.
 */
export function useObscuredGlitch(obscured: boolean) {
  const glitchDuration = React.useMemo(
    () => (obscured ? 4 + Math.random() * 5 : 6),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const glitchDelay = React.useMemo(
    () => (obscured ? Math.random() * 6 : 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const glitchStyle: React.CSSProperties | undefined = obscured
    ? ({
        "--glitch-delay": `-${glitchDelay.toFixed(2)}s`,
        "--glitch-duration": `${glitchDuration.toFixed(2)}s`,
      } as React.CSSProperties)
    : undefined;

  return { glitchDuration, glitchDelay, glitchStyle };
}
