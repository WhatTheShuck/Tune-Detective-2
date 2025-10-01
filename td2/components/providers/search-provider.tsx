"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { SearchCommand } from "@/components/search-command";
import { searchArtists } from "@/lib/deezer-api";

interface SearchContextType {
  openSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSearch = async (query: string) => {
    // Navigate to search page with the query
    // The search page will handle the actual search
    router.push(`/?q=${encodeURIComponent(query)}`);
  };

  return (
    <SearchContext.Provider value={{ openSearch: () => setOpen(true) }}>
      {children}
      <SearchCommand
        open={open}
        onOpenChange={setOpen}
        onSearch={handleSearch}
      />
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
