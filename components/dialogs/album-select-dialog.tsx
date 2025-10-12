import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Eye } from "lucide-react";
import { Artist, Album } from "@/lib/types";
import { ResponsiveModal } from "./responsive-dialog";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AlbumSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artist: Artist | null;
  albums: Album[];
  isLoading: boolean;
  error: string | null;
  onBack: () => void;
  onAlbumSelect: (album: Album) => void;
  onRetry: () => void;
}

export function AlbumSelectionDialog({
  open,
  onOpenChange,
  artist,
  albums,
  isLoading,
  error,
  onBack,
  onAlbumSelect,
  onRetry,
}: AlbumSelectionDialogProps) {
  const [isCompact, setIsCompact] = useState(true);

  const formatReleaseDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const renderCompactView = () => (
    <div className="grid gap-3 p-1">
      <TooltipProvider>
        {albums.map((album) => (
          <div
            key={album.id}
            className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border hover:bg-accent transition-all hover:shadow-md cursor-pointer min-h-[80px] sm:min-h-[88px] min-w-0"
            onClick={() => onAlbumSelect(album)}
          >
            <Avatar className="h-12 w-12 sm:h-16 sm:w-16 shrink-0">
              <AvatarImage
                src={album.cover_medium || "/placeholder-album.jpg"}
                alt={album.title}
              />
              <AvatarFallback className="text-sm sm:text-lg">
                {album.title.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="min-w-0">
                <h3 className="font-semibold text-base sm:text-lg leading-tight truncate">
                  {album.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 mt-1 flex-wrap">
                <span className="text-xs sm:text-sm text-muted-foreground shrink-0">
                  {formatReleaseDate(album.release_date)}
                </span>
                {album.nb_tracks && (
                  <span className="text-xs sm:text-sm text-muted-foreground shrink-0">
                    {album.nb_tracks} tracks
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center shrink-0">
              {/* Mobile: Icon-only button */}
              <div className="flex sm:hidden gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAlbumSelect(album);
                      }}
                      className="p-2 h-8 w-8 border-0"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View Tracks</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Desktop: Full button */}
              <div className="hidden sm:flex">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAlbumSelect(album);
                  }}
                  className="flex items-center gap-2 text-xs px-3 h-7 border-0"
                >
                  <Eye className="h-3 w-3" />
                  View Tracks
                </Button>
              </div>
            </div>
          </div>
        ))}
      </TooltipProvider>
    </div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-1">
      {albums.map((album) => (
        <Card
          key={album.id}
          className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 border-0 bg-card/50"
          onClick={() => onAlbumSelect(album)}
        >
          <CardContent className="p-4">
            <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-muted">
              <img
                src={album.cover_medium || "/placeholder-album.jpg"}
                alt={album.title}
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <h4 className="font-semibold truncate mb-1">{album.title}</h4>
            <p className="text-sm text-muted-foreground mb-3">
              {formatReleaseDate(album.release_date)}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                onAlbumSelect(album);
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Tracks
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title={artist ? `Albums by ${artist.name}` : "Albums"}
      maxWidth="max-w-4xl"
      showBackButton={true}
      onBack={onBack}
      showViewToggle={true}
      isCompact={isCompact}
      onViewToggle={setIsCompact}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading albums...</span>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button variant="outline" onClick={onRetry}>
            Try Again
          </Button>
        </div>
      ) : (
        <ScrollArea className="h-full">
          <div className="max-h-[85vh] min-h-[300px]">
            {isCompact ? renderCompactView() : renderGridView()}
          </div>
        </ScrollArea>
      )}
    </ResponsiveModal>
  );
}
