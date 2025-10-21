import Dexie, { Table } from "dexie";

export interface Workspace {
  id?: number;
  name: string;
  isActive: 1 | 0;
  createdAt?: Date;
}

export interface Setting {
  id?: number;
  key: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserSettings {
  id?: number;
  workspaceId: number;
  settingId: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}

export interface Column {
  id?: number;
  slug: string;
  workspaceId: number;
  title: string;
  emoji: string;
  index: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Card {
  id?: number;
  slug: string;
  columnId: number;
  content: string;
  index: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Tag {
  id?: number;
  title: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CardTags {
  id?: number;
  tagId: number;
  cardId: number;
  createdAt?: Date;
}
class LocalDashboardDB extends Dexie {
  workspace!: Table<Workspace>;
  settings!: Table<Setting>;
  user_settings!: Table<UserSettings>;
  column!: Table<Column>;
  card!: Table<Card>;
  tag!: Table<Tag>;
  card_tags!: Table<CardTags>;

  constructor() {
    super("Frankusky_Local_Dashboard_DB");
    this.version(1).stores({
      workspace: "++id, name, isActive, createdAt",
      settings: "++id, key, description, updatedAt",
      user_settings:
        "++id, workspaceId, settingId, value, &[workspaceId+settingId]",
      column:
        "++id, &slug, workspaceId, title, emoji, index, createdAt, updatedAt",
      card: "++id, &slug, columnId, content, index, createdAt, updatedAt",
      tag: "++id, &title, createdAt, updatedAt",
      card_tags: "++id, tagId, cardId, createdAt, &[tagId+cardId]",
    });

    // only runs when the db is created
    this.on("populate", () => {
      this.settings.bulkAdd([
        {
          key: "language",
          description: "User interface language",
        },
        {
          key: "theme",
          description: "User interface theme",
        },
        {
          key: "font",
          description: "User font",
        },
      ]);
    });

    /* Settings Table Hooks */
    this.settings.hook("creating", (_, obj) => {
      obj.createdAt = new Date();
      obj.updatedAt = new Date();
    });

    this.settings.hook("updating", (_, __, obj) => {
      obj.updatedAt = new Date();
    });

    /* Workspace Table Hook */
    this.workspace.hook("creating", (_, obj) => {
      obj.createdAt = new Date();
    });

    /* Column Table Hook */
    this.column.hook("creating", (_, obj) => {
      obj.createdAt = new Date();
      obj.updatedAt = new Date();
    });

    this.column.hook("updating", (_, __, obj) => {
      obj.updatedAt = new Date();
    });

    this.column.hook("deleting", (primKey, _, transaction) => {
      return transaction
        .table("card")
        .where("columnId")
        .equals(primKey)
        .delete();
    });

    /* Card Table Hook */
    this.card.hook("creating", (_, obj) => {
      obj.createdAt = new Date();
      obj.updatedAt = new Date();
    });

    this.card.hook("updating", (_, __, obj) => {
      obj.updatedAt = new Date();
    });

    this.card.hook("deleting", (primKey, _, transaction) => {
      return transaction
        .table("card_tags")
        .where("cardId")
        .equals(primKey)
        .delete();
    });

    /* Card Tags Table Hook */
    this.card_tags.hook("creating", (_, obj) => {
      obj.createdAt = new Date();
    });
  }
}

export const db = new LocalDashboardDB();
