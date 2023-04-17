import React from "react";
import classNames from "classnames";
import Link from "@/components/general/Link";

interface PreviewCardProps {
  imageUrl: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  roundedImage?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function PreviewCard({
  imageUrl,
  roundedImage = true,
  title,
  body,
  children,
  className,
  ...props
}: PreviewCardProps) {
  return (
    <div {...props} className={
      classNames(className, "w-100 d-flex align-items-center")
    }>
      <img
        src={imageUrl}
        width="32"
        height="32"
        className={
          classNames({ "profile__image--settings": roundedImage }, "m-r-5")
        }
        alt="Logo/Avatar"
      />
      <div className="flex-fill">
        <div>{title}</div>
        {body && <div className="text-muted">{body}</div>}
      </div>
      {children}
    </div>
  );
}

interface User {
  id: number;
  name: string;
  email: string;
  profile_image_url: string;
}

interface UserPreviewCardProps {
  user: User;
  withLink?: boolean;
  children?: React.ReactNode;
}

export function UserPreviewCard({
  user, withLink = false, children, ...props
}: UserPreviewCardProps) {
  const title = (
    withLink ?
    <Link href={"users/" + user.id}>{user.name}</Link> :
    user.name
  );
  return (
    <PreviewCard {...props} imageUrl={user.profile_image_url}
      title={title} body={user.email}
    >
      {children}
    </PreviewCard>
  );
}

interface DataSource {
  id: number;
  name: string;
  type: string;
}

interface DataSourcePreviewCardProps {
  dataSource: DataSource;
  withLink?: boolean;
  children?: React.ReactNode;
}

export function DataSourcePreviewCard({
  dataSource,
  withLink = false,
  children,
  ...props
}: DataSourcePreviewCardProps) {
  const imageUrl = `static/images/db-logos/${dataSource.type}.png`;
  const title = (
    withLink ?
    <Link href={"data-sources/" + dataSource.id}>{dataSource.name}</Link> :
    dataSource.name
  );
  return (
    <PreviewCard {...props} imageUrl={imageUrl} title={title}>
      {children}
    </PreviewCard>
  );
}
