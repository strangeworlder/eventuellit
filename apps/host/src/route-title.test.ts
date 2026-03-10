import { describe, expect, test } from "vitest";

import { buildDocumentTitle } from "./route-title";

describe("buildDocumentTitle", () => {
  test("returns host title on root", () => {
    expect(buildDocumentTitle("/")).toBe("Eventuellit");
  });

  test("uses known top-level route labels", () => {
    expect(buildDocumentTitle("/generator")).toBe("Eventuellit: Hahmopaja");
    expect(buildDocumentTitle("/ruleset")).toBe("Eventuellit: Säännöt");
    expect(buildDocumentTitle("/episodes")).toBe("Eventuellit: Jaksot");
  });

  test("appends nested route details for microfrontend paths", () => {
    expect(buildDocumentTitle("/ruleset/maailma/perus-asiat")).toBe(
      "Eventuellit: Säännöt - Maailma / Perus Asiat",
    );
  });

  test("normalizes unknown route segments and decodes url values", () => {
    expect(buildDocumentTitle("/oma-mfe/teema%20testi")).toBe("Eventuellit: Oma Mfe - Teema Testi");
  });
});
