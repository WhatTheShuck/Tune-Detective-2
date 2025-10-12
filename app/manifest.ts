import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tune Detective 2",
    short_name: "TD2",
    description: "Scuffed music search tool utilising the Deezer API",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#00c951",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
