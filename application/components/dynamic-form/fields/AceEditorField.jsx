import React from "react";
import AceEditorInput from "@/components/query-editor/AceEditorInput";

export default function AceEditorField({ form, field, ...otherProps }) {
  return <AceEditorInput {...otherProps} />;
}
