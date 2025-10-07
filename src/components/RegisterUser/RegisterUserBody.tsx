import { WorkspaceService } from "@/services/WorkspaceService/WorkspaceService";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Controller, FieldValues, useForm } from "react-hook-form";

const RegisterUserBody = () => {
  const { handleSubmit, control, watch } = useForm({
    defaultValues: { workspaceName: "" },
  });

  const { workspaceName: workspaceNameValue } = watch();

  const onSuccessSubmit = async (data: FieldValues) => {
    await WorkspaceService.createWorkspace(data.workspaceName, true);
  };

  return (
    <div className="bg-white z-50 rounded p-8 text-center">
      <div className="font-bold text-4xl">Welcome to your Local Dashboard!</div>
      <hr className="my-4 border-t border-gray-300 mx-8" />
      <div className="flex flex-col gap-2">
        <p>
          All your data is{" "}
          <span className="font-semibold">stored locally,</span> this means that
          we don't store any data on servers.
        </p>
        <p>
          Everything its <span className="text-xl font-semibold">ONLY</span> in
          your computer!
        </p>
        <p>
          Please type a name to identify this workspace<small>*</small>
        </p>

        <form onSubmit={handleSubmit(onSuccessSubmit)}>
          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
              <i className="pi pi-receipt" />
            </span>
            <Controller
              control={control}
              name="workspaceName"
              render={({ field }) => (
                <InputText
                  placeholder="Workspace name"
                  {...field}
                  autoComplete="off"
                />
              )}
            />
            <Button
              icon="pi pi-check"
              label="Submit"
              severity="success"
              disabled={workspaceNameValue === ""}
              type="submit"
            />
          </div>
        </form>
        <p className="text-xs">
          * In the future its planned to enable more workspaces, so you can
          organize your notes between work, personal, etc
        </p>
      </div>
    </div>
  );
};

export default RegisterUserBody;
