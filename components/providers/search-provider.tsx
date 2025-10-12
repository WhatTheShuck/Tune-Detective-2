"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import SearchCommand with no SSR
const SearchCommand = dynamic(
  () =>
    import("@/components/search-command").then((mod) => ({
      default: mod.SearchCommand,
    })),
  { ssr: false },
);

interface SearchContextType {
  openSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSearch = async (query: string) => {
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
