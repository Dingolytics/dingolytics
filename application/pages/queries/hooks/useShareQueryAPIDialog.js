import { useCallback } from "react";
import QueryShareAPIDialog from "@/components/queries/QueryShareAPIDialog";
import useImmutableCallback from "@/lib/hooks/useImmutableCallback";

export default function useShareQueryAPIDialog(query, onChange) {
  const handleChange = useImmutableCallback(onChange);

  return useCallback(() => {
    QueryShareAPIDialog.showModal({ query }).onClose(handleChange);
  }, [query, handleChange]);
}
