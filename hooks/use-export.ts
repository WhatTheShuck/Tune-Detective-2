import { useState } from "react";
import { compress } from "compress-json";
import { db } from "@/db";
import { ExportResultData } from "@/components/dialogs/export/export-result-dialog";

const QR_CODE_SIZE_LIMIT = 1000; // in bytes

export function useExport() {
  const [isChoiceOpen, setIsChoiceOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [resultData, setResultData] = useState<ExportResultData | null>(null);

  const getData = async (content: string): Promise<any> => {
    switch (content) {
      case "artists":
        return { trackedArtists: await db.trackedArtists.toArray() };
      case "settings":
        return { settings: await db.settings.toArray() };
      case "all":
        return {
          trackedArtists: await db.trackedArtists.toArray(),
          settings: await db.settings.toArray(),
        };
      default:
        console.error("Unsupported export content");
        return null;
    }
  };

  const isQRCodeSizeExceeded = (data: any): boolean => {
    return new Blob([JSON.stringify(data)]).size > QR_CODE_SIZE_LIMIT;
  };

  const exportToFile = (content: string, data: any): string => {
    const filename = `export_${content}.json`;
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
    return filename;
  };

  const exportToString = (data: any): string => {
    const stringified = JSON.stringify(data);
    const base64String = btoa(stringified);
    return base64String;
  };

  const handleExport = async (content: string, format: string) => {
    try {
      const data = await getData(content);
      if (!data) return;

      const compressedData = compress(data);
      let exportResultData: ExportResultData;

      switch (format) {
        case "file":
          const filename = exportToFile(content, compressedData);
          exportResultData = { type: "file", filename };
          break;
        case "qrcode":
          if (isQRCodeSizeExceeded(compressedData)) {
            alert(
              "The database is too large for a QR code. Please use the file export option instead.",
            );
            return;
          }
          exportResultData = {
            type: "qrcode",
            data: JSON.stringify(compressedData),
          };
          break;
        case "string":
          const exportString = exportToString(compressedData);
          exportResultData = { type: "string", data: exportString };
          break;
        default:
          console.error("Unsupported export format");
          return;
      }

      setIsChoiceOpen(false);
      setResultData(exportResultData);
      setIsResultOpen(true);
    } catch (error) {
      console.error("Error during export:", error);
    }
  };

  const retryDownload = (filename: string) => {
    console.log("Retrying download for:", filename);
    // Implement retry logic here if needed
  };

  return {
    isChoiceOpen,
    setIsChoiceOpen,
    isResultOpen,
    setIsResultOpen,
    resultData,
    handleExport,
    retryDownload,
  };
}
