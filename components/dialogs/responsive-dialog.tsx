import { ReactNode } from "react";
import { useMediaQuery } from "usehooks-ts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ArrowLeft, Grid3X3, List, X } from "lucide-react";

interface ResponsiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: ReactNode;
  className?: string;
  maxWidth?: string;
  hideTitle?: boolean;
  // New props for enhanced header
  showBackButton?: boolean;
  onBack?: () => void;
  showViewToggle?: boolean;
  isCompact?: boolean;
  onViewToggle?: (isCompact: boolean) => void;
}

export function ResponsiveModal({
  open,
  onOpenChange,
  title,
  children,
  className = "",
  maxWidth = "max-w-3xl",
  hideTitle = false,
  showBackButton = false,
  onBack,
  showViewToggle = false,
  isCompact = false,
  onViewToggle,
}: ResponsiveModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const renderDesktopHeader = () => {
    return (
      <div className="flex items-center justify-between gap-3 pb-4 border-b">
        {/* Left side - Back button and title */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {showBackButton && onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}

          {title && !hideTitle ? (
            <DialogTitle className="text-xl font-semibold truncate flex-1">
              {title}
            </DialogTitle>
          ) : (
            <VisuallyHidden>
              <DialogTitle>{title || "Dialog"}</DialogTitle>
            </VisuallyHidden>
          )}
        </div>

        {/* Right side - View toggle and close button */}
        <div className="flex items-center gap-2 shrink-0">
          {/* View toggle */}
          {showViewToggle && onViewToggle && (
            <div className="flex items-center border rounded-lg">
              <Button
                variant={!isCompact ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onViewToggle(false)}
                className="p-2 h-8 w-8 rounded-r-none border-0"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={isCompact ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onViewToggle(true)}
                className="p-2 h-8 w-8 rounded-l-none border-l-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="p-2 h-8 w-8"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  };

  const renderMobileHeader = () => {
    return (
      <div className="flex items-center justify-between gap-3 pb-4 border-b">
        {/* Left side - Back button and title */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {showBackButton && onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}

          {title && !hideTitle ? (
            <DrawerTitle className="text-lg text-left font-semibold truncate flex-1">
              {title}
            </DrawerTitle>
          ) : (
            <VisuallyHidden>
              <DrawerTitle>{title || "Dialog"}</DrawerTitle>
            </VisuallyHidden>
          )}
        </div>

        {/* Right side - View toggle */}
        <div className="flex items-center gap-2 shrink-0">
          {/* View toggle */}
          {showViewToggle && onViewToggle && (
            <div className="flex items-center border rounded-lg">
              <Button
                variant={!isCompact ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onViewToggle(false)}
                className="p-2 h-8 w-8 rounded-r-none border-0"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={isCompact ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onViewToggle(true)}
                className="p-2 h-8 w-8 rounded-l-none border-l-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className={`${maxWidth} w-[95vw] max-h-[85vh] overflow-hidden flex flex-col ${className}`}
          showCloseButton={false}
        >
          <DialogHeader>{renderDesktopHeader()}</DialogHeader>
          <div className="flex-1 overflow-hidden min-h-0">{children}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className={`max-h-[85vh] flex flex-col ${className}`}>
        <DrawerHeader className="pb-2">
          <div className="px-2">{renderMobileHeader()}</div>
        </DrawerHeader>
        <div className="flex-1 overflow-hidden min-h-0 px-2 pb-4">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
