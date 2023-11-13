import React from "react";
import PropTypes from "prop-types";
import { Alert } from "antd";

import Link from "@/components/general/Link";
import BigMessage from "@/components/general/BigMessage";
import NoTaggedObjectsFound from "@/components/tags/NoTaggedObjectsFound";
import EmptyState, { EmptyStateHelpMessage } from "@/components/empty-state/EmptyState";
import DynamicComponent from "@/components/general/DynamicComponent";
import { currentUser } from "@/services/auth";
import HelpTrigger from "@/components/help/HelpTrigger";

export default function QueriesListEmptyState({ page, searchTerm, selectedTags }) {
  if (searchTerm !== "") {
    return <BigMessage message="Sorry, we couldn't find anything." icon="fa-search" />;
  }
  if (selectedTags.length > 0) {
    return <NoTaggedObjectsFound objectType="queries" tags={selectedTags} />;
  }
  switch (page) {
    case "favorites":
      return <Alert type="info" message="Mark queries as Favorite to list them here." />;

    case "archive":
      return <Alert type="info" message="Archived queries will be listed here." />;

    case "my":
      const my_msg = currentUser.hasPermission("create_query") ? (
        <span>
          <Link.Button href="queries/new" type="primary" size="small">
            Create your first query!
          </Link.Button>{" "}
          <HelpTrigger className="f-13" type="QUERIES" showTooltip={false}>
            Need help?
          </HelpTrigger>
        </span>
      ) : (
        <span>Sorry, we couldn't find anything.</span>
      );
      return <BigMessage icon="fa-search">{my_msg}</BigMessage>;

    default:
      return (
        <DynamicComponent name="QueriesList.EmptyState">
          <EmptyState
            icon="fa fa-code"
            illustration="query"
            description="Getting the data from your datasources."
            helpMessage={<EmptyStateHelpMessage helpTriggerType="QUERIES" />}
          />
        </DynamicComponent>
      );
  }
}

QueriesListEmptyState.propTypes = {
  page: PropTypes.string.isRequired,
  searchTerm: PropTypes.string.isRequired,
  selectedTags: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};
