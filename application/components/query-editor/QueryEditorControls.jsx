import { isFunction, map, filter, fromPairs, noop } from "@lodash";
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Tooltip from "@/components/general/Tooltip";
import { Flex, Space, Button, Select } from "antd";
import KeyboardShortcuts, { humanReadableShortcut } from "@/services/KeyboardShortcuts";

import AutocompleteToggle from "./AutocompleteToggle";
import AutoLimitCheckbox from "@/components/query-editor/AutoLimitCheckbox";

export function ButtonTooltip({ title, shortcut, ...props }) {
  shortcut = humanReadableShortcut(shortcut, 1); // show only primary shortcut
  title =
    title && shortcut ? (
      <React.Fragment>
        {title} (<i>{shortcut}</i>)
      </React.Fragment>
    ) : (
      title || shortcut
    );
  return <Tooltip placement="top" title={title} {...props} />;
}

ButtonTooltip.propTypes = {
  title: PropTypes.node,
  shortcut: PropTypes.string,
};

ButtonTooltip.defaultProps = {
  title: null,
  shortcut: null,
};

export default function EditorControl({
  addParameterButtonProps,
  formatButtonProps,
  saveButtonProps,
  executeButtonProps,
  autocompleteToggleProps,
  autoLimitCheckboxProps,
  dataSourceSelectorProps,
}) {
  useEffect(() => {
    const buttons = filter(
      [addParameterButtonProps, formatButtonProps, saveButtonProps, executeButtonProps],
      b => b.shortcut && isFunction(b.onClick)
    );
    if (buttons.length > 0) {
      const shortcuts = fromPairs(map(buttons, b => [b.shortcut, b.disabled ? noop : b.onClick]));
      KeyboardShortcuts.bind(shortcuts);
      return () => {
        KeyboardShortcuts.unbind(shortcuts);
      };
    }
  }, [addParameterButtonProps, formatButtonProps, saveButtonProps, executeButtonProps]);

  // className="query-editor-controls"
  return (
    <Flex justify="space-between" className="m-t-10">
      <Flex gap="small">
      {addParameterButtonProps !== false && (
        <ButtonTooltip title={addParameterButtonProps.title}
          shortcut={addParameterButtonProps.shortcut}
        >
          <Button
            type="default"
            disabled={addParameterButtonProps.disabled}
            onClick={addParameterButtonProps.onClick}>
            {"{{"}&nbsp;{"}}"}
          </Button>
        </ButtonTooltip>
      )}
      {formatButtonProps !== false && (
        <ButtonTooltip title={formatButtonProps.title}
          shortcut={formatButtonProps.shortcut}
        >
          <Button
            type="default"
            disabled={formatButtonProps.disabled}
            onClick={formatButtonProps.onClick}>
            &lt; / &gt;
          </Button>
        </ButtonTooltip>
      )}
      {autocompleteToggleProps !== false && (
        <AutocompleteToggle
          available={autocompleteToggleProps.available}
          enabled={autocompleteToggleProps.enabled}
          onToggle={autocompleteToggleProps.onToggle}
        />
      )}
      {autoLimitCheckboxProps !== false && (
        <AutoLimitCheckbox {...autoLimitCheckboxProps} />
      )}
      {/*dataSourceSelectorProps !== false && (
        <Select
          className="w-100 flex-fill datasource-small"
          disabled={dataSourceSelectorProps.disabled}
          value={dataSourceSelectorProps.value}
          onChange={dataSourceSelectorProps.onChange}>
          {map(dataSourceSelectorProps.options, option => (
            <Select.Option key={`option-${option.value}`} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      )*/}
      </Flex>
      <Flex gap="small">
        {saveButtonProps !== false && (
          <ButtonTooltip title={saveButtonProps.title}
            shortcut={saveButtonProps.shortcut}
          >
            <Button
              size="large"
              disabled={saveButtonProps.disabled}
              loading={saveButtonProps.loading}
              onClick={saveButtonProps.onClick}
              data-test="SaveButton">
              {saveButtonProps.text}
            </Button>
          </ButtonTooltip>
        )}
        {executeButtonProps !== false && (
          <ButtonTooltip title={executeButtonProps.title}
            shortcut={executeButtonProps.shortcut}
          >
            <Button
              type="primary"
              size="large"
              disabled={executeButtonProps.disabled}
              onClick={executeButtonProps.onClick}
              data-test="ExecuteButton">
              {executeButtonProps.text}
            </Button>
          </ButtonTooltip>
        )}
      </Flex>
    </Flex>
  );
}

const ButtonPropsPropType = PropTypes.oneOfType([
  PropTypes.bool, // `false` to hide button
  PropTypes.shape({
    title: PropTypes.node,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    onClick: PropTypes.func,
    text: PropTypes.node,
    shortcut: PropTypes.string,
  }),
]);

EditorControl.propTypes = {
  addParameterButtonProps: ButtonPropsPropType,
  formatButtonProps: ButtonPropsPropType,
  saveButtonProps: ButtonPropsPropType,
  executeButtonProps: ButtonPropsPropType,
  autocompleteToggleProps: PropTypes.oneOfType([
    PropTypes.bool, // `false` to hide
    PropTypes.shape({
      available: PropTypes.bool,
      enabled: PropTypes.bool,
      onToggle: PropTypes.func,
    }),
  ]),
  autoLimitCheckboxProps: PropTypes.oneOfType([
    PropTypes.bool, // `false` to hide
    PropTypes.shape(AutoLimitCheckbox.propTypes),
  ]),
  dataSourceSelectorProps: PropTypes.oneOfType([
    PropTypes.bool, // `false` to hide
    PropTypes.shape({
      disabled: PropTypes.bool,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          label: PropTypes.node,
        })
      ),
      onChange: PropTypes.func,
    }),
  ]),
};

EditorControl.defaultProps = {
  addParameterButtonProps: false,
  formatButtonProps: false,
  saveButtonProps: false,
  executeButtonProps: false,
  autocompleteToggleProps: false,
  autoLimitCheckboxProps: false,
  dataSourceSelectorProps: false,
};
