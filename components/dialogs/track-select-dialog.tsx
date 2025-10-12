import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Play, Pause, Clock } from "lucide-react";
import { Album, Track } from "@/lib/types";
import { ResponsiveModal } from "./responsive-dialog";

interface AlbumTracksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  album: Album | null;
  tracks: Track[];
  isLoading: boolean;
  error: string | null;
  playingTrackId?: number;
  onBack: () => void;
  onPlayPreview: (track: Track) => void;
  onRetry: () => void;
}

export function AlbumTracksDialog({
  open,
  onOpenChange,
  album,
  tracks,
  isLoading,
  error,
  playingTrackId,
  onBack,
  onPlayPreview,
  onRetry,
}: AlbumTracksDialogProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatReleaseDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const totalDuration = tracks.reduce((sum, track) => sum + track.duration, 0);
  const totalMinutes = Math.floor(totalDuration / 60);

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title={album ? `Tracks - ${album.title}` : "Tracks"}
      maxWidth="max-w-3xl"
      showBackButton={true}
      onBack={onBack}
    >
      {album && (
        <div className="flex gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
            <img
              src={album.cover_medium || "/placeholder-album.jpg"}
              alt={album.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold truncate">{album.title}</h2>
            <p className="text-muted-foreground mb-2 truncate">
              {formatReleaseDate(album.release_date)}
            </p>
            <div className="flex gap-3 text-sm text-muted-foreground">
              <span className="whitespace-nowrap">{tracks.length} tracks</span>
              <span className="whitespace-nowrap">{totalMinutes} minutes</span>
            </div>
          </div>
        </div>
      )}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading tracks...</span>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button variant="outline" onClick={onRetry}>
            Try Again
          </Button>
        </div>
      ) : (
        <ScrollArea>
          <div className="space-y-2 pr-4">
            {tracks.map((track) => (
              <div
                key={track.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent transition-colors group cursor-pointer min-w-0"
                onClick={() => track.preview && onPlayPreview(track)}
              >
                {/* Track number */}
                <div className="w-8 h-8 flex items-center justify-center text-sm text-muted-foreground font-medium shrink-0">
                  {track.track_position}
                </div>

                {/* Track info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium group-hover:text-primary truncate">
                    {track.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs shrink-0">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDuration(track.duration)}
                    </Badge>
                  </div>
                </div>

                {/* Play button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayPreview(track);
                  }}
                  disabled={!track.preview}
                  className="opacity-60 group-hover:opacity-100 transition-opacity shrink-0"
                >
                  {playingTrackId === track.id ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {playingTrackId === track.id
                      ? "Pause preview"
                      : "Play preview"}
                  </span>
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </ResponsiveModal>
  );
}
