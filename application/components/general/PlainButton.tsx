import React from "react";
import { Typography } from "antd";
const { Text } = Typography;

export interface PlainButtonProps extends
Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  type?: "link" | "button";
}

function PlainButton({ className, type, ...rest }: PlainButtonProps) {
  return (
    <Text className="clickable" {...rest} />
  )
}

export default PlainButton;
