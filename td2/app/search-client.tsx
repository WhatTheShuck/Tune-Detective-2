//TODO: add command K and history and search queries to db
"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Artist, Album, Track } from "@/lib/types";
import {
  searchArtists,
  getArtistAlbums,
  getAlbumTracks, // You'll need to implement this API function
} from "@/lib/deezer-api";

// Import the dialog components
import { ArtistSelectionDialog } from "@/components/dialogs/artist-select-dialog";
import { AlbumSelectionDialog } from "@/components/dialogs/album-select-dialog";
import { AlbumTracksDialog } from "@/components/dialogs/track-select-dialog";

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
}

export default function SearchClient() {
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

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handleSearch = async () => {
    if (!searchState.query.trim()) return;

    setSearchState((prev) => ({ ...prev, isSearching: true, error: null }));

    try {
      const artists = await searchArtists(searchState.query);

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
    // TODO: Implement artist tracking logic
    console.log("Tracking artist:", artist);
    // For now, just close the dialog
    setShowArtists(false);

    // You might want to show a toast notification here
    // toast({ title: `Now tracking ${artist.name}!` });
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

  const handlePlayPreview = (track: Track) => {
    // TODO: Implement audio preview playback
    console.log("Playing preview for:", track);

    // Example implementation:
    if (track.preview) {
      const audio = new Audio(track.preview);
      audio.play();
      if (!showTracks) {
        audio.pause();
      }
    }
  };

  const handleBackToAlbums = () => {
    setShowTracks(false);
    setShowAlbums(true);
  };

  const handleBackToArtists = () => {
    setShowAlbums(false);
    setShowArtists(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const resetSearch = () => {
    setSearchState({
      query: "",
      isSearching: false,
      results: [],
      selectedArtist: null,
      error: null,
    });
    setShowArtists(false);
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
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search for an artist..."
                value={searchState.query}
                onChange={(e) =>
                  setSearchState((prev) => ({
                    ...prev,
                    query: e.target.value,
                    error: null,
                  }))
                }
                onKeyDown={handleKeyPress}
                className="pl-12 h-14 text-lg border-0 bg-background/50 focus-visible:ring-2 focus-visible:ring-primary/20"
              />
              {searchState.query && (
                <Button
                  onClick={resetSearch}
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  ✕
                </Button>
              )}
            </div>

            <Button
              onClick={handleSearch}
              disabled={searchState.isSearching || !searchState.query.trim()}
              className="w-full h-12 text-lg font-medium"
              size="lg"
            >
              {searchState.isSearching ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Search Artists
                </>
              )}
            </Button>

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
        onOpenChange={setShowTracks}
        album={albumState.selectedAlbum}
        tracks={trackState.tracks}
        isLoading={trackState.isLoading}
        error={trackState.error}
        onBack={handleBackToAlbums}
        onPlayPreview={handlePlayPreview}
        onRetry={retryTracks}
      />
    </>
  );
}
