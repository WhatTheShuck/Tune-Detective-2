// lib/deezer-api.ts - Deezer API service layer

import {
  Artist,
  Album,
  Track,
  DeezerArtistSearchResponse,
  DeezerAlbumSearchResponse,
  DeezerTrackSearchResponse,
} from "@/lib/types";
class ApiError extends Error {
  status?: number;
  code?: string;

  constructor(options: { message: string; status?: number; code?: string }) {
    super(options.message);
    this.name = "ApiError";
    this.status = options.status;
    this.code = options.code;
  }
}
const DEEZER_BASE_URL = "https://api.deezer.com";

/**
 * Utility function to handle JSONP requests to Deezer API
 * Deezer API requires JSONP for CORS compliance
 */
const makeJsonpRequest = <T>(url: string): Promise<T> => {
  return new Promise((resolve, reject) => {
    const callbackName = `jsonp_callback_${Date.now()}_${Math.round(Math.random() * 100000)}`;
    const script = document.createElement("script");

    // Set up the callback
    (window as any)[callbackName] = (data: T) => {
      // Clean up
      document.head.removeChild(script);
      delete (window as any)[callbackName];
      resolve(data);
    };

    // Handle errors
    script.onerror = () => {
      document.head.removeChild(script);
      delete (window as any)[callbackName];
      reject(new Error("JSONP request failed"));
    };

    // Make the request
    script.src = `${url}&callback=${callbackName}`;
    document.head.appendChild(script);

    // Timeout after 10 seconds
    setTimeout(() => {
      if ((window as any)[callbackName]) {
        document.head.removeChild(script);
        delete (window as any)[callbackName];
        reject(new Error("Request timeout"));
      }
    }, 10000);
  });
};

/**
 * Search for artists by name
 */
export const searchArtists = async (query: string): Promise<Artist[]> => {
  try {
    if (!query.trim()) {
      throw new Error("Search query cannot be empty");
    }

    const encodedQuery = encodeURIComponent(query.trim());
    const url = `${DEEZER_BASE_URL}/search/artist?q=${encodedQuery}&output=jsonp`;

    const response = await makeJsonpRequest<DeezerArtistSearchResponse>(url);
    return response.data || [];
  } catch (error) {
    console.error("Error searching artists:", error);
    throw new ApiError({
      message: "Failed to search artists",
      code: "SEARCH_ARTISTS_ERROR",
    });
  }
};

/**
 * Get albums for a specific artist
 */
export const getArtistAlbums = async (artistId: number): Promise<Album[]> => {
  try {
    const url = `${DEEZER_BASE_URL}/artist/${artistId}/albums?output=jsonp`;
    const response = await makeJsonpRequest<DeezerAlbumSearchResponse>(url);

    // Sort albums by release date (newest first)
    const albums = response.data || [];
    return albums.sort(
      (a, b) =>
        new Date(b.release_date).getTime() - new Date(a.release_date).getTime(),
    );
  } catch (error) {
    console.error("Error fetching artist albums:", error);
    throw new ApiError({
      message: "Failed to fetch artist albums",
      code: "FETCH_ALBUMS_ERROR",
    });
  }
};

/**
 * Get detailed information about a specific album
 */
export const getAlbumDetails = async (albumId: number): Promise<Album> => {
  try {
    const url = `${DEEZER_BASE_URL}/album/${albumId}?output=jsonp`;
    const response = await makeJsonpRequest<Album>(url);
    return response;
  } catch (error) {
    console.error("Error fetching album details:", error);
    throw new ApiError({
      message: "Failed to fetch album details",
      code: "FETCH_ALBUM_DETAILS_ERROR",
    });
  }
};

/**
 * Get tracks for a specific album
 */
export const getAlbumTracks = async (albumId: number): Promise<Track[]> => {
  try {
    const url = `${DEEZER_BASE_URL}/album/${albumId}/tracks?output=jsonp`;
    const response = await makeJsonpRequest<DeezerTrackSearchResponse>(url);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching album tracks:", error);
    throw new ApiError({
      message: "Failed to fetch album tracks",
      code: "FETCH_TRACKS_ERROR",
    });
  }
};

/**
 * Get artist information by ID
 */
export const getArtistById = async (artistId: number): Promise<Artist> => {
  try {
    const url = `${DEEZER_BASE_URL}/artist/${artistId}?output=jsonp`;
    const response = await makeJsonpRequest<Artist>(url);
    return response;
  } catch (error) {
    console.error("Error fetching artist details:", error);
    throw new ApiError({
      message: "Failed to fetch artist details",
      code: "FETCH_ARTIST_ERROR",
    });
  }
};

/**
 * Search for albums by query (can be used for general music search)
 */
export const searchAlbums = async (query: string): Promise<Album[]> => {
  try {
    if (!query.trim()) {
      throw new Error("Search query cannot be empty");
    }

    const encodedQuery = encodeURIComponent(query.trim());
    const url = `${DEEZER_BASE_URL}/search/album?q=${encodedQuery}&output=jsonp`;

    const response = await makeJsonpRequest<DeezerAlbumSearchResponse>(url);
    return response.data || [];
  } catch (error) {
    console.error("Error searching albums:", error);
    throw new ApiError({
      message: "Failed to search albums",
      code: "SEARCH_ALBUMS_ERROR",
    });
  }
};

/**
 * Batch fetch recent albums for multiple artists
 * Useful for the releases component to get latest releases
 */
export const getArtistsLatestAlbums = async (
  artistIds: number[],
): Promise<Album[]> => {
  try {
    const albumPromises = artistIds.map(async (artistId) => {
      const albums = await getArtistAlbums(artistId);
      return albums.length > 0 ? albums[0] : null; // Return most recent album
    });

    const albums = await Promise.all(albumPromises);
    return albums
      .filter((album): album is Album => album !== null)
      .sort(
        (a, b) =>
          new Date(b.release_date).getTime() -
          new Date(a.release_date).getTime(),
      );
  } catch (error) {
    console.error("Error fetching artists latest albums:", error);
    throw new ApiError({
      message: "Failed to fetch latest albums",
      code: "FETCH_LATEST_ALBUMS_ERROR",
    });
  }
};

// Utility functions for data formatting
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const formatFanCount = (count?: number): string => {
  if (!count) return "";
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M fans`;
  if (count >= 1000) return `${(count / 1000).toFixed(0)}K fans`;
  return `${count} fans`;
};

export const formatReleaseDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString("en-AU", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};
