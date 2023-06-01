import React, { useState } from "react";
import Modal from "antd/lib/modal";
import Input from "antd/lib/input";
import { wrap as wrapDialog } from "@/components/general/DialogWrapper";
import { CreateDialogProps } from "@/components/general/DialogWrapper";

const CreateGroupDialog: React.FC<CreateDialogProps> = ({ dialog }) => {
  const [name, setName] = useState("");

  const save = () => {
    dialog.close({ name });
  };

  return (
    <Modal {...dialog.props} title="Create a New Group" okText="Create"
      onOk={() => save()}
    >
      <Input
        value={name}
        onChange={(event) => setName(event.target.value)}
        onPressEnter={() => save()}
        placeholder="Group Name"
        aria-label="Group name"
        autoFocus
      />
    </Modal>
  );
};

export default wrapDialog(CreateGroupDialog);
