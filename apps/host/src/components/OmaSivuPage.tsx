import { useAuth } from "@repo/auth/use-auth";
import { HeadingLevelContext } from "@repo/ui/components/Heading";
import { PageBody } from "@repo/ui/components/Page";
import { Separator } from "@repo/ui/components/Separator";
import { GmOverview } from "./GmOverview";
import { PlayerDashboard } from "./PlayerDashboard";

export function OmaSivuPage() {
  const { user } = useAuth();
  const isGm = user?.role === "gm";

  return (
    <HeadingLevelContext.Provider value={2}>
      <PageBody>
        <div className="space-y-12">
          <PlayerDashboard />

          {isGm && (
            <>
              <Separator />
              <GmOverview />
            </>
          )}
        </div>
      </PageBody>
    </HeadingLevelContext.Provider>
  );
}
