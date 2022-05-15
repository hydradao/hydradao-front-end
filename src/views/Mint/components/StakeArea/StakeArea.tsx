import { t } from "@lingui/macro";
import { Box, Divider, Grid, Zoom } from "@material-ui/core";
import { MetricCollection, Paper } from "@olympusdao/component-library";
import { useState } from "react";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import {
  CurrentIndex,
  StakingAPY,
  TotalValueDeposited,
  CountDown,
} from "src/views/TreasuryDashboard/components/Metric/Metric";

import RebaseTimer from "./components/RebaseTimer/RebaseTimer";
import { StakeBalances } from "./components/StakeBalances";
import { StakeFiveDayYield } from "./components/StakeFiveDayYield";
import { StakeInputArea } from "./components/StakeInputArea/StakeInputArea";
import { StakeNextRebaseAmount } from "./components/StakeNextRebaseAmount";
import { StakeRebaseYield } from "./components/StakeRebaseYield";

export const StakeArea: React.FC = () => {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <Zoom in onEntered={() => setIsZoomed(true)}>
      <Paper headerText={t`Mint HYDR`} subHeader={<RebaseTimer />}>
        <Box mb="28px">
          <Grid>
            <MetricCollection>
              <CountDown className="stake-tvl" />
            </MetricCollection>
          </Grid>
        </Box>

        <WalletConnectedGuard message="Connect your wallet to stake OHM">
          <StakeInputArea isZoomed={isZoomed} />

          <StakeBalances />

          <Divider color="secondary" />

          <StakeNextRebaseAmount />

          <StakeRebaseYield />

          <StakeFiveDayYield />
        </WalletConnectedGuard>
      </Paper>
    </Zoom>
  );
};
