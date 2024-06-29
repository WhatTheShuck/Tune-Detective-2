import Dexie, { Table } from 'dexie';

export interface TrackedArtist {
  id: number;
  name: string;
}

export interface Settings {
  setting: string;
  value: string;
}

export class AppDatabase extends Dexie {
  trackedArtists!: Table<TrackedArtist, number>;
  settings!: Table<Settings, string>;

  constructor() {
    super('TuneDetective');
    this.version(1).stores({
      trackedArtists: '&id, name'
    });
    this.version(2).stores({
      trackedArtists: '&id, name',
      settings: '&setting, value'
    }).upgrade(tx => {
      return this.addDefaultSettings(tx);
    });
  }

  async addDefaultSettings(tx: { table: (name: string) => Table<any, any> }) {
    const settingsTable = tx.table('settings') as Table<Settings, string>;
    const defaultSettings = [
      { setting: 'theme', value: 'unused' },
      { setting: 'notifications', value: 'unused' },
      { setting: 'navigation', value: ''},
    ];

    for (const setting of defaultSettings) {
      const existingSetting = await settingsTable.get(setting.setting);
      if (!existingSetting) {
        await settingsTable.add(setting);
      }
    }
  }

  async initializeDatabase() {
    const settingsCount = await this.settings.count();
    if (settingsCount === 0) {
      await this.transaction('rw', this.settings, async () => {
        await this.addDefaultSettings({
          table: (name: string) => this.table(name)
        });
      });
    }
  }
}

export const db = new AppDatabase();
