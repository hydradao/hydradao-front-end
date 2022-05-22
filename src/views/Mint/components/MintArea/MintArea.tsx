import { t, Trans } from "@lingui/macro";
import { Box, Divider, Grid, Link, Zoom } from "@material-ui/core";
import { Metric, MetricCollection, Paper, PrimaryButton } from "@olympusdao/component-library";
import { useState } from "react";
import { useWeb3Context } from "src/hooks/web3Context";
import { FloorPrice, MarketPrice, MintPrice } from "src/views/TreasuryDashboard/components/Metric/Metric";

import { HydraPriceGraph } from "../../../TreasuryDashboard/components/Graph/Graph";
import MintInputArea from "./components/MintInputArea/MintInputArea";
import RewardTimer from "./components/RewardTimer/RewardTimer";

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

          <MintInputArea />
        </Paper>
      </Zoom>
    </>
  );
};
