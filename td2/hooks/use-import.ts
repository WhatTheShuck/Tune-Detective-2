import { useState } from "react";
import { decompress } from "compress-json";
import { db } from "@/db"; // Adjust path to your db

export function useImport() {
  const [isImportOpen, setIsImportOpen] = useState(false);

  const handleImport = async (
    content: string,
    format: string,
    data: string,
  ) => {
    try {
      let parsedData: any;

      // Parse data based on format
      switch (format) {
        case "qrcode":
          parsedData = JSON.parse(data);
          break;
        case "string":
          const decoded = atob(data);
          parsedData = JSON.parse(decoded);
          break;
        case "file":
          parsedData = JSON.parse(data);
          break;
        default:
          console.error("Unsupported import format");
          return;
      }

      // Decompress the data
      const decompressedData = decompress(parsedData);

      // Import based on content type
      switch (content) {
        case "artists":
          if (decompressedData.trackedArtists) {
            await db.trackedArtists.bulkPut(decompressedData.trackedArtists);
            alert(
              `Successfully imported ${decompressedData.trackedArtists.length} artists`,
            );
          }
          break;
        case "settings":
          if (decompressedData.settings) {
            await db.settings.bulkPut(decompressedData.settings);
            alert("Successfully imported settings");
          }
          break;
        case "all":
          if (decompressedData.trackedArtists) {
            await db.trackedArtists.bulkPut(decompressedData.trackedArtists);
          }
          if (decompressedData.settings) {
            await db.settings.bulkPut(decompressedData.settings);
          }
          alert("Successfully imported all data");
          break;
        default:
          console.error("Unsupported import content");
          return;
      }

      setIsImportOpen(false);
    } catch (error) {
      console.error("Error during import:", error);
      alert("Failed to import data. Please ensure the data format is correct.");
    }
  };

  return {
    isImportOpen,
    setIsImportOpen,
    handleImport,
  };
}
