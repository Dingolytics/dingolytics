import React from "react";
import { RendererPropTypes } from "@redash/vis/visualizations/prop-types";

import PlotlyChart from "./PlotlyChart";
import CustomPlotlyChart from "./CustomPlotlyChart";
import { visualizationsSettings } from "@redash/vis/visualizations/visualizationsSettings";

import "./renderer.less";

export default function Renderer({ options, ...props }: any) {
  if (options.globalSeriesType === "custom" && visualizationsSettings.allowCustomJSVisualizations) {
    return <CustomPlotlyChart options={options} {...props} />;
  }
  return <PlotlyChart options={options} {...props} />;
}

Renderer.propTypes = RendererPropTypes;
