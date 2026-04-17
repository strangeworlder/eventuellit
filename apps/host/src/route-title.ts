const HOST_TITLE = "Eventuellit";

const TOP_LEVEL_ROUTE_TITLES: Record<string, string> = {
  generator: "Hahmopaja",
  ruleset: "Säännöt",
  episodes: "Jaksot",
  world: "Maailma",
  ship: "Alus",
  "oma-sivu": "Oma sivu",
  muutosloki: "Muutosloki",
};

/** Human-readable titles for world sub-route segments (category ids). */
const WORLD_CATEGORY_TITLES: Record<string, string> = {
  kynnys: "Kynnys",
};

const toTitleCase = (value: string) =>
  value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const decodePathSegment = (segment: string) => {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
};

const normalizePathSegment = (segment: string) => {
  const decodedSegment = decodePathSegment(segment);
  const withSpaces = decodedSegment.replace(/[-_]+/g, " ").trim();

  if (!withSpaces) {
    return "";
  }

  return toTitleCase(withSpaces);
};

export const buildDocumentTitle = (pathname: string): string => {
  const cleanedPath = pathname.split("?")[0]?.split("#")[0] ?? "";
  const pathSegments = cleanedPath.split("/").filter(Boolean);

  if (pathSegments.length === 0) {
    return HOST_TITLE;
  }

  const [topLevelRoute, ...nestedSegments] = pathSegments;
  const topLevelTitle =
    TOP_LEVEL_ROUTE_TITLES[topLevelRoute] ?? normalizePathSegment(topLevelRoute) ?? "";

  if (nestedSegments.length === 0) {
    return topLevelTitle ? `${HOST_TITLE}: ${topLevelTitle}` : HOST_TITLE;
  }

  // For world routes, resolve known category segment labels before normalizing
  const resolveNestedSegment = (segment: string, index: number): string => {
    if (topLevelRoute === "world" && index === 0) {
      return WORLD_CATEGORY_TITLES[segment] ?? normalizePathSegment(segment);
    }
    return normalizePathSegment(segment);
  };

  const nestedTitle = nestedSegments
    .map((seg, i) => resolveNestedSegment(seg, i))
    .filter(Boolean)
    .join(" / ");

  if (!nestedTitle) {
    return topLevelTitle ? `${HOST_TITLE}: ${topLevelTitle}` : HOST_TITLE;
  }

  if (!topLevelTitle) {
    return `${HOST_TITLE}: ${nestedTitle}`;
  }

  return `${HOST_TITLE}: ${topLevelTitle} - ${nestedTitle}`;
};
