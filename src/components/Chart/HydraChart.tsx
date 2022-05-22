import "./chart.scss";

import { t } from "@lingui/macro";
import { Box, CircularProgress, SvgIcon, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { InfoTooltip } from "@olympusdao/component-library";
import { format } from "date-fns";
import { CSSProperties, useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Brush,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CategoricalChartProps } from "recharts/types/chart/generateCategoricalChart";
import { ReactComponent as Fullscreen } from "src/assets/icons/fullscreen.svg";
import { formatCurrency, trim } from "src/helpers";

import CustomTooltip from "./CustomTooltip";
import ExpandedChart from "./ExpandedChart";

const tickCount = 3;
const expandedTickCount = 5;

const renderExpandedChartStroke = (isExpanded: boolean, color: string) => {
  return isExpanded ? <CartesianGrid vertical={false} stroke={color} /> : "";
};

const renderMultiLineChart = (
  data: any[],
  dataKey: string[],
  stroke: string[],
  color: string,
  dataFormat: string,
  bulletpointColors: CSSProperties[],
  itemNames: string[],
  itemType: string,
  isExpanded: boolean,
  expandedGraphStrokeColor: string,
  margin: CategoricalChartProps["margin"],
) => (
  <LineChart data={data} margin={margin}>
    <XAxis
      dataKey="timestamp"
      interval={30}
      axisLine={false}
      tickCount={3}
      tickLine={false}
      tickFormatter={str => format(new Date(str * 1000), "MMM dd")}
      padding={{ right: 20 }}
    />
    <YAxis
      tickCount={isExpanded ? expandedTickCount : tickCount}
      axisLine={false}
      tickLine={false}
      width={25}
      tickFormatter={number => (number !== 0 ? `${trim(parseFloat(number), 2)}` : "")}
      domain={["auto", "auto"]}
      allowDataOverflow={false}
    />
    <Tooltip
      content={<CustomTooltip bulletpointColors={bulletpointColors} itemNames={itemNames} itemType={itemType} />}
    />
    <Legend />
    <Brush dataKey="timestamp" tickFormatter={str => format(new Date(str * 1000), "MMM dd")} />
    <Line dataKey={dataKey[0]} stroke={stroke[0]} dot={false} />;
    <Line dataKey={dataKey[1]} stroke={stroke[1]} dot={false} />;
    <Line dataKey={dataKey[2]} stroke={stroke[2]} dot={false} />;
    {renderExpandedChartStroke(isExpanded, expandedGraphStrokeColor)}
  </LineChart>
);

function HydraChart({
  type,
  data,
  scale,
  dataKey,
  color,
  stopColor,
  stroke,
  headerText,
  dataFormat,
  headerSubText,
  bulletpointColors,
  itemNames,
  itemType,
  isStaked,
  infoTooltipMessage,
  expandedGraphStrokeColor,
  isPOL,
  margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
}: {
  type: string;
  data: any[];
  scale: string;
  dataKey: string[];
  color: string;
  stopColor: string[][];
  stroke: string[];
  headerText: string;
  dataFormat: string;
  headerSubText: string;
  bulletpointColors: CSSProperties[];
  itemNames: string[];
  itemType: string;
  isStaked: boolean;
  infoTooltipMessage: string;
  expandedGraphStrokeColor: string;
  isPOL: boolean;
  margin?: CategoricalChartProps["margin"];
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderChart = (type: string, isExpanded: boolean) => {
    if (type === "multi")
      return renderMultiLineChart(
        data,
        dataKey,
        stroke,
        color,
        dataFormat,
        bulletpointColors,
        itemNames,
        itemType,
        isExpanded,
        expandedGraphStrokeColor,
        margin,
      );
    return <></>;
  };

  useEffect(() => {
    if (data) {
      setLoading(false);
    }
  }, [data]);

  return loading ? (
    <Box style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <CircularProgress />
    </Box>
  ) : (
    <Box style={{ width: "100%", height: "100%" }}>
      <Box width="100%" minHeight={260} minWidth={310} className="ohm-chart">
        {loading || (data && data.length > 0) ? (
          <ResponsiveContainer minHeight={260} width="100%">
            {renderChart(type, false)}
          </ResponsiveContainer>
        ) : (
          <Skeleton variant="rect" width="100%" height={260} />
        )}
      </Box>
    </Box>
  );
}

export default HydraChart;
