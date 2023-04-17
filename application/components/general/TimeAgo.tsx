import moment from "moment";
import { isNil } from "@lodash";
import React, { useEffect, useMemo, useState } from "react";
import { clientConfig } from "@/services/auth";
import Tooltip from "@/components/general/Tooltip";

function toMoment(value: any): moment.Moment | null {
  value = !isNil(value) ? moment(value) : null;
  return value && value.isValid() ? value : null;
}

interface ClientConfig {
  dateTimeFormat?: string;
}

interface TimeAgoProps {
  date: string | number | Date | moment.Moment | null;
  placeholder?: string;
  autoUpdate?: boolean;
  variation?: "timeAgoInTooltip";
}

export default function TimeAgo({
  date = null,
  placeholder = "",
  autoUpdate = true,
  variation,
}: TimeAgoProps) {
  const startDate = toMoment(date);
  const dateTimeFormat = (clientConfig as ClientConfig).dateTimeFormat;
  const [value, setValue] = useState<string | null>(null);
  const title = useMemo(() => (
    startDate ? startDate.format(dateTimeFormat) : null
  ), [startDate]);

  useEffect(() => {
    function update() {
      setValue(startDate ? startDate.fromNow() : placeholder || null);
    }
    update();

    if (autoUpdate) {
      const timer = setInterval(update, 30 * 1000);
      return () => clearInterval(timer);
    }
  }, [autoUpdate, startDate, placeholder]);

  if (variation === "timeAgoInTooltip") {
    return (
      <Tooltip title={value || ""}>
        <span data-test="TimeAgo">{title || ""}</span>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={title || ""}>
      <span data-test="TimeAgo">{value || ""}</span>
    </Tooltip>
  );
}
