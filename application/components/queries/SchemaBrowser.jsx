import { isNil, map, filter, some, includes, get } from "@lodash";
import { useState, useCallback, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { useDebouncedCallback } from "use-debounce";
import { Input, Button, Tooltip, Flex, Typography } from "antd";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import List from "react-virtualized/dist/commonjs/List";

import PlainButton from "@/components/general/PlainButton";
// import Tooltip from "@/components/general/Tooltip";
import { RefreshIcon } from "@/components/icons";
import useDataSourceSchema from "@/pages/queries/hooks/useDataSourceSchema";
import useImmutableCallback from "@/lib/hooks/useImmutableCallback";
import LoadingState from "../items-list/components/LoadingState";

const { Text } = Typography;

const SchemaItemColumnType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
});

export const SchemaItemType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
  loading: PropTypes.bool,
  columns: PropTypes.arrayOf(SchemaItemColumnType).isRequired,
});

const schemaTableHeight = 24;
const schemaColumnHeight = 18;

function SchemaItem({ item, expanded, onToggle, onSelect, ...props }) {
  const handleSelect = useCallback(
    (event, ...args) => {
      event.preventDefault();
      event.stopPropagation();
      onSelect(...args);
    },
    [onSelect]
  );

  if (!item) {
    return null;
  }

  const tableDisplayName = item.displayName || item.name;

  return (
    <Flex vertical key={item.name} {...props}>
      <PlainButton onClick={onToggle}>
        <Text ellipsis={true} strong={true}>
          <Tooltip
            title="Insert table name"
            mouseEnterDelay={0}
            mouseLeaveDelay={0}
            placement="top"
            arrow={{ pointAtCenter: true }}>
            <Text
              type="secondary"
              onClick={e => handleSelect(e, item.name)}
            >[&raquo;] </Text>
          </Tooltip>
          <span title={item.name}>{tableDisplayName}</span>
          {!isNil(item.size) && <span> ({item.size})</span>}
        </Text>
      </PlainButton>
      {expanded && (
        <div className="table-open">
          {item.loading ? (
            <div className="table-open">Loading...</div>
          ) : (
            map(item.columns, column => {
              const columnName = get(column, "name");
              const columnType = get(column, "type");
              return columnName ? (
                <div key={`${item.name}-${columnName}`}>
                  &nbsp;&nbsp;.{columnName}
                  {columnType && <span className="column-type">{columnType}</span>}
                </div>
              ) : null;
              /*
              return (
                <Tooltip
                  title="Insert column name into query text"
                  mouseEnterDelay={0}
                  mouseLeaveDelay={0}
                  placement="rightTop">
                  <div>
                    <PlainButton key={columnName}
                      className="table-open-item"
                      onClick={e => handleSelect(e, columnName)}
                    >
                      {columnName}
                      {columnType && <span className="column-type">{columnType}</span>}
                    </PlainButton>
                  </div>
                </Tooltip>
              );
              */
            })
          )}
        </div>
      )}
    </Flex>
  );
}

SchemaItem.propTypes = {
  item: SchemaItemType,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
  onSelect: PropTypes.func,
};

SchemaItem.defaultProps = {
  item: null,
  expanded: false,
  onToggle: () => {},
  onSelect: () => {},
};

function SchemaLoadingState() {
  return (
    <div className="schema-loading-state">
      <LoadingState className="" />
    </div>
  );
}

export function SchemaList({ loading, schema, expandedFlags, onTableExpand, onItemSelect }) {
  const [listRef, setListRef] = useState(null);

  useEffect(() => {
    if (listRef) {
      listRef.recomputeRowHeights();
    }
  }, [listRef, schema, expandedFlags]);

  return (
    <div className="schema-browser">
      {loading && <SchemaLoadingState />}
      {!loading && (
        <AutoSizer>
          {({ width, height }) => (
            <List
              ref={setListRef}
              width={width}
              height={height}
              rowCount={schema.length}
              rowHeight={({ index }) => {
                const item = schema[index];
                const columnsLength = !item.loading ? item.columns.length : 1;
                let columnCount = expandedFlags[item.name] ? columnsLength : 0;
                return schemaTableHeight + schemaColumnHeight * columnCount;
              }}
              rowRenderer={({ key, index, style }) => {
                const item = schema[index];
                return (
                  <SchemaItem
                    key={key}
                    // style={style}
                    item={item}
                    expanded={expandedFlags[item.name]}
                    onToggle={() => onTableExpand(item.name)}
                    onSelect={onItemSelect}
                  />
                );
              }}
            />
          )}
        </AutoSizer>
      )}
    </div>
  );
}

