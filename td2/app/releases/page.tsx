// app/releases/page.tsx - Server Component

import { Music } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReleasesClient from "./releases-client";

async function getInitialData() {
  // Example: get initial tracked artists count, cache status, etc.
  // This runs on the server, so you can do database queries here
  return {
    trackedArtistsCount: 0, // Will be updated by client
    lastRefresh: null,
    hasCachedData: false,
  };
}

export default async function ReleasesPage() {
  const initialData = await getInitialData();

  return (
    <div className="container mx-auto p-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Music className="h-6 w-6" />
              Latest Releases
              {initialData.trackedArtistsCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {initialData.trackedArtistsCount} artists tracked
                </Badge>
              )}
            </CardTitle>
            {initialData.lastRefresh && (
              <p className="text-sm text-muted-foreground mt-1">
                Last updated:{" "}
                {new Date(initialData.lastRefresh).toLocaleString("en-AU")}
              </p>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <ReleasesClient initialData={initialData} />
        </CardContent>
      </Card>
    </div>
  );
}
