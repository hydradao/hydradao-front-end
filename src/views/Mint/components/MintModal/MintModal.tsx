import { t, Trans } from "@lingui/macro";
import { Box, Button, ButtonBase, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { Icon, InfoTooltip, Modal, TokenStack } from "@olympusdao/component-library";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useClaimReward, useGetReward } from "src/hooks/useMinting";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";
import { useWeb3Context } from "src/hooks/web3Context";

export const MintModalContainer: React.VFC = () => {
  const navigate = useNavigate();
  const { networkId } = useWeb3Context();

  usePathForNetwork({ pathName: "bonds", networkID: networkId, navigate });

  return <MintModal />;
};

const MintModal: React.VFC<Record<string, never>> = () => {
  const navigate = useNavigate();

  const { data: reward } = useGetReward();

  const claimMutation = useClaimReward();

  const onClaim = async () => {
    claimMutation.mutate();
  };

  return (
    <Modal
      open
      minHeight="auto"
      closePosition="left"
      onClose={() => navigate(`/mint`)}
      headerContent={
        <Box display="flex" flexDirection="row">
          <Box display="flex" flexDirection="column" ml={1} justifyContent="center" alignItems="center">
            <Typography variant="h5">{`PRHYDR`}</Typography>
          </Box>
        </Box>
      }
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box display="flex" justifyContent="center" width={["100%", "70%"]} mt="24px">
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h5" color="textSecondary">
              <Trans>Available PRHYDR For Claim</Trans>
            </Typography>

            <Typography variant="h3" style={{ fontWeight: "bold" }}>
              {reward ? reward.toString() : "0"} prHYDR
            </Typography>
          </Box>
        </Box>

        <Box width="100%" mt="24px">
          <Button fullWidth variant="contained" color="primary" disabled={false} onClick={onClaim}>
            <Trans>Claim</Trans>
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
