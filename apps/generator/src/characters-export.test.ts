import { describe, expect, it } from "vitest";
import { enrichCharacterMarkdownAnchors } from "./api/characters";

describe("enrichCharacterMarkdownAnchors", () => {
  it("resolves known anchor IDs to Finnish anchor card names, descriptions, and polarities", () => {
    const rawMarkdown = [
      "### Jackslaw",
      "",
      "- **Arkkityyppi:** Sotilas",
      "- **Pelaajan Ankkuri:** `kuilu`",
      "",
      "#### Resurssit",
    ].join("\n");

    const enriched = enrichCharacterMarkdownAnchors(rawMarkdown);

    expect(enriched).toContain("- **Pelaajan Ankkuri:** **Kuilu** — Painoton huimaus");
    expect(enriched).toContain(
      "*(Polariteetit: Syöksy: Putoaminen ilman pohjaa. / Pysähdys: Liikkumattomuus romahduksen keskellä.)*",
    );
  });

  it("leaves unknown anchor IDs intact", () => {
    const rawMarkdown = "- **Pelaajan Ankkuri:** `tuntematon-ankkuri`";
    expect(enrichCharacterMarkdownAnchors(rawMarkdown)).toBe(rawMarkdown);
  });
});
