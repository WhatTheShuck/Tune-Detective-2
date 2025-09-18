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
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ResponsiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: ReactNode;
  className?: string;
  maxWidth?: string;
  hideTitle?: boolean;
}

export function ResponsiveModal({
  open,
  onOpenChange,
  title,
  children,
  className = "",
  maxWidth = "max-w-3xl",
  hideTitle = false,
}: ResponsiveModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className={`${maxWidth} w-[95vw] max-h-[85vh] overflow-hidden flex flex-col ${className}`}
        >
          <DialogHeader className={hideTitle ? "sr-only" : "pb-4"}>
            {hideTitle && title ? (
              <VisuallyHidden>
                <DialogTitle>{title}</DialogTitle>
              </VisuallyHidden>
            ) : (
              title && (
                <DialogTitle className="text-xl pr-8">{title}</DialogTitle>
              )
            )}
            {!title && (
              <VisuallyHidden>
                <DialogTitle>Dialog</DialogTitle>
              </VisuallyHidden>
            )}
          </DialogHeader>
          <div className="flex-1 overflow-hidden min-h-0">{children}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className={`max-h-[85vh] flex flex-col ${className}`}>
        <DrawerHeader className={hideTitle ? "sr-only" : "pb-2"}>
          {hideTitle && title ? (
            <VisuallyHidden>
              <DrawerTitle>{title}</DrawerTitle>
            </VisuallyHidden>
          ) : (
            title && (
              <DrawerTitle className="text-lg text-left px-2">
                {title}
              </DrawerTitle>
            )
          )}
          {!title && (
            <VisuallyHidden>
              <DrawerTitle>Dialog</DrawerTitle>
            </VisuallyHidden>
          )}
        </DrawerHeader>
        <div className="flex-1 overflow-hidden min-h-0 px-2 pb-4">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
