import {
  each, has, map, constant, values, includes, indexOf, sortBy,
  extend, chain, union, range, size, isString, isObject,
} from "@lodash";
import { axios } from "@/services/axios";
import dashboardGridOptions from "@/config/dashboard-grid-options";
import Widget from "./widget";
import location from "@/services/location";
import { cloneParameter } from "@/services/parameters";
import { policy } from "@/services/policy";

export const urlForDashboard = ({ id, slug }) => `dashboards/${id}-${slug}`;

export function collectDashboardFilters(dashboard, queryResults, urlParams) {
  const filters = {};
  each(queryResults, queryResult => {
    const queryFilters = queryResult && queryResult.getFilters ? queryResult.getFilters() : [];
    each(queryFilters, queryFilter => {
      const hasQueryStringValue = has(urlParams, queryFilter.name);

      if (!(hasQueryStringValue || dashboard.dashboard_filters_enabled)) {
        // If dashboard filters not enabled, or no query string value given,
        // skip filters linking.
        return;
      }

      if (hasQueryStringValue) {
        queryFilter.current = urlParams[queryFilter.name];
      }

      const filter = { ...queryFilter };
      if (!has(filters, queryFilter.name)) {
        filters[filter.name] = filter;
      } else {
        filters[filter.name].values = union(filters[filter.name].values, filter.values);
      }
    });
  });

  return values(filters);
}

function prepareWidgetsForDashboard(widgets) {
  // Default height for auto-height widgets.
  // Compute biggest widget size and choose between it and some magic number.
  // This value should be big enough so auto-height widgets will not overlap other ones.
  const defaultWidgetSizeY =
    Math.max(
      chain(widgets)
        .map(w => w.options.position.sizeY)
        .max()
        .value(),
      20
    ) + 5;

  // Fix layout:
  // 1. sort and group widgets by row
  // 2. update position of widgets in each row - place it right below
  //    biggest widget from previous row
  chain(widgets)
    .sortBy(widget => widget.options.position.row)
    .groupBy(widget => widget.options.position.row)
    .reduce((row, widgetsAtRow) => {
      let height = 1;
      each(widgetsAtRow, widget => {
        height = Math.max(
          height,
          widget.options.position.autoHeight ? defaultWidgetSizeY : widget.options.position.sizeY
        );
        widget.options.position.row = row;
        if (widget.options.position.sizeY < 1) {
          widget.options.position.sizeY = defaultWidgetSizeY;
        }
      });
      return row + height;
    }, 0)
    .value();

  // Sort widgets by updated column and row value
  widgets = sortBy(widgets, widget => widget.options.position.col);
  widgets = sortBy(widgets, widget => widget.options.position.row);

  return widgets;
}

function calculateNewWidgetPosition(existingWidgets, newWidget) {
  const width = extend({ sizeX: dashboardGridOptions.defaultSizeX }, extend({}, newWidget.options).position).sizeX;

  // Find first free row for each column
  const bottomLine = chain(existingWidgets)
    .map(w => {
      const options = extend({}, w.options);
      const position = extend({ row: 0, sizeY: 0 }, options.position);
      return {
        left: position.col,
        top: position.row,
        right: position.col + position.sizeX,
        bottom: position.row + position.sizeY,
        width: position.sizeX,
        height: position.sizeY,
      };
    })
    .reduce((result, item) => {
      const from = Math.max(item.left, 0);
      const to = Math.min(item.right, result.length + 1);
      for (let i = from; i < to; i += 1) {
        result[i] = Math.max(result[i], item.bottom);
      }
      return result;
    }, map(new Array(dashboardGridOptions.columns), constant(0)))
    .value();

  // Go through columns, pick them by count necessary to hold new block,
  // and calculate bottom-most free row per group.
  // Choose group with the top-most free row (comparing to other groups)
  return chain(range(0, dashboardGridOptions.columns - width + 1))
    .map(col => ({
      col,
      row: chain(bottomLine)
        .slice(col, col + width)
        .max()
        .value(),
    }))
    .sortBy("row")
    .first()
    .value();
}

export function Dashboard(dashboard) {
  extend(this, dashboard);
  Object.defineProperty(this, "url", {
    get: function() {
      return urlForDashboard(this);
    },
  });
}

function prepareDashboardWidgets(widgets) {
  return prepareWidgetsForDashboard(map(widgets, widget => new Widget(widget)));
}

