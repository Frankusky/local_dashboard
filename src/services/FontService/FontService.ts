import { GLOBAL_CONFIGURATION_INDEX } from "@/constants/dbConstants";
import { db } from "@/lib/database";
import { withDB } from "@/utils/dbUtils";
import { useLiveQuery } from "dexie-react-hooks";

export enum ValidFontTypes {
  chilanka = "font-chilanka",
  roboto = "font-roboto",
  quicksand = "font-quicksand",
}

export const FontService = {
  /**
   * Changes the font of the page
   * @param fontName Font name
   * @returns
   */
  setFont: async (fontName: ValidFontTypes) => {
    return await withDB(async () => {
      const fontSettingId = (
        await db.settings.where("key").equals("font").first()
      )?.id as number;

      const fontUserSettingId = (
        await db.user_settings.where("settingId").equals(fontSettingId).first()
      )?.id as number;

      return await db.user_settings.put({
        id: fontUserSettingId,
        workspaceId: GLOBAL_CONFIGURATION_INDEX,
        settingId: fontSettingId as number,
        value: fontName,
      });
    });
  },
  /**
   * Hook to retrieve the font that the user selected
   * @returns Name of a valid font
   */
  useGetFont: (): ValidFontTypes => {
    return useLiveQuery(async () => {
      const fontSettingId = (
        await db.settings.where("key").equals("font").first()
      )?.id as number;
      const fontValue =
        (
          await db.user_settings
            .where("[workspaceId+settingId]")
            .equals([GLOBAL_CONFIGURATION_INDEX, fontSettingId])
            .first()
        )?.value || ValidFontTypes.chilanka;

      return fontValue;
    });
  },
};
