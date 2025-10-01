import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ArrowRight } from "lucide-react";
import { Artist } from "@/lib/types";
import { formatFanCount } from "@/lib/deezer-api";
import { ResponsiveModal } from "./responsive-dialog";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ArtistSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artists: Artist[];
  searchQuery: string;
  onArtistSelect: (artist: Artist) => void;
  onTrackArtist: (artist: Artist) => void;
}

export function ArtistSelectionDialog({
  open,
  onOpenChange,
  artists,
  searchQuery,
  onArtistSelect,
  onTrackArtist,
}: ArtistSelectionDialogProps) {
  const [isCompact, setIsCompact] = useState(true); // Default to compact for artists

  const title = `Found ${artists.length} artist${
    artists.length !== 1 ? "s" : ""
  } for "${searchQuery}"`;

  const renderCompactView = () => (
    <div className="grid gap-3 p-1">
      <TooltipProvider>
        {artists.map((artist) => (
          <div
            key={artist.id}
            className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border hover:bg-accent transition-all hover:shadow-md cursor-pointer min-h-[80px] sm:min-h-[88px] min-w-0"
            onClick={() => onArtistSelect(artist)}
          >
            <Avatar className="h-12 w-12 sm:h-16 sm:w-16 shrink-0">
              <AvatarImage src={artist.picture_medium} alt={artist.name} />
              <AvatarFallback className="text-sm sm:text-lg">
                {artist.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="min-w-0">
                <h3 className="font-semibold text-base sm:text-lg leading-tight truncate">
                  {artist.name}
                </h3>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 mt-1 flex-wrap">
                {artist.nb_fan && (
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {formatFanCount(artist.nb_fan)}
                  </Badge>
                )}
                {artist.nb_album && (
                  <span className="text-xs sm:text-sm text-muted-foreground shrink-0">
                    {artist.nb_album} albums
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Mobile: Icon-only buttons */}
              <div className="flex sm:hidden gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTrackArtist(artist);
                      }}
                      className="p-2 h-8 w-8"
                    >
                      <Heart className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Track Artist</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onArtistSelect(artist);
                      }}
                      className="p-2 h-8 w-8"
                    >
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View Albums</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Desktop: Full buttons in column layout */}
              <div className="hidden sm:flex flex-col gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTrackArtist(artist);
                  }}
                  className="flex items-center gap-2 text-xs px-3 h-7 whitespace-nowrap"
                >
                  <Heart className="h-3 w-3" />
                  Track
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onArtistSelect(artist);
                  }}
                  className="text-xs px-3 h-7 whitespace-nowrap"
                >
                  Albums →
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
      {artists.map((artist) => (
        <Card
          key={artist.id}
          className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 border-0 bg-card/50"
          onClick={() => onArtistSelect(artist)}
        >
          <CardContent className="p-4">
            <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-muted">
              <img
                src={artist.picture_medium || "/placeholder-artist.jpg"}
                alt={artist.name}
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <h4 className="font-semibold truncate mb-1">{artist.name}</h4>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {artist.nb_fan && (
                <Badge variant="secondary" className="text-xs">
                  {formatFanCount(artist.nb_fan)}
                </Badge>
              )}
              {artist.nb_album && (
                <span className="text-xs text-muted-foreground">
                  {artist.nb_album} albums
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onTrackArtist(artist);
                }}
              >
                <Heart className="h-3 w-3 mr-1" />
                Track
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onArtistSelect(artist);
                }}
              >
                Albums →
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      showViewToggle={true}
      isCompact={isCompact}
      onViewToggle={setIsCompact}
    >
      <ScrollArea className="h-[60vh] max-h-[85vh] min-h-[300px]">
        {isCompact ? renderCompactView() : renderGridView()}
      </ScrollArea>
    </ResponsiveModal>
  );
}
