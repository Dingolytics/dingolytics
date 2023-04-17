import React, { forwardRef, Ref } from "react";
import { DatePicker } from "antd";
import { clientConfig } from "@/services/auth";
import { Moment } from "moment";

interface DateInputProps {
  defaultValue?: Moment | null;
  value?: Moment | null;
  onSelect?: (value: Moment | null, dateString: string) => void;
  className?: string;
}

interface ClientConfig {
  dateFormat?: string;
}

const DateInput = forwardRef(function DateInput(
  {
    defaultValue = null,
    value,
    onSelect = () => {},
    className = "",
    ...props
  }: DateInputProps,
  ref: Ref<typeof DatePicker>,
) {
  const format = (clientConfig as ClientConfig).dateFormat || "YYYY-MM-DD";
  const additionalAttributes: {
    defaultValue?: Moment;
    value?: Moment | null;
  } = {};
  if (defaultValue && defaultValue.isValid()) {
    additionalAttributes.defaultValue = defaultValue;
  }
  if (value === null || (value && value.isValid())) {
    additionalAttributes.value = value;
  }
  return (
    <DatePicker
      ref={ref}
      className={className}
      {...additionalAttributes}
      format={format}
      placeholder="Select Date"
      onChange={onSelect}
      {...props}
    />
  );
});

DateInput.defaultProps = {
  defaultValue: null,
  value: null,
  onSelect: () => {},
  className: "",
};

export default DateInput;
