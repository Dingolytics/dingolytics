import React from "react";
import PropTypes from "prop-types";
import BigMessage from "@/components/general/BigMessage";
import { TagsControl } from "@/components/tags/TagsControl";

export default function NoTaggedObjectsFound({ objectType, tags }) {
  return (
    <BigMessage icon="fa-tags">
      No {objectType} found tagged with&nbsp;
      <TagsControl className="inline-tags-control" tags={Array.from(tags)} tagSeparator={"+"} />.
    </BigMessage>
  );
}

NoTaggedObjectsFound.propTypes = {
  objectType: PropTypes.string.isRequired,
  tags: PropTypes.oneOfType([PropTypes.array, PropTypes.objectOf(Set)]).isRequired,
};
