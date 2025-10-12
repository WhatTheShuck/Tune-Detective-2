"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Clock, X } from "lucide-react";
import { db } from "@/db";
import { SearchQuery } from "@/db";
import { useMediaQuery } from "usehooks-ts";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSearch: (query: string) => void;
}

export function SearchCommand({
  open,
  onOpenChange,
  onSearch,
}: SearchCommandProps) {
  const [searchValue, setSearchValue] = useState("");
  const [recentSearches, setRecentSearches] = useState<SearchQuery[]>([]);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Load recent searches when dialog opens
  useEffect(() => {
    if (open) {
      loadRecentSearches();
      if (!isDesktop) {
        // Focus input after drawer animation on mobile
        setTimeout(() => {
          const input = document.querySelector<HTMLInputElement>(
            "[data-search-input]",
          );
          input?.focus();
        }, 100);
      }
    }
  }, [open, isDesktop]);

  const loadRecentSearches = async () => {
    try {
      const searches = await db.getRecentSearches(10);
      setRecentSearches(searches);
    } catch (error) {
      console.error("Failed to load recent searches:", error);
    }
  };

  const handleSelect = useCallback(
    async (query: string) => {
      if (!query.trim()) return;

      // Save to database
      await db.addSearchQuery(query, "artist");

      // Close dialog and trigger search
      onOpenChange(false);
      onSearch(query);

      // Clear input
      setSearchValue("");
    },
    [onOpenChange, onSearch],
  );

  // Handle Cmd+K / Ctrl+K to open (desktop only)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  // Filter recent searches based on current input
  const filteredSearches = recentSearches.filter((s) =>
    s.query.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const displaySearches = searchValue.trim()
    ? filteredSearches
    : recentSearches;

  // Desktop: Command Dialog
  if (isDesktop) {
    return (
      <CommandDialog open={open} onOpenChange={onOpenChange}>
        <CommandInput
          placeholder="Search for an artist..."
          value={searchValue}
          onValueChange={setSearchValue}
        />
        <CommandList>
          <CommandEmpty>
            {searchValue.trim()
              ? "Press Enter to search for this artist"
              : "Start typing to search..."}
          </CommandEmpty>

          {/* Current search suggestion */}
          {searchValue.trim() && (
            <CommandGroup heading="Search">
              <CommandItem
                value={searchValue}
                onSelect={() => handleSelect(searchValue)}
                className="flex items-center gap-3"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                  <Search className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{searchValue}</p>
                  <p className="text-sm text-muted-foreground">
                    Search for &quot;{searchValue}&quot;
                  </p>
                </div>
              </CommandItem>
            </CommandGroup>
          )}

          {/* Recent searches - show all when no input */}
          {!searchValue.trim() && recentSearches.length > 0 && (
            <CommandGroup heading="Recent Searches">
              {recentSearches.map((search) => (
                <CommandItem
                  key={search.id}
                  value={search.query}
                  onSelect={() => handleSelect(search.query)}
                  className="flex items-center gap-3"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{search.query}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(search.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Filtered recent searches when typing */}
          {searchValue.trim() && filteredSearches.length > 0 && (
            <CommandGroup heading="Recent Searches">
              {filteredSearches.map((search) => (
                <CommandItem
                  key={search.id}
                  value={search.query}
                  onSelect={() => handleSelect(search.query)}
                  className="flex items-center gap-3"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{search.query}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(search.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    );
  }

  // Mobile: Drawer
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="border-b px-4 py-3">
          <DrawerTitle className="text-left">Search Artists</DrawerTitle>
        </DrawerHeader>

        <div className="p-4 space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              data-search-input
              type="text"
              placeholder="Search for an artist..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchValue.trim()) {
                  e.preventDefault();
                  handleSelect(searchValue);
                }
              }}
              className="pl-10 h-12 text-base"
            />
            {searchValue && (
              <Button
                onClick={() => setSearchValue("")}
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Current Search Suggestion */}
          {searchValue.trim() && (
            <Button
              onClick={() => handleSelect(searchValue)}
              variant="outline"
              className="w-full justify-start h-auto py-3 px-4"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 shrink-0">
                  <Search className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-medium truncate">{searchValue}</p>
                  <p className="text-sm text-muted-foreground">
                    Search for &quot;{searchValue}&quot;
                  </p>
                </div>
              </div>
            </Button>
          )}

          {/* Recent/Filtered Searches */}
          {displaySearches.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground px-1">
                {searchValue.trim() ? "Matching Searches" : "Recent Searches"}
              </h3>
              <ScrollArea className="h-[300px] pr-2">
                <div className="space-y-2">
                  {displaySearches.map((search) => (
                    <Button
                      key={search.id}
                      onClick={() => handleSelect(search.query)}
                      variant="ghost"
                      className="w-full justify-start h-auto py-3 px-4"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted shrink-0">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="font-medium truncate">{search.query}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(search.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Empty State */}
          {!searchValue.trim() && recentSearches.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">Start typing to search for artists</p>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
