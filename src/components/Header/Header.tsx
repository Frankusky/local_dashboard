import RightSideContent from "@/components/Header/RightSideContent";
import { db } from "@/lib/database";
import { useLiveQuery } from "dexie-react-hooks";
import { Toolbar } from "primereact/toolbar";

const Header = () => {
  const LeftSideContent = () => {
    return (
      <div className="flex flex-col items-end">
        <h1 className="text-xl">My local dashboard</h1>
        <h6 className="text-xs">V 0.1 Beta</h6>
      </div>
    );
  };

  const CenterSideContent = () => {
    const currentWorkspaceName = useLiveQuery(async () => {
      return (
        (await db.workspace.where("isActive").equals(1)?.first())?.name || ""
      );
    });

    if (!currentWorkspaceName) return null;

    return (
      <div className="flex flex-col items-center">
        <h6 className="text-xs">Current workspace:</h6>
        <h1 className="text-2xl">{currentWorkspaceName}</h1>
      </div>
    );
  };

  return (
    <header className="flex flex-none bg-">
      <Toolbar
        start={LeftSideContent}
        center={CenterSideContent}
        end={RightSideContent}
        className="w-full"
      />
    </header>
  );
};

export default Header;
