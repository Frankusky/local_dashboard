import Dexie, { Table } from "dexie";

export interface Workspace {
  id?: number;
  name: string;
  isActive: 1 | 0;
  createdAt: Date;
}

export interface Setting {
  id?: number;
  key: string;
  description: string;
  updatedAt: Date;
}

interface UserSettings {
  id?: number;
  workspaceId: number;
  settingId: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}

class LocalDashboardDB extends Dexie {
  workspace!: Table<Workspace>;
  settings!: Table<Setting>;
  userSettings!: Table<UserSettings>;

  constructor() {
    super("Frankusky_Local_Dashboard_DB");
    this.version(1).stores({
      workspace: "++id, name, isActive, createdAt",
      settings: "++id, key, description, updatedAt",
      userSettings:
        "++id, workspaceId, settingId, value, &[workspaceId+settingId]",
    });

    // only runs when the db is created
    this.on("populate", () => {
      this.settings.bulkAdd([
        {
          key: "language",
          description: "User interface language",
          updatedAt: new Date(),
        },
        {
          key: "theme",
          description: "User interface theme",
          updatedAt: new Date(),
        },
        {
          key: "font",
          description: "User font",
          updatedAt: new Date(),
        },
      ]);
    });
  }
}

export const db = new LocalDashboardDB();
