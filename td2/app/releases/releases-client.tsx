"use client";

import { useState, useEffect } from "react";
import {
  RefreshCw,
  Music,
  Download,
  Upload,
  Calendar,
  User,
  Play,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Album, Track, TrackedArtist } from "@/lib/types";
import {
  getArtistsLatestAlbums,
  getAlbumTracks,
  formatDuration,
  formatReleaseDate,
} from "@/lib/deezer-api";

// Component-specific types
interface LoadingState {
  isLoading: boolean;
  progress: number;
  total: number;
}

interface ReleasesClientProps {
  initialData: {
    trackedArtistsCount: number;
    lastRefresh: string | null;
    hasCachedData: boolean;
  };
}

// Mock database functions - replace with your actual database implementation
const db = {
  trackedArtists: {
    async toArray(): Promise<TrackedArtist[]> {
      const stored = localStorage.getItem("trackedArtists");
      return stored ? JSON.parse(stored) : [];
    },

    async add(artist: TrackedArtist): Promise<void> {
      const current = await this.toArray();
      const updated = [
        ...current,
        { ...artist, dateAdded: new Date().toISOString() },
      ];
      localStorage.setItem("trackedArtists", JSON.stringify(updated));
    },

    async remove(artistId: number): Promise<void> {
      const current = await this.toArray();
      const filtered = current.filter((a) => a.id !== artistId);
      localStorage.setItem("trackedArtists", JSON.stringify(filtered));
    },
  },
};

// Simple cache implementation
const cacheService = {
  get<T>(key: string): T | null {
    const cached = localStorage.getItem(`cache_${key}`);
    if (!cached) return null;

    try {
      const data = JSON.parse(cached);
      if (Date.now() > data.expiry) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }
      return data.value;
    } catch {
      return null;
    }
  },

  set(key: string, value: any, ttl = 3600000): void {
    // 1 hour default
    localStorage.setItem(
      `cache_${key}`,
      JSON.stringify({
        value,
        expiry: Date.now() + ttl,
      }),
    );
  },

  clear(): void {
    Object.keys(localStorage)
      .filter((key) => key.startsWith("cache_"))
      .forEach((key) => localStorage.removeItem(key));
  },
};

export default function ReleasesClient({ initialData }: ReleasesClientProps) {
  const [releases, setReleases] = useState<Album[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    progress: 0,
    total: 0,
  });
  const [showTracks, setShowTracks] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTrackedArtists();
  }, []);

  const loadTrackedArtists = async (forceRefresh = false) => {
    setError(null);
    setLoadingState({ isLoading: true, progress: 0, total: 0 });

    try {
      const trackedArtists = await db.trackedArtists.toArray();

      if (trackedArtists.length === 0) {
        setReleases([]);
        setLoadingState({ isLoading: false, progress: 0, total: 0 });
        return;
      }

      setLoadingState((prev) => ({ ...prev, total: trackedArtists.length }));

      if (forceRefresh) {
        cacheService.clear();
      }

      // Process artists in batches to avoid rate limiting
      const batchSize = 5;
      const batches: TrackedArtist[][] = [];

      for (let i = 0; i < trackedArtists.length; i += batchSize) {
        batches.push(trackedArtists.slice(i, i + batchSize));
      }

      const allReleases: Album[] = [];

      for (const batch of batches) {
        const artistIds = batch.map((artist) => artist.id);

        try {
          const latestAlbums = await getArtistsLatestAlbums(artistIds);
          allReleases.push(...latestAlbums);

          setLoadingState((prev) => ({
            ...prev,
            progress: prev.progress + batch.length,
          }));
        } catch (batchError) {
          console.error("Error processing batch:", batchError);
          // Continue with other batches
        }

        // Small delay between batches to be respectful to the API
        if (batches.indexOf(batch) < batches.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      }

      setReleases(allReleases);
    } catch (error) {
      console.error("Error loading tracked artists:", error);
      setError("Failed to load releases. Please try refreshing.");
    } finally {
      setLoadingState({ isLoading: false, progress: 0, total: 0 });
    }
  };

  const refreshReleases = () => {
    loadTrackedArtists(true);
  };

  const openTrackChooser = async (album: Album) => {
    setSelectedAlbum(album);

    try {
      const trackList = await getAlbumTracks(album.id);
      setTracks(trackList);
      setShowTracks(true);
    } catch (error) {
      console.error("Error loading tracks:", error);
      setError("Failed to load tracks for this album.");
    }
  };

  const getRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  const isRecentRelease = (dateString: string): boolean => {
    const date = new Date(dateString);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return date >= thirtyDaysAgo;
  };

  return (
    <>
      <div className="flex flex-row items-center justify-between mb-6">
        <div>
          {releases.length > 0 && (
            <Badge variant="secondary">{releases.length} releases</Badge>
          )}
          {loadingState.isLoading && (
            <p className="text-sm text-muted-foreground mt-1">
              Loading... ({loadingState.progress}/{loadingState.total})
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button
            onClick={refreshReleases}
            disabled={loadingState.isLoading}
            variant="outline"
            size="sm"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loadingState.isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Simple error display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <p className="text-red-800 dark:text-red-200">{error}</p>
            <Button
              variant="link"
              size="sm"
              className="ml-auto text-red-600 dark:text-red-400 underline"
              onClick={() => setError(null)}
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {loadingState.isLoading && releases.length === 0 ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
      ) : releases.length === 0 ? (
        <div className="text-center py-12">
          <Music className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-medium mb-2">No releases found</h3>
          <p className="text-muted-foreground mb-4">
            Start by adding some artists to track their latest releases.
          </p>
          <Button variant="outline">Add Artists</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {releases.map((release) => (
            <Card
              key={`${release.id}-${release.artist.id}`}
              className="transition-all hover:shadow-md cursor-pointer border-l-4 border-l-transparent hover:border-l-primary"
              onClick={() => openTrackChooser(release)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 rounded-md">
                    <AvatarImage
                      src={release.cover_medium || release.cover}
                      alt={release.title}
                    />
                    <AvatarFallback className="rounded-md text-lg">
                      {release.title.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate text-lg">
                        {release.title}
                      </h3>
                      {isRecentRelease(release.release_date) && (
                        <Badge
                          variant="default"
                          className="bg-green-500 hover:bg-green-600"
                        >
                          New
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-muted-foreground text-sm">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{release.artist.name}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatReleaseDate(release.release_date)}</span>
                      </div>
                      <span>•</span>
                      <span className="text-xs">
                        {getRelativeTime(release.release_date)}
                      </span>
                    </div>
                  </div>

                  <Button variant="ghost" size="sm" className="shrink-0">
                    <Play className="h-4 w-4 mr-2" />
                    View Tracks
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Track Selection Dialog */}
      <Dialog open={showTracks} onOpenChange={setShowTracks}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader className="flex flex-row items-center gap-3 pb-4">
            <Avatar className="h-12 w-12 rounded-md">
              <AvatarImage
                src={selectedAlbum?.cover_medium || selectedAlbum?.cover}
                alt={selectedAlbum?.title}
              />
              <AvatarFallback className="rounded-md">🎵</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-left">
                {selectedAlbum?.title}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                by {selectedAlbum?.artist.name}
              </p>
            </div>
          </DialogHeader>

          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {tracks.map((track, index) => (
                <div
                  key={track.id}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors group"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {index + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{track.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatDuration(track.duration)}
                    </p>
                  </div>

                  {track.preview && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
