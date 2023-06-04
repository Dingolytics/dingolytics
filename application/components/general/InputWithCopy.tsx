import React, { useRef, useState, useEffect } from "react";
import Input, { InputRef } from "antd/lib/input";
import CopyOutlinedIcon from "@ant-design/icons/CopyOutlined";
import Tooltip from "@/components/general/Tooltip";
import PlainButton from "@/components/general/PlainButton";

interface Props extends React.ComponentProps<typeof Input> {}

const InputWithCopy: React.FC<Props> = (props) => {
  const [tooltipColor, setTooltipColor] = useState<string>("black");
  const [tooltip, setTooltip] = useState<string | null>(null);
  const inputRef = useRef<InputRef>(null);
  const resetCopyStateRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyFeatureSupported = Boolean(
    navigator.clipboard && navigator.clipboard.writeText
  );

  useEffect(() => {
    return () => {
      if (resetCopyStateRef.current) {
        clearTimeout(resetCopyStateRef.current);
      }
    };
  }, []);

  const copy = async () => {
    if (!inputRef.current?.input || !copyFeatureSupported) return;

    try {
      await navigator.clipboard?.writeText(inputRef.current.input.value);
      setTooltip("Saved to clipboard");
      setTooltipColor("green");
    } catch (err) {
      setTooltip("Copy failed");
      setTooltipColor("red");
    }
    resetCopyStateRef.current = setTimeout(() => {
      setTooltip(null);
      setTooltipColor("black");
    }, 2000);
  };

  const copyButton = (
    <Tooltip title={tooltip || "Copy"} color={tooltipColor}>
      <PlainButton onClick={copy}>
        <CopyOutlinedIcon />
      </PlainButton>
    </Tooltip>
  );

  return (
    <Input {...props} ref={inputRef}
      addonAfter={copyFeatureSupported && copyButton}
    />
  );
};

export default InputWithCopy;
