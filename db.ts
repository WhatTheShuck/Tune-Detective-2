import Dexie, { Table } from "dexie";

export interface TrackedArtist {
  id: number;
  name: string;
  picture_medium?: string;
  dateAdded: string;
  lastChecked?: string;
  nb_fan?: number;
  nb_album?: number;
}

export interface Settings {
  setting: string;
  value: string;
}

export interface SearchQuery {
  id?: number;
  query: string;
  searchType: "artist" | "album" | "track";
  timestamp: string;
}

export interface ArtistLatestRelease {
  artistId: number;
  artistName: string;
  latestAlbum?: {
    id: number;
    title: string;
    cover_medium?: string;
    release_date: string;
    record_type?: string;
  };
  fetchedAt: string;
  lastChecked: string;
}

export class AppDatabase extends Dexie {
  trackedArtists!: Table<TrackedArtist, number>;
  settings!: Table<Settings, string>;
  searchHistory!: Table<SearchQuery, number>;
  artistReleases!: Table<ArtistLatestRelease, number>;

  constructor() {
    super("TuneDetective");

    // Version 1: Original schema
    this.version(1).stores({
      trackedArtists: "&id, name",
    });

    // Version 2: Added settings
    this.version(2)
      .stores({
        trackedArtists: "&id, name",
        settings: "&setting, value",
      })
      .upgrade((tx) => {
        return this.addDefaultSettings(tx);
      });

    // Version 3: Next.js migration - enhanced schema
    this.version(3)
      .stores({
        trackedArtists: "&id, name, dateAdded, lastChecked",
        settings: "&setting, value",
        searchHistory: "++id, query, searchType, timestamp",
        artistReleases: "&artistId, artistName, fetchedAt, lastChecked",
      })
      .upgrade(async (tx) => {
        // Clean up old settings
        const settingsTable = tx.table("settings") as Table<Settings, string>;
        await settingsTable
          .where("setting")
          .anyOf(["theme", "navigation"])
          .delete();

        // Update existing tracked artists with new fields
        const trackedArtistsTable = tx.table("trackedArtists") as Table<
          TrackedArtist,
          number
        >;
        const existingArtists = await trackedArtistsTable.toArray();

        for (const artist of existingArtists) {
          if (!artist.dateAdded) {
            await trackedArtistsTable.update(artist.id, {
              dateAdded: new Date().toISOString(),
              lastChecked: undefined,
            });
          }
        }
      });
  }

  async addDefaultSettings(tx: { table: (name: string) => Table<any, any> }) {
    const settingsTable = tx.table("settings") as Table<Settings, string>;
    const defaultSettings = [{ setting: "notifications", value: "enabled" }];

    for (const setting of defaultSettings) {
      const existingSetting = await settingsTable.get(setting.setting);
      if (!existingSetting) {
        await settingsTable.add(setting);
      }
    }
  }

  async initializeDatabase() {
    // Check if we're in a browser environment (Next.js client-side)
    if (typeof window === "undefined") {
      return;
    }

    const settingsCount = await this.settings.count();
    if (settingsCount === 0) {
      await this.transaction("rw", this.settings, async () => {
        await this.addDefaultSettings({
          table: (name: string) => this.table(name),
        });
      });
    }
  }

  // Helper methods for search history
  async addSearchQuery(
    query: string,
    searchType: "artist" | "album" | "track",
  ) {
    if (typeof window === "undefined") return;

    // Remove duplicate if exists
    await this.searchHistory.where("query").equals(query).delete();

    // Add new search
    await this.searchHistory.add({
      query,
      searchType,
      timestamp: new Date().toISOString(),
    });

    // Keep only last 50 searches
    const count = await this.searchHistory.count();
    if (count > 50) {
      const oldest = await this.searchHistory
        .orderBy("timestamp")
        .limit(count - 50)
        .toArray();
      const oldestIds = oldest.map((item) => item.id!);
      await this.searchHistory.bulkDelete(oldestIds);
    }
  }

  async getRecentSearches(limit: number = 10): Promise<SearchQuery[]> {
    if (typeof window === "undefined") return [];

    return this.searchHistory
      .orderBy("timestamp")
      .reverse()
      .limit(limit)
      .toArray();
  }

  // Helper methods for artist releases
  async updateArtistRelease(
    artistId: number,
    artistName: string,
    latestAlbum?: any,
  ) {
    if (typeof window === "undefined") return;

    const releaseData: ArtistLatestRelease = {
      artistId,
      artistName,
      latestAlbum: latestAlbum
        ? {
            id: latestAlbum.id,
            title: latestAlbum.title,
            cover_medium: latestAlbum.cover_medium,
            release_date: latestAlbum.release_date,
            record_type: latestAlbum.record_type,
          }
        : undefined,
      fetchedAt: new Date().toISOString(),
      lastChecked: new Date().toISOString(),
    };

    await this.artistReleases.put(releaseData);
  }

  async getArtistRelease(
    artistId: number,
  ): Promise<ArtistLatestRelease | undefined> {
    if (typeof window === "undefined") return undefined;

    return this.artistReleases.get(artistId);
  }

  async shouldUpdateArtistRelease(
    artistId: number,
    maxAgeHours: number = 24,
  ): Promise<boolean> {
    if (typeof window === "undefined") return false;

    const release = await this.getArtistRelease(artistId);
    if (!release) return true;

    const lastChecked = new Date(release.lastChecked);
    const now = new Date();
    const hoursSinceUpdate =
      (now.getTime() - lastChecked.getTime()) / (1000 * 60 * 60);

    return hoursSinceUpdate >= maxAgeHours;
  }
}

// Create database instance with Next.js safety
let db: AppDatabase;

if (typeof window !== "undefined") {
  db = new AppDatabase();
} else {
  // Create a mock database for server-side rendering
  db = {} as AppDatabase;
}

export { db };
