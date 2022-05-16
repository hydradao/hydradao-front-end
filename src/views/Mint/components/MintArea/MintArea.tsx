import { t } from "@lingui/macro";
import { Trans } from "@lingui/macro";
import { Box, Divider, Grid, Zoom } from "@material-ui/core";
import { Metric, MetricCollection, Paper } from "@olympusdao/component-library";
import { PrimaryButton } from "@olympusdao/component-library";
import { useState } from "react";
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
import RebaseTimer from "./components/RebaseTimer/RebaseTimer";
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
        <Paper headerText={t`Mint HYDR`} subHeader={<RebaseTimer />}>
          <Box mb="28px">
            <Grid>
              <MetricCollection>
                <CountDown className="stake-tvl" />
              </MetricCollection>
            </Grid>
          </Box>
        </Paper>
      </Zoom>
      <Zoom in={true}>
        <Paper>
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
        </Paper>
      </Zoom>
      <Zoom in={true}>
        <Paper>
          <Box justifyContent="center" alignItems="center" display="flex">
            <WalletConnectedGuard message="Connect your wallet to mint Hydra">
              <PrimaryButton size="large" style={{ fontSize: "1.2857rem" }} onClick={connect}>
                <Trans>Buy Hydra</Trans>
              </PrimaryButton>
            </WalletConnectedGuard>
          </Box>
        </Paper>
      </Zoom>
    </>
  );
};
