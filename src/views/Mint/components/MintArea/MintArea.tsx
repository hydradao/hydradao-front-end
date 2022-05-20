import { t, Trans } from "@lingui/macro";
import { Box, Divider, Grid, Link, Zoom } from "@material-ui/core";
import { Metric, MetricCollection, Paper, PrimaryButton } from "@olympusdao/component-library";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import { useWeb3Context } from "src/hooks/web3Context";
import { CountDown, FloorPrice, MarketPrice, MintPrice } from "src/views/TreasuryDashboard/components/Metric/Metric";

import {
  HydraPriceGraph,
  MarketValueGraph,
  OHMStakedGraph,
  ProtocolOwnedLiquidityGraph,
  RiskFreeValueGraph,
  RunwayAvailableGraph,
  TotalValueDepositedGraph,
} from "../../../TreasuryDashboard/components/Graph/Graph";
import {
  BackingPerOHM,
  CircSupply,
  CurrentIndex,
  GOHMPrice,
  MarketCap,
  OHMPrice,
} from "../../../TreasuryDashboard/components/Metric/Metric";
import MintInputArea from "./components/MintInputArea/MintInputArea";
import RewardTimer from "./components/RewardTimer/RewardTimer";
import { StakeBalances } from "./components/StakeBalances";
import { StakeFiveDayYield } from "./components/StakeFiveDayYield";
import { StakeNextRebaseAmount } from "./components/StakeNextRebaseAmount";
import { StakeRebaseYield } from "./components/StakeRebaseYield";

const sharedMetricProps: PropsOf<typeof Metric> = { labelVariant: "h6", metricVariant: "h5" };

export const MintArea: React.FC = () => {
  const [isZoomed, setIsZoomed] = useState(false);
  const { connect } = useWeb3Context();
  return (
    <>
      <Zoom in onEntered={() => setIsZoomed(true)}>
        <Paper headerText={t`Mint HYDR`}>
          <Box mb="28px">
            <Grid>
              <MetricCollection>
                <RewardTimer className="stake-tvl" />
              </MetricCollection>
            </Grid>
          </Box>

          {/* Move the following into a seperate component */}
          <Box className="hero-metrics">
            <Paper className="ohm-card">
              <MetricCollection>
                <MintPrice {...sharedMetricProps} />
                <MarketPrice {...sharedMetricProps} />
                <FloorPrice {...sharedMetricProps} />
              </MetricCollection>
            </Paper>
          </Box>
          <HydraPriceGraph />

          {/* I'll move the following into a seperate component too */}
          <MintInputArea />
        </Paper>
      </Zoom>
    </>
  );
};
