import { map, filter, includes, fromPairs, extend, each, omit, sortBy } from "@lodash";
import { visualizationsSettings } from "@redash/vis/visualizations/visualizationsSettings";

const DEFAULT_OPTIONS = {
  itemsPerPage: 25,
  paginationSize: "default", // not editable through Editor
};

const filterTypes = ["filter", "multi-filter", "multiFilter"];

function getColumnNameWithoutType(column: any) {
  let typeSplit;
  if (column.indexOf("::") !== -1) {
    typeSplit = "::";
  } else if (column.indexOf("__") !== -1) {
    typeSplit = "__";
  } else {
    return column;
  }

  const parts = column.split(typeSplit);
  if (parts[0] === "" && parts.length === 2) {
    return parts[1];
  }

  if (!includes(filterTypes, parts[1])) {
    return column;
  }

  return parts[0];
}

function getColumnContentAlignment(type: any) {
  return ["integer", "float", "boolean", "date", "datetime"].indexOf(type) >= 0 ? "right" : "left";
}

function getDefaultColumnsOptions(columns: any) {
  const displayAs = {
    integer: "number",
    float: "number",
    boolean: "boolean",
    date: "datetime",
    datetime: "datetime",
  };

  return map(columns, (col, index) => ({
    name: col.name,
    type: col.type,
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    displayAs: displayAs[col.type] || "string",
    visible: true,
    order: 100000 + index,
    title: getColumnNameWithoutType(col.name),
    allowSearch: false,
    alignContent: getColumnContentAlignment(col.type),
    // `string` cell options
    allowHTML: true,
    highlightLinks: false,
  }));
}

function getDefaultFormatOptions(column: any) {
  const dateTimeFormat = {
    date: visualizationsSettings.dateFormat || "DD/MM/YYYY",
    datetime: visualizationsSettings.dateTimeFormat || "DD/MM/YYYY HH:mm",
  };
  const numberFormat = {
    integer: visualizationsSettings.integerFormat || "0,0",
    float: visualizationsSettings.floatFormat || "0,0.00",
  };
  return {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    dateTimeFormat: dateTimeFormat[column.type],
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    numberFormat: numberFormat[column.type],
    booleanValues: visualizationsSettings.booleanValues || ["false", "true"],
    // `image` cell options
    imageUrlTemplate: "{{ @ }}",
    imageTitleTemplate: "{{ @ }}",
    imageWidth: "",
    imageHeight: "",
    // `link` cell options
    linkUrlTemplate: "{{ @ }}",
    linkTextTemplate: "{{ @ }}",
    linkTitleTemplate: "{{ @ }}",
    linkOpenInNewTab: true,
  };
}

function wereColumnsReordered(queryColumns: any, visualizationColumns: any) {
  queryColumns = map(queryColumns, col => col.name);
  visualizationColumns = map(visualizationColumns, col => col.name);

  // Some columns may be removed - so skip them (but keep original order)
  visualizationColumns = filter(visualizationColumns, col => includes(queryColumns, col));
  // Pick query columns that were previously saved with viz (but keep order too)
  queryColumns = filter(queryColumns, col => includes(visualizationColumns, col));

  // Both array now have the same size as they both contains only common columns
  // (in fact, it was an intersection, that kept order of items on both arrays).
  // Now check for equality item-by-item; if common columns are in the same order -
  // they were not reordered in editor
  for (let i = 0; i < queryColumns.length; i += 1) {
    if (visualizationColumns[i] !== queryColumns[i]) {
      return true;
    }
  }
  return false;
}

function getColumnsOptions(columns: any, visualizationColumns: any) {
  const options = getDefaultColumnsOptions(columns);

  if (wereColumnsReordered(columns, visualizationColumns)) {
    visualizationColumns = fromPairs(
      map(visualizationColumns, (col, index) => [col.name, extend({}, col, { order: index })])
    );
  } else {
    visualizationColumns = fromPairs(map(visualizationColumns, col => [col.name, omit(col, "order")]));
  }

  each(options, col => extend(col, visualizationColumns[col.name]));

  return sortBy(options, "order");
}

export default function getOptions(options: any, { columns }: any) {
  options = { ...DEFAULT_OPTIONS, ...options };
  options.columns = map(getColumnsOptions(columns, options.columns), col => ({
    ...getDefaultFormatOptions(col),
    ...col,
  }));
  return options;
}
