import { Injectable } from '@angular/core';
import { db, TrackedArtist } from './db';

@Injectable({
  providedIn: 'root'
})
export class TrackedArtistService {
  async getAllTrackedArtists(): Promise<TrackedArtist[]> {
    return await db.trackedArtists.toArray();
  }

  async addTrackedArtist(artist: TrackedArtist): Promise<number> {
    return await db.trackedArtists.add(artist);
  }

  async removeTrackedArtist(id: number): Promise<void> {
    await db.trackedArtists.delete(id);
  }

  async isArtistTracked(id: number): Promise<boolean> {
    const artist = await db.trackedArtists.get(id);
    return !!artist;
  }

  async clearAllTrackedArtists(): Promise<void> {
    await db.trackedArtists.clear();
  }

  async bulkAddTrackedArtists(artists: TrackedArtist[]): Promise<number> {
    return await db.trackedArtists.bulkAdd(artists);
  }
}
