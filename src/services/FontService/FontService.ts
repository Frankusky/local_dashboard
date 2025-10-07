import { db } from "@/lib/database";
import { withDB } from "@/utils/dbUtils";

export enum ValidFontTypes {
  chilanka = "font-chilanka",
  roboto = "font-roboto",
  quicksand = "font-quicksand",
}

export const FontService = {
  setFont: async (fontName: ValidFontTypes) => {
    return await withDB(async () => {
      const fontSettingId = (
        await db.settings.where("key").equals("font").first()
      )?.id as number;

      const fontUserSettingId = (
        await db.userSettings.where("settingId").equals(fontSettingId).first()
      )?.id as number;

      return await db.userSettings.put({
        id: fontUserSettingId,
        workspaceId: -1,
        settingId: fontSettingId as number,
        value: fontName,
      });
    });
  },
};
