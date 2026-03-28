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
          <button
            type="button"
            className="text-left"
            onClick={() => navigate(navTo(prev.id, basePath))}
          >
            <Card variant="interactive" className="h-full">
              <CardHeader className="border-b-0 pb-2">
                <Text variant="muted" className="text-xs uppercase tracking-widest flex items-center gap-1">
                  <Icon name="chevron-left" size={12} aria-hidden="true" />
                  Edellinen
                </Text>
              </CardHeader>
              <CardContent variant="dense">
                <CardTitle>{prev.title}</CardTitle>
              </CardContent>
            </Card>
          </button>
        ) : (
          <div />
        )}

        {next ? (
          <button
            type="button"
            className="text-left tablet:text-right"
            onClick={() => navigate(navTo(next.id, basePath))}
          >
            <Card variant="interactive" className="h-full">
              <CardHeader className="border-b-0 pb-2">
                <Text variant="muted" className="text-xs uppercase tracking-widest flex items-center gap-1 tablet:justify-end">
                  Seuraava
                  <Icon name="chevron-right" size={12} aria-hidden="true" />
                </Text>
              </CardHeader>
              <CardContent variant="dense">
                <CardTitle>{next.title}</CardTitle>
              </CardContent>
            </Card>
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
