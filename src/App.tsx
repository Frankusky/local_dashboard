import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import RegisterUserModal from "@/components/RegisterUser/RegisterUserModal";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/database";
import { ValidFontTypes } from "@/services/FontService/FontService";
import { GLOBAL_CONFIGURATION_INDEX } from "@/constants/dbConstants";

function App() {
  useLiveQuery(async () => {
    const fontSettingId = (
      await db.settings.where("key").equals("font").first()
    )?.id as number;
    const fontValue =
      (
        await db.userSettings
          .where("[workspaceId+settingId]")
          .equals([GLOBAL_CONFIGURATION_INDEX, fontSettingId])
          .first()
      )?.value || ValidFontTypes.chilanka;

    Object.values(ValidFontTypes).forEach((fontClassName) =>
      document.body.classList.remove(fontClassName)
    );
    document.body.classList.add(fontValue);
  });

  return (
    <div className="h-screen flex flex-col container mx-auto">
      <RegisterUserModal />
      <Header />
      <main className="flex flex-1 overflow-y-auto flex-col"></main>
      <Footer />
    </div>
  );
}

export default App;
