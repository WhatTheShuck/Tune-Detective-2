import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { type NavItem } from "@/lib/data";

interface NavButtonProps {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}

export function NavButton({ item, isActive, onClick }: NavButtonProps) {
  const Icon = item.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClick}
            className={cn(
              "flex flex-col items-center justify-center h-auto py-2 px-3 min-w-0 flex-1",
              "transition-all duration-200 ease-in-out",
              isActive && "bg-primary/10 text-primary hover:bg-primary/15",
            )}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon
              size={20}
              className={cn(
                "mb-1 transition-transform duration-200",
                isActive ? "scale-110" : "scale-100",
              )}
            />
            <span className="text-xs font-medium truncate w-full text-center">
              {item.label}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>{item.label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
