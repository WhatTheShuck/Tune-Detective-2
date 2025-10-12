import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Copy, Download, FileText } from "lucide-react";
import { useRef, useState } from "react";
import QRCode from "react-qr-code";

export interface ExportResultData {
  type: "qrcode" | "string" | "file";
  data?: string;
  filename?: string;
}

interface ExportResultDialogProps {
  resultData: ExportResultData;
  onClose: () => void;
  onRetryDownload?: (filename: string) => void;
}

export function ExportResultDialog({
  resultData,
  onClose,
  onRetryDownload,
}: ExportResultDialogProps) {
  const [copied, setCopied] = useState(false);
  const [qrSaved, setQrSaved] = useState(false);
  const qrRef = useRef<HTMLDivElement | null>(null);

  const handleCopyToClipboard = () => {
    if (resultData.data) {
      navigator.clipboard.writeText(resultData.data);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRetryDownload = () => {
    if (resultData.filename && onRetryDownload) {
      onRetryDownload(resultData.filename);
    }
  };

  const handleSaveQRCode = async () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    // Convert SVG to canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size (adding padding)
    const padding = 40;
    const qrSize = 256;
    canvas.width = qrSize + padding * 2;
    canvas.height = qrSize + padding * 2;

    // Fill white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Convert SVG to data URL
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    // Load and draw image
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, padding, padding, qrSize, qrSize);

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const downloadUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.download = "export-qrcode.png";
          link.click();

          URL.revokeObjectURL(downloadUrl);
          setQrSaved(true);
          setTimeout(() => setQrSaved(false), 2000);
        }
      }, "image/png");

      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className="space-y-6 px-1">
      {/* QR Code Result */}
      {resultData.type === "qrcode" && resultData.data && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-semibold mb-1">Scan to export</h3>
            <p className="text-sm text-muted-foreground">
              Use your phone's camera to scan this code
            </p>
          </div>
          <Card>
            <CardContent
              ref={qrRef}
              className="flex justify-center p-6 bg-white dark:bg-white"
            >
              <QRCode value={resultData.data} size={256} level="M" />
            </CardContent>
          </Card>
          <Button
            onClick={handleSaveQRCode}
            variant={qrSaved ? "default" : "outline"}
            className="w-full"
          >
            {qrSaved ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Saved!
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Save as image
              </>
            )}
          </Button>
        </div>
      )}

      {/* String Result */}
      {resultData.type === "string" && resultData.data && (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-1">Export string</h3>
            <p className="text-sm text-muted-foreground">
              Copy this text to save your data
            </p>
          </div>
          <Textarea
            value={resultData.data}
            readOnly
            className="font-mono text-xs min-h-[140px] resize-none"
          />
          <Button
            onClick={handleCopyToClipboard}
            className="w-full"
            variant={copied ? "default" : "outline"}
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy to clipboard
              </>
            )}
          </Button>
        </div>
      )}

      {/* File Result */}
      {resultData.type === "file" && (
        <div className="space-y-4">
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 mb-3">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-500" />
            </div>
            <h3 className="font-semibold mb-1">Download complete</h3>
            <p className="text-sm text-muted-foreground">
              Your file has been saved
            </p>
          </div>

          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm font-medium truncate">
                  {resultData.filename}
                </span>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleRetryDownload}
            className="w-full"
            variant="outline"
          >
            <Download className="h-4 w-4 mr-2" />
            Download again
          </Button>
        </div>
      )}

      {/* Close Action */}
      <div className="pt-2">
        <Button onClick={onClose} className="w-full">
          Done
        </Button>
      </div>
    </div>
  );
}
