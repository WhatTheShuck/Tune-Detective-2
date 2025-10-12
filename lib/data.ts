import { type LucideIcon, Search, Info, Disc3 } from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
}

export const navItems: NavItem[] = [
  {
    id: "search",
    label: "Search",
    icon: Search,
    href: "/",
  },
  {
    id: "releases",
    label: "Releases",
    icon: Disc3,
    href: "/releases",
  },
  {
    id: "about",
    label: "About",
    icon: Info,
    href: "/about",
  },
];
