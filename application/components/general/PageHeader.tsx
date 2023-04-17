import React, { ReactNode } from "react";

interface PageHeaderProps {
  title?: string;
  actions?: ReactNode;
}

export default function PageHeader({ title = "", actions }: PageHeaderProps) {
  return (
    <div className="page-header-wrapper">
      <h3>{title}</h3>
      {actions && <div className="page-header-actions">{actions}</div>}
    </div>
  );
}
