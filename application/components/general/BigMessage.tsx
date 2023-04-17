import React from "react";
import { useUniqueId } from "@/lib/hooks/useUniqueId";
import cx from "classnames";

interface BigMessageProps {
  icon: string;
  message?: string;
  children?: React.ReactNode;
  className?: string;
}

function BigMessage({
  icon,
  message = "",
  children = null,
  className = "tiled bg-white"
}: BigMessageProps) {
  const messageId = useUniqueId("bm-message");
  return (
    <div
      className={cx("big-message p-15 text-center", className)}
      role="status"
      aria-live="assertive"
      aria-relevant="additions removals"
    >
      <h3 className="m-t-0 m-b-0" aria-labelledby={messageId}>
        <i className={cx("fa", icon)} aria-hidden="true" />
      </h3>
      <br />
      <span id={messageId}>{message}</span>
      {children}
    </div>
  );
}

export default BigMessage;