function transformSingle(dashboard) {
  dashboard = new Dashboard(dashboard);
  if (dashboard.widgets) {
    dashboard.widgets = prepareDashboardWidgets(dashboard.widgets);
  }
  dashboard.publicAccessEnabled = dashboard.public_url !== undefined;
  return dashboard;
}

function transformResponse(data) {
  if (data.results) {
    data = { ...data, results: map(data.results, transformSingle) };
  } else {
    data = transformSingle(data);
  }
  return data;
}

const saveOrCreateUrl = data => (data.id ? `api/dashboards/${data.id}` : "api/dashboards");
const DashboardService = {
  get: ({ id, slug }) => {
    const params = {};
    if (!id) {
      params.legacy = null;
    }
    return axios.get(`api/dashboards/${id || slug}`, { params }).then(transformResponse);
  },
  getByToken: ({ token }) => axios.get(`api/dashboards/public/${token}`).then(transformResponse),
  save: data => axios.post(saveOrCreateUrl(data), data).then(transformResponse),
  delete: ({ id }) => axios.delete(`api/dashboards/${id}`).then(transformResponse),
  query: params => axios.get("api/dashboards", { params }).then(transformResponse),
  recent: params => axios.get("api/dashboards/recent", { params }).then(transformResponse),
  myDashboards: params => axios.get("api/dashboards/my", { params }).then(transformResponse),
  favorites: params => axios.get("api/dashboards/favorites", { params }).then(transformResponse),
  favorite: ({ id }) => axios.post(`api/dashboards/${id}/favorite`),
  unfavorite: ({ id }) => axios.delete(`api/dashboards/${id}/favorite`),
};

extend(Dashboard, DashboardService);

Dashboard.prepareDashboardWidgets = prepareDashboardWidgets;
Dashboard.prepareWidgetsForDashboard = prepareWidgetsForDashboard;

Dashboard.prototype.canEdit = function canEdit() {
  return policy.canEdit(this);
};

Dashboard.prototype.getParametersDefs = function getParametersDefs() {
  const globalParams = {};
  const queryParams = location.search;
  each(this.widgets, widget => {
    if (widget.getQuery()) {
      const mappings = widget.getParameterMappings();
      widget
        .getQuery()
        .getParametersDefs(false)
        .forEach(param => {
          const mapping = mappings[param.name];
          if (mapping.type === Widget.MappingType.DashboardLevel) {
            // create global param
            if (!globalParams[mapping.mapTo]) {
              globalParams[mapping.mapTo] = cloneParameter(param);
              globalParams[mapping.mapTo].name = mapping.mapTo;
              globalParams[mapping.mapTo].title = mapping.title || param.title;
              globalParams[mapping.mapTo].locals = [];
            }

            // add to locals list
            globalParams[mapping.mapTo].locals.push(param);
          }
        });
    }
  });
  const resultingGlobalParams = values(
    each(globalParams, param => {
      param.setValue(param.value); // apply global param value to all locals
      param.fromUrlParams(queryParams); // try to initialize from url (may do nothing)
    })
  );

  // order dashboard params using paramOrder
  return sortBy(resultingGlobalParams, param =>
    includes(this.options.globalParamOrder, param.name)
      ? indexOf(this.options.globalParamOrder, param.name)
      : size(this.options.globalParamOrder)
  );
};

Dashboard.prototype.addWidget = function addWidget(textOrVisualization, options = {}) {
  const props = {
    dashboard_id: this.id,
    options: {
      ...options,
      isHidden: false,
      position: {},
    },
    text: "",
    visualization_id: null,
    visualization: null,
  };

  if (isString(textOrVisualization)) {
    props.text = textOrVisualization;
  } else if (isObject(textOrVisualization)) {
    props.visualization_id = textOrVisualization.id;
    props.visualization = textOrVisualization;
  } else {
    // TODO: Throw an error?
  }

  const widget = new Widget(props);

  const position = calculateNewWidgetPosition(this.widgets, widget);
  widget.options.position.col = position.col;
  widget.options.position.row = position.row;

  return widget.save().then(() => {
    this.widgets = [...this.widgets, widget];
    return widget;
  });
};

Dashboard.prototype.favorite = function favorite() {
  return Dashboard.favorite(this);
};

Dashboard.prototype.unfavorite = function unfavorite() {
  return Dashboard.unfavorite(this);
};
