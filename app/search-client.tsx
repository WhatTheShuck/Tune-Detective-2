"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Loader2, Command as CommandIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Artist, Album, Track } from "@/lib/types";
import {
  searchArtists,
  getArtistAlbums,
  getAlbumTracks,
} from "@/lib/deezer-api";
import { db } from "@/db";

// Import the dialog components
import { ArtistSelectionDialog } from "@/components/dialogs/artist-select-dialog";
import { AlbumSelectionDialog } from "@/components/dialogs/album-select-dialog";
import { AlbumTracksDialog } from "@/components/dialogs/track-select-dialog";
import { useSearch } from "@/components/providers/search-provider";

// Component-specific types
interface SearchState {
  query: string;
  isSearching: boolean;
  results: Artist[];
  selectedArtist: Artist | null;
  error: string | null;
}

interface AlbumState {
  albums: Album[];
  isLoading: boolean;
  selectedAlbum: Album | null;
  error: string | null;
}

interface TrackState {
  tracks: Track[];
  isLoading: boolean;
  error: string | null;
  playingTrackId?: number;
}

export default function SearchClient({
  initialQuery = "",
}: {
  initialQuery?: string;
}) {
  const [searchState, setSearchState] = useState<SearchState>({
    query: "",
    isSearching: false,
    results: [],
    selectedArtist: null,
    error: null,
  });

  const [albumState, setAlbumState] = useState<AlbumState>({
    albums: [],
    isLoading: false,
    selectedAlbum: null,
    error: null,
  });

  const [trackState, setTrackState] = useState<TrackState>({
    tracks: [],
    isLoading: false,
    error: null,
  });

  const [showArtists, setShowArtists] = useState(false);
  const [showAlbums, setShowAlbums] = useState(false);
  const [showTracks, setShowTracks] = useState(false);

  const { openSearch } = useSearch();

  // Track which artists are already being tracked
  const [trackedArtistIds, setTrackedArtistIds] = useState<Set<number>>(
    new Set(),
  );

  // Load tracked artists when component mounts
  useEffect(() => {
    loadTrackedArtists();
  }, []);

  // Handle initial query from URL
  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const loadTrackedArtists = async () => {
    try {
      const tracked = await db.trackedArtists.toArray();
      setTrackedArtistIds(new Set(tracked.map((artist) => artist.id)));
    } catch (error) {
      console.error("Failed to load tracked artists:", error);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setSearchState((prev) => ({
      ...prev,
      query,
      isSearching: true,
      error: null,
    }));

    try {
      const artists = await searchArtists(query);

      if (artists.length === 0) {
        setSearchState((prev) => ({
          ...prev,
          isSearching: false,
          error: "No artists found. Try a different search term.",
        }));
        return;
      }

      setSearchState((prev) => ({
        ...prev,
        isSearching: false,
        results: artists,
        error: null,
      }));
      setShowArtists(true);
    } catch (error) {
      setSearchState((prev) => ({
        ...prev,
        isSearching: false,
        error: "Search failed. Please check your connection and try again.",
      }));
    }
  };

  const handleTrackArtist = async (artist: Artist) => {
    try {
      const isTracked = trackedArtistIds.has(artist.id);

      if (isTracked) {
        // Untrack the artist
        await db.trackedArtists.delete(artist.id);
        setTrackedArtistIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(artist.id);
          return newSet;
        });
      } else {
        // Track the artist
        await db.trackedArtists.add({
          id: artist.id,
          name: artist.name,
          picture_medium: artist.picture_medium,
          dateAdded: new Date().toISOString(),
          nb_fan: artist.nb_fan,
          nb_album: artist.nb_album,
        });
        setTrackedArtistIds((prev) => new Set(prev).add(artist.id));
      }
    } catch (error) {
      console.error("Failed to track/untrack artist:", error);
    }
  };

  const handleArtistSelect = async (artist: Artist) => {
    setSearchState((prev) => ({ ...prev, selectedArtist: artist }));
    setAlbumState((prev) => ({ ...prev, isLoading: true, error: null }));
    setShowArtists(false);

    try {
      const albums = await getArtistAlbums(artist.id);

      if (albums.length === 0) {
        setAlbumState((prev) => ({
          ...prev,
          isLoading: false,
          error: "No albums found for this artist.",
        }));
        return;
      }

      setAlbumState((prev) => ({
        ...prev,
        isLoading: false,
        albums,
        error: null,
      }));
      setShowAlbums(true);
    } catch (error) {
      setAlbumState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to load albums. Please try again.",
      }));
    }
  };

  const handleAlbumSelect = async (album: Album) => {
    setAlbumState((prev) => ({ ...prev, selectedAlbum: album }));
    setTrackState((prev) => ({ ...prev, isLoading: true, error: null }));
    setShowAlbums(false);

    try {
      const tracks = await getAlbumTracks(album.id);

      if (tracks.length === 0) {
        setTrackState((prev) => ({
          ...prev,
          isLoading: false,
          error: "No tracks found for this album.",
        }));
        return;
      }

      setTrackState((prev) => ({
        ...prev,
        isLoading: false,
        tracks,
        error: null,
      }));
      setShowTracks(true);
    } catch (error) {
      setTrackState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to load tracks. Please try again.",
      }));
    }
  };

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const handlePlayPreview = (track: Track) => {
    if (!track.preview) return;

    // If there's already audio playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setTrackState((prev) => ({ ...prev, playingTrackId: undefined }));
      return;
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

  const handleBackToAlbums = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setTrackState((prev) => ({ ...prev, playingTrackId: undefined }));
    setShowTracks(false);
    setShowAlbums(true);
  };

  const handleBackToArtists = () => {
    setShowAlbums(false);
    setShowArtists(true);
  };

  const retryAlbums = () => {
    if (searchState.selectedArtist) {
      handleArtistSelect(searchState.selectedArtist);
    }
  };

  const retryTracks = () => {
    if (albumState.selectedAlbum) {
      handleAlbumSelect(albumState.selectedAlbum);
    }
  };

  return (
    <>
      {/* Search Section */}
      <div className="max-w-2xl mx-auto mb-12">
        <Card className="p-8 shadow-lg border-0 bg-card/50 backdrop-blur">
          <div className="space-y-6">
            <Button
              onClick={openSearch}
              variant="outline"
              className="w-full h-14 text-lg flex items-center justify-between border-0 bg-background/50 hover:bg-background/70 transition-colours px-4"
            >
              <span className="flex items-center gap-3 text-muted-foreground">
                <Search className="h-5 w-5 shrink-0" />
                <span>Search for an artist...</span>
              </span>
              <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[16px] font-medium opacity-100 shrink-0">
                <span className="text-s">⌘</span>K
              </kbd>
            </Button>

            {/* Show current search query and loading state */}
            {searchState.query && (
              <div className="text-centre">
                <p className="text-sm text-muted-foreground mb-2">
                  Searching for:{" "}
                  <span className="font-medium text-foreground">
                    {searchState.query}
                  </span>
                </p>
                {searchState.isSearching && (
                  <div className="flex items-centre justify-centre gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">
                      Searching...
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Simple error display */}
            {searchState.error && (
              <div className="text-centre">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {searchState.error}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Artist Selection Dialog */}
      <ArtistSelectionDialog
        open={showArtists}
        onOpenChange={setShowArtists}
        artists={searchState.results}
        searchQuery={searchState.query}
        onArtistSelect={handleArtistSelect}
        onTrackArtist={handleTrackArtist}
        trackedArtistIds={trackedArtistIds}
      />

      {/* Album Selection Dialog */}
      <AlbumSelectionDialog
        open={showAlbums}
        onOpenChange={setShowAlbums}
        artist={searchState.selectedArtist}
        albums={albumState.albums}
        isLoading={albumState.isLoading}
        error={albumState.error}
        onBack={handleBackToArtists}
        onAlbumSelect={handleAlbumSelect}
        onRetry={retryAlbums}
      />

      {/* Album Tracks Dialog */}
      <AlbumTracksDialog
        open={showTracks}
        onOpenChange={(open) => {
          if (!open && audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
            setTrackState((prev) => ({ ...prev, playingTrackId: undefined }));
          }
          setShowTracks(open);
        }}
        album={albumState.selectedAlbum}
        tracks={trackState.tracks}
        isLoading={trackState.isLoading}
        error={trackState.error}
        playingTrackId={trackState.playingTrackId}
        onBack={handleBackToAlbums}
        onPlayPreview={handlePlayPreview}
        onRetry={retryTracks}
      />
    </>
  );
}
