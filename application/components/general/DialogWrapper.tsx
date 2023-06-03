/**
  Wrapper for dialogs based on Ant's <Modal> component.


  Using wrapped dialogs
  =====================

  Wrapped component is an object with two fields:

    {
      showModal: (dialogProps) => object({
          close: (result) => void,
          dismiss: (reason) => void,
          onClose: (handler) => this,
          onDismiss: (handler) => this,
        }),
      Component: React.Component, // wrapped dialog component
    }

  To open dialog, use `showModal` method; optionally you can pass additional
  properties that will be expanded on wrapped component:

    const dialog = SomeWrappedDialog.showModal()

    const dialog = SomeWrappedDialog.showModal({ greeting: 'Hello' })

  To get result of modal, use `onClose`/`onDismiss` setters:

    dialog
      .onClose(result => { ... }) // pressed OK button or used `close` method
      .onDismiss(result => { ... }) // pressed Cancel button or used `dismiss` method

  If `onClose`/`onDismiss` returns a promise - dialog wrapper will stop handling further close/dismiss
  requests and will show loader on a corresponding button until that promise is fulfilled (either resolved or
  rejected). If that promise will be rejected - dialog close/dismiss will be abandoned. Use promise returned
  from `close`/`dismiss` methods to handle errors (if needed).

  Also, dialog has `close` and `dismiss` methods that allows to close dialog by caller. Passed arguments
  will be passed to a corresponding handler. Both methods will return the promise returned from `onClose` and
 `onDismiss` callbacks. `update` method allows to pass new properties to dialog.


  Creating a dialog
  ================

  1. Add imports:

    import { wrap as wrapDialog, DialogPropType } from 'path/to/DialogWrapper';

  2. define a `dialog` property on your component:

    propTypes = {
      dialog: DialogPropType.isRequired,
    };

  `dialog` property is an object:

    {
      props: object, // properties for <Modal> component;
      close: (result) => void, // method to confirm dialog; `result` will be returned to caller
      dismiss: (reason) => void, // method to reject dialog; `reason` will be returned to caller
    }

  3. expand additional properties on <Modal> component:

    render() {
      const { dialog } = this.props;
      return (
        <Modal {...dialog.props}>
      );
    }

  4. wrap your component and export it:

    export default wrapDialog(YourComponent).

  Your component is ready to use. Wrapper will manage <Modal>'s visibility and events.
  If you want to override behavior of `onOk`/`onCancel` - don't forget to close dialog:

    customOkHandler() {
      this.saveData().then(() => {
         this.props.dialog.close({ success: true }); // or dismiss();
      });
    }

    render() {
      const { dialog } = this.props;
        return (
          <Modal {...dialog.props} onOk={() => this.customOkHandler()}>
        );
    }
*/
import { isFunction } from "@lodash";
import React from "react";
import PropTypes from "prop-types";
import { ModalProps } from 'antd/lib/modal';
import { createRoot } from 'react-dom/client';

interface ButtonProps {
  loading?: boolean;
  disabled?: boolean;
}

export interface DialogProps {
  props: ModalProps;
  close: (result?: any) => void;
  dismiss: () => void;
};

export type CreateDialogProps = {
  dialog: DialogProps;
};

export interface DialogPropsT<ROk, RCancel> {
  props: ModalProps;
  close: (result: ROk) => void;
  dismiss: (result: RCancel) => void;
}

export type DialogWrapperChildProps<ROk, RCancel> = {
  dialog: DialogPropsT<ROk, RCancel>;
};

function openDialog(
  DialogComponent: React.ComponentType<CreateDialogProps>, props: any
) {
  const container = document.createElement("div");
  const root = createRoot(container);
  document.body.appendChild(container);

  let pendingCloseTask: Promise<any> | null = null;

  const dialog = {
    props: {
      visible: true,
      okButtonProps: {} as ButtonProps,
      cancelButtonProps: {} as ButtonProps,
      onOk: (result: any) => Promise.resolve(),
      onCancel: (result: any) => Promise.resolve(),
      afterClose: () => {},
    },
    close: (result: any) => {},
    dismiss: (result: any) => {},
  };

  const handlers = {
    onClose: (handler: any) => {},
    onDismiss: (handler: any) => {},
  };

  function render() {
    root.render(<DialogComponent {...props} dialog={dialog} />);
  }

  function destroyDialog() {
    // Allow calling chain to roll up, and then destroy component
    setTimeout(() => {
      root.unmount();
      document.body.removeChild(container);
    }, 10);
  }

  function processDialogClose(result: any, setAdditionalDialogProps: any) {
    dialog.props.okButtonProps = { disabled: true };
    dialog.props.cancelButtonProps = { disabled: true };
    setAdditionalDialogProps();
    render();
    return Promise.resolve(result)
      .then(() => {
        dialog.props.visible = false;
      })
      .finally(() => {
        dialog.props.okButtonProps = {};
        dialog.props.cancelButtonProps = {};
        render();
      });
  }

  function closeDialog(result: any) {
    if (!pendingCloseTask) {
      pendingCloseTask = processDialogClose(
        handlers.onClose(result), () => {
        dialog.props.okButtonProps.loading = true;
      }).finally(() => {
        pendingCloseTask = null;
      });
    }
    return pendingCloseTask;
  }

  function dismissDialog(result: any) {
    if (!pendingCloseTask) {
      pendingCloseTask = processDialogClose(handlers.onDismiss(result), () => {
        dialog.props.cancelButtonProps.loading = true;
      }).finally(() => {
        pendingCloseTask = null;
      });
    }
    return pendingCloseTask;
  }

  dialog.props.onOk = closeDialog;
  dialog.props.onCancel = dismissDialog;
  dialog.props.afterClose = destroyDialog;
  dialog.close = closeDialog;
  dialog.dismiss = dismissDialog;

  const result = {
    close: closeDialog,
    dismiss: dismissDialog,
    update: (newProps: any) => {
      props = { ...props, ...newProps };
      render();
    },
    onClose: (handler: any) => {
      if (isFunction(handler)) {
        handlers.onClose = handler;
      }
      return result;
    },
    onDismiss: (handler: any) => {
      if (isFunction(handler)) {
        handlers.onDismiss = handler;
      }
      return result;
    },
  };

  // Show it only when all structures initialized to avoid
  // unnecessary re-rendering.
  render(); 

  return result;
}

export const DialogPropType = PropTypes.shape({
  props: PropTypes.shape({
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    afterClose: PropTypes.func,
  }).isRequired,
  close: PropTypes.func.isRequired,
  dismiss: PropTypes.func.isRequired,
});


export function wrap(DialogComponent: React.ComponentType<CreateDialogProps>) {
  return {
    Component: DialogComponent,
    showModal: (props: any) => openDialog(DialogComponent, props),
  };
}
