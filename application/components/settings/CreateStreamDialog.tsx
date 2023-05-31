import React from "react";
import Modal from "antd/lib/modal";
import { CreateDialogProps } from "@/components/general/DialogWrapper";
import { wrap as wrapDialog } from "@/components/general/DialogWrapper";

class CreateStreamDialog extends React.Component<CreateDialogProps> {
  render() {
    console.log(this.props);

    const { dialog } = this.props;
    
    return (
      <Modal title="Create a New Data Stream" {...dialog.props} />
    )
  }
}

// NOTE: see CreateGroupDialog

export default wrapDialog(CreateStreamDialog);
