import React from "react";
import { Skeleton } from "antd";
import BigMessage from "@/components/general/BigMessage";

type LoadingStateProps = {
  skeleton?: boolean;
  className?: string;
  message?: string;
}

export default function LoadingState(props: LoadingStateProps) {
  return props.skeleton ? (
    <Skeleton active />
  ) : (
    <BigMessage
      icon="fa-spinner fa-2x fa-pulse"
      message={props.message || "Loading..."}
      className={props.className || ""}
    />
  );
}
