import { db } from "@/lib/database";
import { withDB } from "@/utils/dbUtils";
import { useLiveQuery } from "dexie-react-hooks";

export const WorkspaceService = {
  /**
   * Creates a new workspace
   * @param name Name of the workspace
   * @param isActive Activates (or not) the current workspace. Default: false
   * @returns {number} Id of the new workspace
   */
  createWorkspace: async (name: string, isActive: boolean = false) => {
    try {
      const id = await db.workspace.add({
        name,
        isActive: isActive ? 1 : 0,
      });
      return id;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  /**
   * Delete a workspace by his id
   * @param id Workspace id
   * @returns {boolean} True if succeeded
   */
  deleteWorkspace: async (id: number) => {
    return await withDB(async () => {
      await db.workspace.delete(id);
      return true;
    });
  },
  /**
   * Rename current workspace
   * @param newWorkspaceName New name of the workspace
   * @returns {number} Id of the updated workspace
   */
  renameCurrentWorkspace: async (newWorkspaceName: string) => {
    const currentWorkspace = await db.workspace
      .where("isActive")
      .equals(1)
      .first();
    return await withDB(
      async () =>
        await db.workspace.update(currentWorkspace?.id, {
          name: newWorkspaceName,
        })
    );
  },
  /**
   * Hook to get the active workspace
   * @returns {string} Name of the current workspace
   */
  useGetCurrentWorkspaceName: () => {
    return useLiveQuery(async () => {
      const activeWorkspaceName = await db.workspace
        .where("isActive")
        .equals(1)
        .first();

      return activeWorkspaceName?.name || "";
    });
  },
  /**
   * Get active workspace name
   * @returns {string} Name of the active workspace
   */
  getActiveWorkspace: async () => {
    return await db.workspace.where("isActive").equals(1).first();
  },
};
