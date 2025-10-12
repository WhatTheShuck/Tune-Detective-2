"use client";
import Link from "next/link";
import { ModeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { useSearch } from "./providers/search-provider";
import { Search } from "lucide-react";

const Header = () => {
  const { openSearch } = useSearch();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl font-bold text-foreground">
            Tune Detective 2
          </span>
        </Link>

        {/* Right side controls */}
        <div className="flex items-end gap-4">
          <Button
            onClick={openSearch}
            variant="outline"
            size="sm"
            className="gap-2 h-9 px-3"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="pointer-events-none hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[16px] font-medium opacity-100 sm:flex">
              <span className="text-s">⌘</span>K
            </kbd>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
