import RegisterUserBody from "@/components/RegisterUser/RegisterUserBody";
import { db } from "@/lib/database";
import { useLiveQuery } from "dexie-react-hooks";
import { Dialog } from "primereact/dialog";
import { useState } from "react";

const RegisterUserModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useLiveQuery(async () => {
    const usersCount = await db.workspace.where("isActive").equals(1).count();
    const hasUsers = usersCount !== 0;
    setIsModalOpen(!hasUsers);
  });

  return (
    <Dialog
      visible={isModalOpen}
      modal
      onHide={() => setIsModalOpen(false)}
      position="center"
      draggable={false}
      content={<RegisterUserBody />}
    />
  );
};

export default RegisterUserModal;
