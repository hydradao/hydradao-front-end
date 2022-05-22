import { Trans } from "@lingui/macro";
import { Box, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { Metric } from "@olympusdao/component-library";
import React from "react";
import Countdown, { CountdownRenderProps } from "react-countdown";

import { prettifySeconds } from "../../../../../../helpers/timeUtil";
import { useNextRewardDate } from "./hooks/useNextRewardDate";

type MetricProps = PropsOf<typeof Metric>;

type AbstractedMetricProps = Omit<MetricProps, "metric" | "label" | "tooltip" | "isLoading">;

const RewardTimer: React.FC<AbstractedMetricProps> = props => {
  const query = useNextRewardDate();
  const nextRebaseDate = query.data;

  const _props = {
    ...props,
    label: `Count Down`,
    metric: nextRebaseDate ? prettifySeconds((nextRebaseDate.getTime() - new Date().getTime()) / 1000) : "",
  };

  const renderer = ({ hours, minutes, seconds, completed }: CountdownRenderProps) => {
    if (completed) {
      // Render a completed state
      _props.metric = `Distributing Rewards...`;
      return <Metric {..._props} />;
    } else {
      // Render a countdown
      _props.metric = `${hours}:${minutes}:${seconds}`;
      return <Metric {..._props} />;
    }
  };

  return (
    <Box>
      <Typography variant="body2">
        {nextRebaseDate ? <Countdown date={nextRebaseDate} renderer={renderer} /> : <Skeleton width="155px" />}
      </Typography>
    </Box>
  );
};

export default RewardTimer;
