import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import RegisterUserModal from "@/components/RegisterUser/RegisterUserModal";
import {
  FontService,
  ValidFontTypes,
} from "@/services/FontService/FontService";
import Dashboard from "@/components/DashBoard/DashBoard";
import { useEffect } from "react";

function App() {
  const userFont = FontService.useGetFont();

  useEffect(() => {
    Object.values(ValidFontTypes).forEach((fontClassName) =>
      document.body.classList.remove(fontClassName)
    );
    document.body.classList.add(userFont);
  }, [userFont]);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-200 to-red-200 ">
      <RegisterUserModal />
      <Header />
      <main className="flex flex-1 overflow-y-auto w-full flex-col">
        <Dashboard />
      </main>
      <Footer />
    </div>
  );
}

export default App;
