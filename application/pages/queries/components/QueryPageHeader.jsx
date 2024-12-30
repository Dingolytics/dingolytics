import { extend, map, filter, reduce } from "@lodash";
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Button, Dropdown, Menu, Space } from "antd";
import EllipsisOutlinedIcon from "@ant-design/icons/EllipsisOutlined";
import useMedia from "use-media";
import Link from "@/components/general/Link";
import EditInPlace from "@/components/general/EditInPlace";
import FavoritesControl from "@/components/general/FavoritesControl";
import { QueryTagsControl } from "@/components/tags/TagsControl";
import getTags from "@/services/getTags";
import { clientConfig } from "@/services/auth";
import useQueryFlags from "../hooks/useQueryFlags";
import useArchiveQuery from "../hooks/useArchiveQuery";
import usePublishQuery from "../hooks/usePublishQuery";
import useUnpublishQuery from "../hooks/useUnpublishQuery";
import useUpdateQueryTags from "../hooks/useUpdateQueryTags";
import useRenameQuery from "../hooks/useRenameQuery";
import useDuplicateQuery from "../hooks/useDuplicateQuery";
import useShareQueryAPIDialog from "../hooks/useShareQueryAPIDialog";
import usePermissionsEditorDialog from "../hooks/usePermissionsEditorDialog";

import "./QueryPageHeader.less";

function getQueryTags() {
  return getTags("api/queries/tags").then(tags => map(tags, t => t.name));
}

function createMenu(menu) {
  const handlers = {};

  const groups = map(menu, group =>
    filter(
      map(group, (props, key) => {
        props = extend({ isAvailable: true, isEnabled: true, onClick: () => {} }, props);
        if (props.isAvailable) {
          handlers[key] = props.onClick;
          return (
            <Menu.Item key={key} disabled={!props.isEnabled}>
              {props.title}
            </Menu.Item>
          );
        }
        return null;
      })
    )
  );

  return (
    <Menu onClick={({ key }) => handlers[key]()}>
      {reduce(
        filter(groups, group => group.length > 0),
        (result, items, key) => {
          const divider = result.length > 0 ? <Menu.Divider key={`divider${key}`} /> : null;
          return [...result, divider, ...items];
        },
        []
      )}
    </Menu>
  );
}

export default function QueryPageHeader({
  query,
  dataSource,
  sourceMode,
  selectedVisualization,
  headerExtra,
  tagsExtra,
  onChange,
}) {
  const isDesktop = useMedia({ minWidth: 768 });
  const queryFlags = useQueryFlags(query, dataSource);
  const updateName = useRenameQuery(query, onChange);
  // const updateTags = useUpdateQueryTags(query, onChange);
  const archiveQuery = useArchiveQuery(query, onChange);
  const publishQuery = usePublishQuery(query, onChange);
  const unpublishQuery = useUnpublishQuery(query, onChange);
  const [isDuplicating, duplicateQuery] = useDuplicateQuery(query);
  const openQueryShareAPIDialog = useShareQueryAPIDialog(query, onChange);
  const openPermissionsEditorDialog = usePermissionsEditorDialog(query);

  const showPublishAction = (
    queryFlags.canEdit &&
    !queryFlags.isNew &&
    !queryFlags.isArchived &&
    !queryFlags.isPublished
  );

  const moreActionsMenu = useMemo(
    () =>
      createMenu([
        {
          publish: {
            isAvailable: !queryFlags.isNew && queryFlags.canEdit && showPublishAction,
            title: "Publish",
            onClick: publishQuery,
          },
          unpublish: {
            isAvailable: !queryFlags.isNew && queryFlags.canEdit && !showPublishAction,
            title: "Unpublish",
            onClick: unpublishQuery,
          },
        },
        {
          archive: {
            isAvailable: !queryFlags.isNew && queryFlags.canEdit && !queryFlags.isArchived,
            title: "Archive",
            onClick: archiveQuery,
          },
          fork: {
            isEnabled: !queryFlags.isNew && queryFlags.canFork && !isDuplicating,
            title: "Fork",
            onClick: duplicateQuery,
          },
        },
        {
          managePermissions: {
            isAvailable:
              !queryFlags.isNew && queryFlags.canEdit && !queryFlags.isArchived && clientConfig.showPermissionsControl,
            title: "Manage Permissions",
            onClick: openPermissionsEditorDialog,
          },
          showAPIKey: {
            isAvailable: !clientConfig.disablePublicUrls && !queryFlags.isNew,
            title: "Show API Key",
            onClick: openQueryShareAPIDialog,
          },
        },
      ]),
    [
      queryFlags.isNew,
      queryFlags.canFork,
      queryFlags.canEdit,
      queryFlags.isArchived,
      queryFlags.isDraft,
      queryFlags.isPublished,
      isDuplicating,
      duplicateQuery,
      archiveQuery,
      openPermissionsEditorDialog,
      isDesktop,
      publishQuery,
      unpublishQuery,
      openQueryShareAPIDialog,
    ]
  );

  return (
    <div className="query-page-header">
      <div className="title-with-tags">
        <div className="page-title">
          <div className="d-flex align-items-center">
            {!queryFlags.isNew && <FavoritesControl item={query} />}
            <h3>
              <EditInPlace isEditable={queryFlags.canEdit} onDone={updateName} ignoreBlanks value={query.name} />
            </h3>
          </div>
        </div>
        <div className="query-tags">
          <QueryTagsControl
            // tags={query.tags}
            isDraft={queryFlags.isDraft}
            isArchived={queryFlags.isArchived}
            isPublished={queryFlags.isPublished}
            // canEdit={queryFlags.canEdit}
            // getAvailableTags={getQueryTags}
            // onEdit={updateTags}
            // tagsExtra={tagsExtra}
          />
        </div>
      </div>
      <Space>
        {headerExtra}

        {!queryFlags.isNew && queryFlags.canViewSource && (
          <span>
            {!sourceMode && (
              <Link.Button href={query.getUrl(true, selectedVisualization)}>
                Edit Source
              </Link.Button>
            )}
            {sourceMode && (
              <Link.Button
                href={query.getUrl(false, selectedVisualization)}
                data-test="QueryPageShowResultOnly">
                Show Results Only
              </Link.Button>
            )}
          </span>
        )}

        {!queryFlags.isNew && (
          <Dropdown overlay={moreActionsMenu} trigger={["click"]}>
            <Button data-test="QueryPageHeaderMoreButton" aria-label="More actions">
              <EllipsisOutlinedIcon rotate={90} aria-hidden="true" />
            </Button>
          </Dropdown>
        )}
      </Space>
    </div>
  );
}

QueryPageHeader.propTypes = {
  query: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    name: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  dataSource: PropTypes.object,
  sourceMode: PropTypes.bool,
  selectedVisualization: PropTypes.number,
  headerExtra: PropTypes.node,
  tagsExtra: PropTypes.node,
  onChange: PropTypes.func,
};

QueryPageHeader.defaultProps = {
  dataSource: null,
  sourceMode: false,
  selectedVisualization: null,
  headerExtra: null,
  tagsExtra: null,
  onChange: () => {},
};
