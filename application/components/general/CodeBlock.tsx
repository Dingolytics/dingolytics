import React, { createRef, RefObject } from "react";
import Button from "antd/lib/button";
import Tooltip from "@/components/general/Tooltip";
import CopyOutlinedIcon from "@ant-design/icons/CopyOutlined";

interface CodeBlockProps {
  copyable: boolean;
  children?: React.ReactNode;
}

interface CodeBlockState {
  copied: string | null;
}

export default class CodeBlock extends
React.Component<CodeBlockProps, CodeBlockState> {
  private ref: RefObject<HTMLElement>;
  private copyFeatureEnabled: boolean;
  private resetCopyState: ReturnType<typeof setTimeout> | null;

  constructor(props: CodeBlockProps) {
    super(props);
    const { copyable = true } = props;
    this.ref = createRef<HTMLElement>();
    this.copyFeatureEnabled = copyable && ("clipboard" in navigator);
    this.resetCopyState = null;
    this.state = { copied: null };
  }

  componentWillUnmount() {
    if (this.resetCopyState) {
      clearTimeout(this.resetCopyState);
    }
  }

  copy = async () => {
    const text = this.ref.current ? this.ref.current.textContent : '';
    if (text) {
      try {
        await navigator.clipboard.writeText(text);
        this.setState({ copied: "Copied" });
      } catch (err) {
        this.setState({ copied: "Copy failed" });
      }
      this.resetCopyState = setTimeout(
        () => this.setState({ copied: null }), 2000
      );  
    }
  };

  render() {
    const { copyable, children, ...props } = this.props;

    const copyButton = (
      <Tooltip title={this.state.copied || "Copy"}>
        <Button icon={<CopyOutlinedIcon />}
          type="dashed" size="small" onClick={this.copy}
        />
      </Tooltip>
    );

    return (
      <div className="code-block">
        <code {...props} ref={this.ref}>
          {children}
        </code>
        {this.copyFeatureEnabled && copyButton}
      </div>
    );
  }
}
