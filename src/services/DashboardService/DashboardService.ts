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
   * @returns {Promise<Omit<DashboardColumnType,"cards">[]>} Collection of columns
   */
  getColumns: async (): Promise<Column[]> =>
    withDB(async () => {
      const activeWorkspace = await WorkspaceService.getActiveWorkspace();
      const dashboardColumns = await db.column
        .where("workspaceId")
        .equals(activeWorkspace?.id as number)
        .toArray();

      return dashboardColumns.sort((a, b) => a.index - b.index);
    }),
  /**
   * Add a new column to the workspace
   * @param {Object} params - Column parameters
   * @param {string} params.slug - Slug of the column
   * @param {string} params.title - Title of the column
   * @param {string} [params.emoji=""] - Emoji of the column (optional)
   * @returns {Promise<DashboardColumnType>} Promise that resolves when the column is added
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
  /**
   * Adds a card for the current column
   * @param {Object} param The card parameter
   * @param {string} param.slug A slug for this card
   * @param {number} param.columnId The column Id that will own this card
   * @param {string} param.content The content of the card
   * @returns {Promise<DashboardCardType>} All the new card data
   */
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
  /**
   * Get all cards related within a column
   * @param {number} columnId The column id that you want to get the cards
   * @returns {Promise<DashboardCardType[]>} The group of cards within the provided column id
   */
  getCards: async (columnId: number) => {
    return await withDB(async (): Promise<DashboardCardType[]> => {
      const cards = await db.card.where("columnId").equals(columnId).toArray();
      return cards.sort((a, b) => a.index - b.index) as DashboardCardType[];
    });
  },
  /**
   * Get all the data of the current active dashboard
   * @returns {Promise<DashboardColumnType[]>} The whole data within this dashboard
   */
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
  /**
   * Removes a card
   * @param {number} cardId The id of the card that you want to be deleted
   * @returns {number} Returns number of collections deleted (should be always 1)
   */
  deleteCard: async (cardId: number) => {
    return await withDB(async () => {
      return await db.card.where("id").equals(cardId).delete();
    });
  },
  /**
   * Removes a column
   * @param {number} columnId The id of the column that you want to delete
   * @returns {number} Returns the number of collections deleted (should be always 1)
   */
  deleteColumn: async (columnId: number) => {
    return await withDB(async () => {
      return await db.column.where("id").equals(columnId).delete();
    });
  },
  /**
   * Updates the index according the order that the column comes in the array
   * @param {DashboardColumnType[]} newColumnOrder Sorted columns
   * @returns {number} Number of items modified
   */
  moveColumn: async (newColumnOrder: DashboardColumnType[]) => {
    return await withDB(async () => {
      const sortedPayload = newColumnOrder.map((item, index) => ({
        key: item.id,
        changes: { index },
      }));

      return db.column.bulkUpdate(sortedPayload);
    });
  },
  /**
   * Updates the index according the order that the column comes in the array
   * @param {DashboardColumnType[]} newCardOrder Sorted columns
   * @returns {number} Number of items modified
   */
  moveCard: async (newCardOrder: DashboardCardType[]) => {
    return await withDB(async () => {
      const sortedPayload = newCardOrder.map((item, index) => ({
        key: item.id,
        changes: { index },
      }));

      return db.card.bulkUpdate(sortedPayload);
    });
  },
  /**
   * Updates the index and the columnId according the order that the column comes in the array
   * @param {DashboardCardType[]} newCardOrder Sorted columns
   * @returns {number} Number of items modified
   */
  moveCardIntoAnotherColumn: async (newSortedCards: DashboardCardType[]) => {
    return await withDB(async () => {
      const sortedPayload = newSortedCards.map((item, index) => ({
        key: item.id,
        changes: {
          index,
          columnId: item.columnId,
        },
      }));
      return db.card.bulkUpdate(sortedPayload);
    });
  },
};
