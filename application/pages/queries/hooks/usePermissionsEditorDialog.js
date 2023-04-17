import { useCallback } from "react";
import PermissionsEditorDialog from "@/components/settings/PermissionsEditorDialog";

export default function usePermissionsEditorDialog(query) {
  return useCallback(() => {
    PermissionsEditorDialog.showModal({
      aclUrl: `api/queries/${query.id}/acl`,
      context: "query",
      author: query.user,
    });
  }, [query.id, query.user]);
}
