import React, { useMemo, useState, useEffect } from "react";
import moment, { MomentInput } from "moment";

interface TimerProps {
  from?: MomentInput;
}

export default function Timer({ from }: TimerProps): JSX.Element {
  const startTime = useMemo(() => moment(from).valueOf(), [from]);
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    function update() {
      const diff = moment.now() - startTime;
      // Don't show HH under an hour
      const format = diff > 1000 * 60 * 60 ? "HH:mm:ss" : "mm:ss";
      setValue(moment.utc(diff).format(format));
    }
    update();

    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  return <span className="rd-timer">{value}</span>;
}
