import React from "react";
import EditInPlace from "@/components/general/EditInPlace";
import { currentUser } from "@/services/auth";
import Group from "@/services/group";

interface GroupNameProps {
  group?: { name: string; type?: string };
  onChange?: () => void;
  [key: string]: any;
}

function updateGroupName(
  group: { name: string },
  name: string,
  onChange?: () => void
) {
  group.name = name;
  Group.save(group);
  if (onChange) onChange();
}

export default function GroupName({
  group, onChange, ...props
}: GroupNameProps) {
  if (!group) return null;

  const canEdit = currentUser.isAdmin && group.type !== "builtin";

  return (
    <h3 {...props}>
      <EditInPlace
        className="edit-in-place"
        isEditable={canEdit}
        ignoreBlanks
        onDone={(name: string) => updateGroupName(group, name, onChange)}
        value={group.name}
      />
    </h3>
  );
}
