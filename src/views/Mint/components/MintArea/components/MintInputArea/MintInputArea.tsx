import "./Zap.scss";

import { Trans } from "@lingui/macro";
import { Box, Typography, Zoom } from "@material-ui/core";
import { Paper } from "@olympusdao/component-library";
import React, { useMemo } from "react";
import ConnectButton from "src/components/ConnectButton/ConnectButton";
import { useWeb3Context } from "src/hooks/web3Context";

import ZapStakeAction from "./ZapStakeAction";

const MintInputArea: React.FC = () => {
  const { address } = useWeb3Context();

  return (
    <Box mt="64px">
      {!address ? (
        <div className="stake-wallet-notification">
          <div className="wallet-menu" id="wallet-menu">
            <ConnectButton />
          </div>
          <Typography variant="h6">
            <Trans>Connect your wallet to Mint</Trans>
          </Typography>
        </div>
      ) : (
        <Box className="stake-action-area">
          <ZapStakeAction />
        </Box>
      )}
    </Box>
  );
};

export default MintInputArea;
