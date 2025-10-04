"use client";

import { useState, useEffect, useRef } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Album, Track } from "@/lib/types";
import { db, TrackedArtist } from "@/db";
import {
  getArtistAlbums,
  getAlbumTracks,
  formatReleaseDate,
} from "@/lib/deezer-api";
import { AlbumTracksDialog } from "@/components/dialogs/track-select-dialog";

// Component-specific types
interface LoadingState {
  isLoading: boolean;
  progress: number;
  total: number;
}

interface TrackState {
  tracks: Track[];
  isLoading: boolean;
  error: string | null;
  playingTrackId?: number;
}

interface ReleasesClientProps {
  initialData: {
    trackedArtistsCount: number;
    lastRefresh: string | null;
    hasCachedData: boolean;
  };
}

interface AlbumWithArtist extends Album {
  artist: {
    id: number;
    name: string;
    picture_medium?: string;
  };
}

export default function ReleasesClient({ initialData }: ReleasesClientProps) {
  const [releases, setReleases] = useState<AlbumWithArtist[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumWithArtist | null>(
    null,
  );
  const [trackedArtistsCount, setTrackedArtistsCount] = useState(
    initialData.trackedArtistsCount,
  );
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    progress: 0,
    total: 0,
  });
  const [trackState, setTrackState] = useState<TrackState>({
    tracks: [],
    isLoading: false,
    error: null,
    playingTrackId: undefined,
  });
  const [showTracks, setShowTracks] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    loadTrackedArtists();
  }, []);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const loadTrackedArtists = async (forceRefresh = false) => {
    setError(null);
    setLoadingState({ isLoading: true, progress: 0, total: 0 });

    try {
      const trackedArtists = await db.trackedArtists.toArray();
      setTrackedArtistsCount(trackedArtists.length);

      if (trackedArtists.length === 0) {
        setReleases([]);
        setLoadingState({ isLoading: false, progress: 0, total: 0 });
        return;
      }

      setLoadingState((prev) => ({ ...prev, total: trackedArtists.length }));

      // Process artists in batches to avoid rate limiting
      const batchSize = 5;
      const batches: TrackedArtist[][] = [];

      for (let i = 0; i < trackedArtists.length; i += batchSize) {
        batches.push(trackedArtists.slice(i, i + batchSize));
      }

      const allReleases: AlbumWithArtist[] = [];

      for (const batch of batches) {
        try {
          // Process each artist in the batch
          for (const artist of batch) {
            let albumWithArtist: AlbumWithArtist | null = null;

            // Check if we should update from API or use cached data
            if (
              forceRefresh ||
              (await db.shouldUpdateArtistRelease(artist.id, 24))
            ) {
              // Fetch fresh data from API
              const albums = await getArtistAlbums(artist.id);

              if (albums.length > 0) {
                const latestAlbum = albums[0];

                // Update database cache
                await db.updateArtistRelease(
                  artist.id,
                  artist.name,
                  latestAlbum,
                );

                // Create album with artist info
                albumWithArtist = {
                  ...latestAlbum,
                  artist: {
                    id: artist.id,
                    name: artist.name,
                    picture_medium: artist.picture_medium,
                  },
                };
              } else {
                // No albums found, update cache with null
                await db.updateArtistRelease(artist.id, artist.name, undefined);
              }
            } else {
              // Use cached data
              const cachedRelease = await db.getArtistRelease(artist.id);
              if (cachedRelease?.latestAlbum) {
                albumWithArtist = {
                  ...cachedRelease.latestAlbum,
                  artist: {
                    id: artist.id,
                    name: artist.name,
                    picture_medium: artist.picture_medium,
                  },
                };
              }
            }

            if (albumWithArtist) {
              allReleases.push(albumWithArtist);
            }

            setLoadingState((prev) => ({
              ...prev,
              progress: prev.progress + 1,
            }));
          }
        } catch (batchError) {
          console.error("Error processing batch:", batchError);
          // Continue with other batches
        }

        // Small delay between batches to be respectful to the API
        if (batches.indexOf(batch) < batches.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      }

      // Sort by release date (newest first)
      allReleases.sort(
        (a, b) =>
          new Date(b.release_date).getTime() -
          new Date(a.release_date).getTime(),
      );

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

  const openTrackChooser = async (album: AlbumWithArtist) => {
    setSelectedAlbum(album);
    setTrackState({
      tracks: [],
      isLoading: true,
      error: null,
      playingTrackId: undefined,
    });
    setShowTracks(true);

    // Stop any playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    try {
      const trackList = await getAlbumTracks(album.id);
      setTrackState((prev) => ({
        ...prev,
        tracks: trackList,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error loading tracks:", error);
      setTrackState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to load tracks for this album.",
      }));
    }
  };

  const handlePlayPreview = (track: Track) => {
    if (!track.preview) return;

    // If the same track is playing, pause it
    if (audioRef.current && trackState.playingTrackId === track.id) {
      audioRef.current.pause();
      audioRef.current = null;
      setTrackState((prev) => ({ ...prev, playingTrackId: undefined }));
      return;
    }

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Start playing new audio
    const audio = new Audio(track.preview);
    audioRef.current = audio;
    setTrackState((prev) => ({ ...prev, playingTrackId: track.id }));
    audio.play();

    // Clean up when audio ends
    audio.addEventListener("ended", () => {
      audioRef.current = null;
      setTrackState((prev) => ({ ...prev, playingTrackId: undefined }));
    });
  };

  const handleDialogClose = (open: boolean) => {
    setShowTracks(open);
    if (!open) {
      // Stop any playing audio when dialog closes
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setTrackState({
        tracks: [],
        isLoading: false,
        error: null,
        playingTrackId: undefined,
      });
    }
  };

  const handleRetryTracks = () => {
    if (selectedAlbum) {
      openTrackChooser(selectedAlbum);
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
          {trackedArtistsCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              Tracking {trackedArtistsCount} artists
            </p>
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

      {/* Error display */}
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
      <AlbumTracksDialog
        open={showTracks}
        onOpenChange={handleDialogClose}
        album={selectedAlbum}
        tracks={trackState.tracks}
        isLoading={trackState.isLoading}
        error={trackState.error}
        playingTrackId={trackState.playingTrackId}
        onBack={() => handleDialogClose(false)}
        onPlayPreview={handlePlayPreview}
        onRetry={handleRetryTracks}
      />
    </>
  );
}
