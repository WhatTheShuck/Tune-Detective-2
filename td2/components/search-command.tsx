"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Clock } from "lucide-react";
import { db } from "@/db";
import { SearchQuery } from "@/db";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

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

  // Load recent searches when dialog opens
  useEffect(() => {
    if (open) {
      loadRecentSearches();
    }
  }, [open]);

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

  // Handle Cmd+K / Ctrl+K to open
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
                  Search for "{searchValue}"
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
