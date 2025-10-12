import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AlertCircle,
  CheckCircle,
  CheckCircle2,
  FileCode,
  FileText,
  FolderOpen,
  Music2,
  QrCode,
  Settings,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ButtonGroup } from "@/components/ui/button-group";

interface ExportChoiceDialogProps {
  onExport: (content: string, format: string) => void;
  onCancel: () => void;
}

export function ExportChoiceDialog({
  onExport,
  onCancel,
}: ExportChoiceDialogProps) {
  const [transferContent, setTransferContent] = useState<string>("");
  const [transferFormat, setTransferFormat] = useState<string>("");

  const handleExport = () => {
    if (transferContent && transferFormat) {
      onExport(transferContent, transferFormat);
    }
  };

  const showWarning =
    transferContent === "artists" || transferContent === "all";

  const contentOptions = [
    { value: "artists", label: "Artists", icon: Music2 },
    { value: "settings", label: "Settings", icon: Settings },
    { value: "all", label: "All Data", icon: FolderOpen },
  ];

  const formatOptions = [
    { value: "qrcode", label: "QR Code", icon: QrCode },
    { value: "file", label: "File", icon: FileText },
    { value: "string", label: "String", icon: FileCode },
  ];

  return (
    <div className="space-y-6 px-1">
      {/* Content Selection */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">What to export</h3>
        <ButtonGroup orientation="vertical" className="w-full">
          {contentOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = transferContent === option.value;
            return (
              <Button
                key={option.value}
                onClick={() => setTransferContent(option.value)}
                variant={isSelected ? "default" : "outline"}
                className="w-full justify-start gap-3 h-auto py-3"
              >
                <Icon className="h-4 w-4" />
                <span>{option.label}</span>
                {isSelected && <CheckCircle2 className="h-4 w-4 ml-auto" />}
              </Button>
            );
          })}
        </ButtonGroup>
      </div>

      {/* Format Selection */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Export format</h3>
        <ButtonGroup orientation="vertical" className="w-full">
          {formatOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = transferFormat === option.value;
            return (
              <Button
                key={option.value}
                onClick={() => setTransferFormat(option.value)}
                variant={isSelected ? "default" : "outline"}
                className="w-full justify-start gap-3 h-auto py-3"
              >
                <Icon className="h-4 w-4" />
                <span>{option.label}</span>
                {isSelected && <CheckCircle2 className="h-4 w-4 ml-auto" />}
              </Button>
            );
          })}
        </ButtonGroup>
      </div>

      {/* Warning */}
      {showWarning && (
        <Alert className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
          <AlertDescription className="text-amber-800 dark:text-amber-200 text-sm">
            Exporting many artists to QR Code or String can result in very large
            outputs
          </AlertDescription>
        </Alert>
      )}

      {/* Actions */}
      <ButtonGroup className="w-full pt-2">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button
          onClick={handleExport}
          disabled={!transferContent || !transferFormat}
          className="flex-1"
        >
          Export
        </Button>
      </ButtonGroup>
    </div>
  );
}
