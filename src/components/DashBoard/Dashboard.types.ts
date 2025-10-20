export type DashboardColumnType = {
  id?: number;
  title: string;
  cards: DashboardCardType[];
  slug: string;
  workspaceId: number;
  emoji: string;
  index: number;
  createdAt: Date;
  updatedAt: Date;
};

export type DashboardCardType = {
  id: number;
  content: string;
  slug: string;
  columnId: number;
  index: number;
  createdAt: Date;
  updatedAt: Date;
};
