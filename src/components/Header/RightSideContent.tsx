import {
  FontService,
  ValidFontTypes,
} from "@/services/FontService/FontService";
import { WorkspaceService } from "@/services/WorkspaceService/WorkspaceService";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { TieredMenu } from "primereact/tieredmenu";
import { useRef, useState } from "react";

const RightSideContent = () => {
  const settingsMenu = useRef<TieredMenu>(null);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");

  const menuItems = [
    {
      label: "Rename Current Workspace",
      icon: "pi pi-pencil",
      command: () => setShowRenameDialog(true),
    },
    {
      label: "Change font",
      items: [
        {
          template: () => (
            <span className="font-chilanka px-4 py-2">Chilanka</span>
          ),
          command: async () =>
            await FontService.setFont(ValidFontTypes.chilanka),
        },
        {
          template: () => <span className="font-roboto px-4 py-2">Roboto</span>,
          command: async () => await FontService.setFont(ValidFontTypes.roboto),
        },
        {
          template: () => (
            <span className="font-quicksand px-4 py-2">Quicksand</span>
          ),
          command: async () =>
            await FontService.setFont(ValidFontTypes.quicksand),
        },
      ],
    },
  ];

  const onHideRenameDialog = () => {
    setShowRenameDialog(false);
    setNewWorkspaceName("");
  };

  const onSaveRename = async () => {
    await WorkspaceService.renameCurrentWorkspace(newWorkspaceName);
    onHideRenameDialog();
  };

  const renameDialogFooter = () => {
    return (
      <div>
        <Button
          type="button"
          label="Cancel"
          severity="danger"
          onClick={onHideRenameDialog}
        />
        <Button
          type="button"
          label="Rename"
          severity="success"
          disabled={newWorkspaceName === ""}
          onClick={onSaveRename}
        />
      </div>
    );
  };

  return (
    <div>
      <Button
        label="Settings"
        icon="pi pi-cog"
        aria-haspopup
        onClick={(event) => {
          if (settingsMenu.current) settingsMenu.current.toggle(event);
        }}
        iconPos="right"
      />
      <TieredMenu ref={settingsMenu} popup model={menuItems} />
      <Dialog
        header="Rename Current Workspace"
        visible={showRenameDialog}
        onHide={onHideRenameDialog}
        footer={renameDialogFooter}
        draggable={false}
      >
        <p className="max-w-full">
          Type the new name for the current workspace:
        </p>
        <InputText
          id="newWorkspaceName"
          autoComplete="off"
          onChange={(ev) => setNewWorkspaceName(ev.target.value)}
          className="w-full"
          placeholder="New workspace name"
        />
      </Dialog>
    </div>
  );
};

export default RightSideContent;
