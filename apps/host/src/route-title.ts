const HOST_TITLE = "Eventuellit";

const TOP_LEVEL_ROUTE_TITLES: Record<string, string> = {
  generator: "Hahmopaja",
  ruleset: "Säännöt",
  episodes: "Jaksot",
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

  const nestedTitle = nestedSegments.map(normalizePathSegment).filter(Boolean).join(" / ");
  if (!nestedTitle) {
    return topLevelTitle ? `${HOST_TITLE}: ${topLevelTitle}` : HOST_TITLE;
  }

  if (!topLevelTitle) {
    return `${HOST_TITLE}: ${nestedTitle}`;
  }

  return `${HOST_TITLE}: ${topLevelTitle} - ${nestedTitle}`;
};
