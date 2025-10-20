import {
  DashboardCardType,
  DashboardColumnType,
} from "@/components/DashBoard/Dashboard.types";
import { Column, db } from "@/lib/database";
import { WorkspaceService } from "@/services/WorkspaceService/WorkspaceService";
import { withDB } from "@/utils/dbUtils";
import { useLiveQuery } from "dexie-react-hooks";

export const DashboardService = {
  /**
   * Get the columns of the current dashboard
   * @returns Collection of columns
   */
  getColumns: async (): Promise<Column[]> =>
    withDB(async () => {
      const activeWorkspace = await WorkspaceService.getActiveWorkspace();
      const dashboardColumns = await db.column
        .where("workspaceId")
        .equals(activeWorkspace?.id as number)
        .toArray();

      return dashboardColumns;
    }),
  /**
   * Add a new column to the workspace
   * @param {Object} params - Column parameters
   * @param {string} params.slug - Slug of the column
   * @param {string} params.title - Title of the column
   * @param {string} [params.emoji=""] - Emoji of the column (optional)
   * @returns {Promise<void>} Promise that resolves when the column is added
   */
  addColumn: async ({
    slug,
    title,
    emoji = "",
  }: {
    slug: string;
    title: string;
    emoji?: string;
  }) => {
    return withDB(async () => {
      const activeWorkspace = await WorkspaceService.getActiveWorkspace();

      const lastIndex = await db.column
        .where("workspaceId")
        .equals(activeWorkspace?.id as number)
        .sortBy("index");

      const payload = {
        slug,
        workspaceId: activeWorkspace?.id as number,
        title,
        emoji,
        index: (lastIndex[lastIndex.length - 1]?.index || 0) + 1,
      };

      const id = await db.column.add(payload);

      return { ...payload, id, cards: [] };
    });
  },
  addCard: async ({
    slug,
    columnId,
    content,
  }: {
    slug: string;
    columnId: number;
    content: string;
  }) => {
    return withDB(async () => {
      const lastCardIndex = await db.card
        .where("columnId")
        .equals(columnId)
        .sortBy("index");

      const payload = {
        slug,
        columnId,
        content,
        index: (lastCardIndex[lastCardIndex.length - 1]?.index || 0) + 1,
      };
      const id = db.card.add(payload);

      return { ...payload, id };
    });
  },
  getCards: async (columnId: number) => {
    return await withDB(async (): Promise<DashboardCardType[]> => {
      const cards = await db.card.where("columnId").equals(columnId).toArray();
      return cards as DashboardCardType[];
    });
  },
  useGetDashboardData: () => {
    return useLiveQuery(async (): Promise<DashboardColumnType[]> => {
      return withDB(async () => {
        const columns = await DashboardService.getColumns();
        const dashboardColumns = await Promise.all(
          columns.map(async (singleColumn) => {
            const cards = await DashboardService.getCards(
              singleColumn.id as number
            );
            return {
              ...singleColumn,
              cards: cards,
            };
          })
        );

        return dashboardColumns as DashboardColumnType[];
      });
    });
  },
  deleteCard: async (cardId: number) => {
    return await withDB(async () => {
      return await db.card.where("id").equals(cardId).delete();
    });
  },
  deleteColumn: async (columnId: number) => {
    return await withDB(async () => {
      return await db.column.where("id").equals(columnId).delete();
    });
  },
};