export function applyFilterOnSchema(schema, filterString) {
  const filters = filter(filterString.toLowerCase().split(/\s+/), s => s.length > 0);

  // Empty string: return original schema
  if (filters.length === 0) {
    return schema;
  }

  // Single word: matches table or column
  if (filters.length === 1) {
    const nameFilter = filters[0];
    const columnFilter = filters[0];
    return filter(
      schema,
      item =>
        includes(item.name.toLowerCase(), nameFilter) ||
        some(item.columns, column => includes(get(column, "name").toLowerCase(), columnFilter))
    );
  }

  // Two (or more) words: first matches table, seconds matches column
  const nameFilter = filters[0];
  const columnFilter = filters[1];
  return filter(
    map(schema, item => {
      if (includes(item.name.toLowerCase(), nameFilter)) {
        item = {
          ...item,
          columns: filter(item.columns, column => includes(get(column, "name").toLowerCase(), columnFilter)),
        };
        return item.columns.length > 0 ? item : null;
      }
    })
  );
}

export default function SchemaBrowser({
  dataSource,
  onSchemaUpdate,
  onItemSelect,
  options,
  onOptionsUpdate,
  ...props
}) {
  const [schema, isLoading, refreshSchema] = useDataSourceSchema(dataSource);
  const [filterString, setFilterString] = useState("");
  const [expandedFlags, setExpandedFlags] = useState({});
  const filteredSchema = useMemo(
    () => applyFilterOnSchema(schema, filterString), [schema, filterString]
  );
  const handleSchemaUpdate = useImmutableCallback(onSchemaUpdate);
  const handleFilterChange = useDebouncedCallback(setFilterString, 500);

  useEffect(() => {
    setExpandedFlags({});
    handleSchemaUpdate(schema);
  }, [schema, handleSchemaUpdate]);

  if (schema.length === 0 && !isLoading) {
    return null;
  }

  function toggleTable(tableName) {
    setExpandedFlags({
      ...expandedFlags,
      [tableName]: !expandedFlags[tableName],
    });
  }

  return (
    <div className="schema-container" {...props}>
      <div className="schema-control">
        <Input
          className="m-r-5"
          placeholder="Search schema..."
          aria-label="Search schema"
          disabled={schema.length === 0}
          onChange={event => handleFilterChange(event.target.value)}
        />

        <Tooltip title="Refresh schema">
          <Button onClick={() => refreshSchema(true)} disabled={isLoading}>
            <Text type="secondary">
              {
                isLoading ? "Reloading..." : <RefreshIcon size={18} />
              }
            </Text>
            {/* <i className={cx("zmdi zmdi-refresh", { "zmdi-hc-spin": isLoading })} aria-hidden="true" />
            <span className="sr-only">{isLoading ? "Loading, please wait." : "Press to refresh."}</span> */}
          </Button>
        </Tooltip>
      </div>
      <SchemaList
        loading={isLoading && schema.length === 0}
        schema={filteredSchema}
        expandedFlags={expandedFlags}
        onTableExpand={toggleTable}
        onItemSelect={onItemSelect}
      />
    </div>
  );
}

SchemaBrowser.propTypes = {
  dataSource: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  onSchemaUpdate: PropTypes.func,
  onItemSelect: PropTypes.func,
};

SchemaBrowser.defaultProps = {
  dataSource: null,
  onSchemaUpdate: () => {},
  onItemSelect: () => {},
};
