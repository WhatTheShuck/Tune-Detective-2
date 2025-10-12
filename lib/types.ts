export interface Artist {
  id: number;
  name: string;
  picture?: string;
  picture_small?: string;
  picture_medium?: string;
  picture_big?: string;
  picture_xl?: string;
  nb_fan?: number;
  nb_album?: number;
}

export interface Album {
  id: number;
  title: string;
  cover?: string;
  cover_small?: string;
  cover_medium?: string;
  cover_big?: string;
  cover_xl?: string;
  release_date: string;
  record_type?: string;
  explicit_lyrics?: boolean;
  genre_id?: number;
  artist: {
    id: number;
    name: string;
  };
  nb_tracks?: number;
}

export interface Track {
  id: number;
  title: string;
  duration: number;
  track_position?: number;
  disk_number?: number;
  explicit_lyrics?: boolean;
  preview?: string;
  artist?: {
    id: number;
    name: string;
  };
}
export interface TrackedArtist {
  id: number;
  name: string;
  picture_medium?: string;
  dateAdded: string;
  lastChecked?: string;
}
// API Response types for Deezer JSONP responses
export interface DeezerSearchResponse<T> {
  data: T[];
  total: number;
  next?: string;
  prev?: string;
}

export interface DeezerArtistSearchResponse
  extends DeezerSearchResponse<Artist> {}
export interface DeezerAlbumSearchResponse
  extends DeezerSearchResponse<Album> {}
export interface DeezerTrackSearchResponse
  extends DeezerSearchResponse<Track> {}

// Error types
export interface ApiError extends Error {
  message: string;
  status?: number;
  code?: string;
}
