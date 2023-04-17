import { trim } from "@lodash";
import React, { useState, useEffect } from "react";
import cx from "classnames";
import Input from "antd/lib/input";

interface EditInPlaceProps {
  ignoreBlanks?: boolean;
  isEditable?: boolean;
  placeholder?: string;
  value?: string;
  onDone: (newValue: string) => void;
  onStopEditing?: () => void;
  multiline?: boolean;
  editorProps?: Record<string, any>;
  defaultEditing?: boolean;
  className?: string;
}

const EditInPlace: React.FC<EditInPlaceProps> = ({
  ignoreBlanks = false,
  isEditable = true,
  placeholder = "",
  value = "",
  onStopEditing = () => {},
  multiline = false,
  editorProps = {},
  defaultEditing = false,
  className,
  onDone,
}) => {
  const [editing, setEditing] = useState(defaultEditing);

  useEffect(() => {
    if (!editing) {
      onStopEditing();
    }
  }, [editing, onStopEditing]);

  const startEditing = () => {
    if (isEditable) {
      setEditing(true);
    }
  };

  const stopEditing = (currentValue: string) => {
    const newValue = trim(currentValue);
    const ignorableBlank = ignoreBlanks && newValue === "";
    if (!ignorableBlank && newValue !== value) {
      onDone(newValue);
    }
    setEditing(false);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      stopEditing(event.currentTarget.value);
    } else if (event.key === "Escape") {
      setEditing(false);
    }
  };

  const renderNormal = () =>
    value ? (
      <span
        role="presentation"
        onFocus={startEditing}
        onClick={startEditing}
        className={isEditable ? "editable" : ""}>
        {value}
      </span>
    ) : (
      <a className="clickable" onClick={startEditing}>
        {placeholder}
      </a>
    );

  const InputComponent = multiline ? Input.TextArea : Input;

  const renderEdit = () => (
    <InputComponent
      defaultValue={value}
      aria-label="Editing"
      onBlur={(e) => stopEditing(e.currentTarget.value)}
      onKeyDown={handleKeyDown}
      autoFocus
      {...editorProps}
    />
  );

  return (
    <span className={cx("edit-in-place", { active: editing }, className)}>
      {editing ? renderEdit() : renderNormal()}
    </span>
  );
};

export default EditInPlace;
