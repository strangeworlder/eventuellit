import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/Card";
import { Icon } from "@repo/ui/components/Icon";
import { Separator } from "@repo/ui/components/Separator";
import { Text } from "@repo/ui/components/Text";

interface ChapterNavEntry {
  id: string;
  title: string;
}

interface ChapterNavProps {
  prev: ChapterNavEntry | null;
  next: ChapterNavEntry | null;
  basePath: string;
}

function navTo(id: string, basePath: string) {
  return basePath === "/" ? `/${id}` : `${basePath}/${id}`;
}

export function ChapterNav({ prev, next, basePath }: ChapterNavProps) {
  const navigate = useNavigate();

  if (!prev && !next) return null;

  return (
    <div className="mt-12">
      <Separator variant="soft" className="mb-8" />
      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
        {prev ? (
          <Card
            variant="interactive"
            className="h-full text-left"
            role="link"
            tabIndex={0}
            onClick={() => navigate(navTo(prev.id, basePath))}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate(navTo(prev.id, basePath));
              }
            }}
          >
            <CardHeader className="border-b-0 pb-2">
              <Text variant="label" className="flex items-center gap-1 normal-case">
                <Icon name="chevron-left" size={12} aria-hidden="true" />
                Edellinen
              </Text>
            </CardHeader>
            <CardContent variant="dense">
              <CardTitle>{prev.title}</CardTitle>
            </CardContent>
          </Card>
        ) : (
          <div />
        )}

        {next ? (
          <Card
            variant="interactive"
            className="h-full text-left tablet:text-right"
            role="link"
            tabIndex={0}
            onClick={() => navigate(navTo(next.id, basePath))}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate(navTo(next.id, basePath));
              }
            }}
          >
            <CardHeader className="border-b-0 pb-2">
              <Text
                variant="label"
                className="flex items-center gap-1 tablet:justify-end normal-case"
              >
                Seuraava
                <Icon name="chevron-right" size={12} aria-hidden="true" />
              </Text>
            </CardHeader>
            <CardContent variant="dense">
              <CardTitle>{next.title}</CardTitle>
            </CardContent>
          </Card>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
