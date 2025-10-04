import { Music2, TrendingUp, Clock, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import SearchClient from "./search-client";

// This could come from your database or API
async function getSearchStats() {
  // Example: get stats about tracked artists, recent searches, etc.
  return {
    totalTrackedArtists: 42,
    recentReleases: 18,
    newThisWeek: 5,
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const stats = await getSearchStats();
  const params = await searchParams;
  const initialQuery = params.q || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-6 py-12">
        {/* Hero Section - Server Rendered */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Music2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Discover New Music
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Search for your favourite artists and track their latest releases.
            Never miss a new album again.
          </p>
        </div>

        {/* Search Section - Client Component */}
        <SearchClient initialQuery={initialQuery} />

        {/* Stats Section - Server Rendered with Dynamic Data */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center p-6 border-0 bg-card/30 backdrop-blur">
              <TrendingUp className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-1">Track Artists</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Never miss a new release from your favourite artists
              </p>
              {stats.totalTrackedArtists > 0 && (
                <p className="text-xs font-medium text-primary">
                  {stats.totalTrackedArtists} artists tracked
                </p>
              )}
            </Card>

            <Card className="text-center p-6 border-0 bg-card/30 backdrop-blur">
              <Clock className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-1">Latest Releases</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Get notified when new albums drop
              </p>
              {stats.newThisWeek > 0 && (
                <p className="text-xs font-medium text-primary">
                  {stats.newThisWeek} new this week
                </p>
              )}
            </Card>

            <Card className="text-center p-6 border-0 bg-card/30 backdrop-blur">
              <Plus className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-1">Build Your List</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Create a personalised music discovery feed
              </p>
              {stats.recentReleases > 0 && (
                <p className="text-xs font-medium text-primary">
                  {stats.recentReleases} recent releases
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
