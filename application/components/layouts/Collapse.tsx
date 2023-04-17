import React, { ReactNode } from "react";
import cx from "classnames";
import { Collapse as AntCollapse } from "antd";

interface CollapseProps {
  collapsed?: boolean;
  children?: ReactNode;
  className?: string;
}

export default function Collapse({
  collapsed = true,
  children = null,
  className = "",
  ...props
}: CollapseProps) {
  return (
    <AntCollapse
      { ...props }
      activeKey={ collapsed ? "" : "content" }
      className={ cx(className, "ant-collapse-headerless") }
    >
      <AntCollapse.Panel key="content" header="">
        { children }
      </AntCollapse.Panel>
    </AntCollapse>
  );
}

Collapse.defaultProps = {
  collapsed: true,
  children: null,
  className: "",
};
