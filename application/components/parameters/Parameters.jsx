import { size, filter, forEach, extend } from "@lodash";
import React from "react";
import PropTypes from "prop-types";
import { Flex, Space, Divider } from "antd";
import { SortableContainer, SortableElement, DragHandle } from "@redash/vis/components/sortable";
import location from "@/services/location";
import { Parameter, createParameter } from "@/services/parameters";
import ParameterApplyButton from "@/components/parameters/ParameterApplyButton";
import ParameterValueInput from "@/components/parameters/ParameterValueInput";
import PlainButton from "@/components/general/PlainButton";
import EditParameterSettingsDialog from "./EditParameterSettingsDialog";
import { toHuman } from "@/lib/utils";

function updateUrl(parameters) {
  const params = extend({}, location.search);
  parameters.forEach(param => {
    extend(params, param.toUrlParams());
  });
  location.setSearch(params, true);
}

export default class Parameters extends React.Component {
  static propTypes = {
    parameters: PropTypes.arrayOf(PropTypes.instanceOf(Parameter)),
    editable: PropTypes.bool,
    sortable: PropTypes.bool,
    disableUrlUpdate: PropTypes.bool,
    onValuesChange: PropTypes.func,
    onPendingValuesChange: PropTypes.func,
    onParametersEdit: PropTypes.func,
    appendSortableToParent: PropTypes.bool,
  };

  static defaultProps = {
    parameters: [],
    editable: false,
    sortable: false,
    disableUrlUpdate: false,
    onValuesChange: () => {},
    onPendingValuesChange: () => {},
    onParametersEdit: () => {},
    appendSortableToParent: true,
  };

  constructor(props) {
    super(props);
    const { parameters } = props;
    this.state = { parameters };
    if (!props.disableUrlUpdate) {
      updateUrl(parameters);
    }
  }

  componentDidUpdate = prevProps => {
    const { parameters, disableUrlUpdate } = this.props;
    const parametersChanged = prevProps.parameters !== parameters;
    const disableUrlUpdateChanged = prevProps.disableUrlUpdate !== disableUrlUpdate;
    if (parametersChanged) {
      this.setState({ parameters });
    }
    if ((parametersChanged || disableUrlUpdateChanged) && !disableUrlUpdate) {
      updateUrl(parameters);
    }
  };

  handleKeyDown = e => {
    // Cmd/Ctrl/Alt + Enter
    if (e.keyCode === 13 && (e.ctrlKey || e.metaKey || e.altKey)) {
      e.stopPropagation();
      this.applyChanges();
    }
  };

  setPendingValue = (param, value, isDirty) => {
    const { onPendingValuesChange } = this.props;
    this.setState(({ parameters }) => {
      if (isDirty) {
        param.setPendingValue(value);
      } else {
        param.clearPendingValue();
      }
      onPendingValuesChange();
      return { parameters };
    });
  };

  moveParameter = ({ oldIndex, newIndex }) => {
    const { onParametersEdit } = this.props;
    if (oldIndex !== newIndex) {
      this.setState(({ parameters }) => {
        parameters.splice(newIndex, 0, parameters.splice(oldIndex, 1)[0]);
        onParametersEdit(parameters);
        return { parameters };
      });
    }
  };

  applyChanges = () => {
    const { onValuesChange, disableUrlUpdate } = this.props;
    this.setState(({ parameters }) => {
      const parametersWithPendingValues = parameters.filter(p => p.hasPendingValue);
      forEach(parameters, p => p.applyPendingValue());
      if (!disableUrlUpdate) {
        updateUrl(parameters);
      }
      onValuesChange(parametersWithPendingValues);
      return { parameters };
    });
  };

  showParameterSettings = (parameter, index) => {
    const { onParametersEdit } = this.props;
    EditParameterSettingsDialog.showModal({ parameter }).onClose(updated => {
      this.setState(({ parameters }) => {
        const updatedParameter = extend(parameter, updated);
        parameters[index] = createParameter(updatedParameter, updatedParameter.parentQueryId);
        onParametersEdit(parameters);
        return { parameters };
      });
    });
  };

  renderParameter(param, index) {
    return (
      <Flex key={param.name} align="center"
         data-test={`ParameterName-${param.name}`}
      >
        <label>{param.title || toHuman(param.name)}&nbsp;=&nbsp;</label>
        <ParameterValueInput
          type={param.type}
          value={param.normalizedValue}
          parameter={param}
          enumOptions={param.enumOptions}
          queryId={param.queryId}
          onSelect={
            (value, isDirty) => this.setPendingValue(param, value, isDirty)
          }
        />
      </Flex>
    );
  }

  render() {
    const { parameters } = this.state;
    const { sortable, appendSortableToParent } = this.props;
    const dirtyParamCount = size(filter(parameters, "hasPendingValue"));

    return (
      <Flex vertical gap="small" className="m-b-10">
        {
          parameters.map(
            (param, index) => this.renderParameter(param, index)
          )
        }
        <ParameterApplyButton
          onClick={this.applyChanges}
          paramCount={dirtyParamCount}
        />
      </Flex>
    );
  }
}
