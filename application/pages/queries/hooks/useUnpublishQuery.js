import { useCallback } from "react";
import useUpdateQuery from "./useUpdateQuery";
import recordEvent from "@/services/recordEvent";

export default function useUnpublishQuery(query, onChange) {
  const updateQuery = useUpdateQuery(query, onChange);

  return useCallback(() => {
    recordEvent("toggle_published", "query", query.id);
    updateQuery({ is_published: false });
  }, [query.id, updateQuery]);
}
