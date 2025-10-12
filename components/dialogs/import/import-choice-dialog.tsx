import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Html5Qrcode } from "html5-qrcode";
import {
  Upload,
  Camera,
  AlertCircle,
  CheckCircle2,
  Music2,
  Settings,
  FolderOpen,
  QrCode,
  FileText,
  FileCode,
  X,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent } from "@/components/ui/card";

interface ImportChoiceDialogProps {
  onImport: (content: string, format: string, data: string) => void;
  onCancel: () => void;
}

export function ImportChoiceDialog({
  onImport,
  onCancel,
}: ImportChoiceDialogProps) {
  const [transferContent, setTransferContent] = useState<string>("");
  const [transferFormat, setTransferFormat] = useState<string>("");
  const [importData, setImportData] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const scannerDivId = "qr-reader-import";

  useEffect(() => {
    return () => {
      // Cleanup scanner on unmount
      if (html5QrCodeRef.current?.isScanning) {
        html5QrCodeRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(scannerDivId);
      }

      const result = await html5QrCodeRef.current.scanFile(file, true);
      setImportData(result);
      setTransferFormat("qrcode");
    } catch (error) {
      console.error("Error scanning QR code from file:", error);
      alert("Failed to scan QR code from image. Please try another image.");
    }
  };

  const startCameraScanning = async () => {
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(scannerDivId);
      }

      setIsScanning(true);

      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          setImportData(decodedText);
          setTransferFormat("qrcode");
          stopCameraScanning();
        },
        (errorMessage) => {
          // Error callback (can be ignored for continuous scanning)
        },
      );
    } catch (error) {
      console.error("Error starting camera:", error);
      alert("Failed to access camera. Please check permissions.");
      setIsScanning(false);
    }
  };

  const stopCameraScanning = async () => {
    if (html5QrCodeRef.current?.isScanning) {
      await html5QrCodeRef.current.stop();
    }
    setIsScanning(false);
  };

  const handleJsonFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImportData(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleImport = () => {
    if (transferContent && importData) {
      onImport(transferContent, transferFormat, importData);
    }
  };

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
        <h3 className="text-sm font-semibold">What to import</h3>
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
        <h3 className="text-sm font-semibold">Import format</h3>
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

      {/* QR Code Scanner */}
      {transferFormat === "qrcode" && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Scan QR code</h3>

          {isScanning ? (
            <Card>
              <CardContent className="p-4 space-y-3">
                <div id={scannerDivId} />
                <Button
                  onClick={stopCameraScanning}
                  variant="destructive"
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Stop scanning
                </Button>
              </CardContent>
            </Card>
          ) : importData ? (
            <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
              <AlertDescription className="text-green-800 dark:text-green-200 text-sm">
                QR code scanned successfully
              </AlertDescription>
            </Alert>
          ) : (
            <ButtonGroup orientation="vertical" className="w-full">
              <Button
                onClick={startCameraScanning}
                variant="outline"
                className="w-full justify-start gap-3 h-auto py-3"
              >
                <Camera className="h-4 w-4" />
                <span>Scan with camera</span>
              </Button>
              <Button
                onClick={() =>
                  document.getElementById("qr-file-input")?.click()
                }
                variant="outline"
                className="w-full justify-start gap-3 h-auto py-3"
              >
                <Upload className="h-4 w-4" />
                <span>Upload image</span>
              </Button>
            </ButtonGroup>
          )}

          <Input
            id="qr-file-input"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}

      {/* String Input */}
      {transferFormat === "string" && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Paste import string</h3>
          <Textarea
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
            placeholder="Paste your base64 encoded import string here..."
            className="font-mono text-xs min-h-[140px] resize-none"
          />
          {importData && (
            <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
              <AlertDescription className="text-green-800 dark:text-green-200 text-sm">
                String ready to import
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* File Upload */}
      {transferFormat === "file" && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Select import file</h3>
          <Button
            onClick={() => document.getElementById("json-file-input")?.click()}
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-3"
          >
            <Upload className="h-4 w-4" />
            <span>{importData ? "File selected" : "Choose JSON file"}</span>
            {importData && (
              <CheckCircle2 className="h-4 w-4 ml-auto text-green-600" />
            )}
          </Button>
          <Input
            id="json-file-input"
            type="file"
            accept=".json"
            onChange={handleJsonFileUpload}
            className="hidden"
          />
          {importData && (
            <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
              <AlertDescription className="text-green-800 dark:text-green-200 text-sm">
                File loaded successfully
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Warning */}
      {transferContent && !transferFormat && (
        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20">
          <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-500" />
          <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
            Please select an import format to continue
          </AlertDescription>
        </Alert>
      )}

      {/* Actions */}
      <ButtonGroup className="w-full pt-2">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button
          onClick={handleImport}
          disabled={!transferContent || !importData}
          className="flex-1"
        >
          Import
        </Button>
      </ButtonGroup>
    </div>
  );
}
