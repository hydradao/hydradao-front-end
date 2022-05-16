import { t, Trans } from "@lingui/macro";
import { Box, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { Icon, InfoTooltip, Modal, TokenStack } from "@olympusdao/component-library";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { NetworkId } from "src/constants";
import { DAI_TOKEN } from "src/constants/tokens";
import { formatCurrency } from "src/helpers";
import { Token } from "src/helpers/contracts/Token";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";
import { useOhmPrice } from "src/hooks/usePrices";
import { useTokenPrice } from "src/hooks/useTokenPrice";
import { useWeb3Context } from "src/hooks/web3Context";
import { useLiveBonds } from "src/views/Bond/hooks/useLiveBonds";

import { Bond } from "../../hooks/useBond";
import { MintDuration } from "../MintDuration";
import { BondSettingsModal } from "./components/BondSettingsModal";
import { MintInputArea } from "./components/MintInputArea/MintInputArea";

export const MintModalContainer: React.VFC = () => {
  const navigate = useNavigate();
  const { networkId } = useWeb3Context();

  usePathForNetwork({ pathName: "bonds", networkID: networkId, navigate });

  return <MintModal />;
};

const MintModal: React.VFC<Record<string, never>> = () => {
  const navigate = useNavigate();
  const { address } = useWeb3Context();

  const [slippage, setSlippage] = useState("0.5");
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") isSettingsOpen ? setSettingsOpen(false) : navigate("/mint");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, isSettingsOpen]);

  useEffect(() => {
    if (address) setRecipientAddress(address);
  }, [address]);

  return (
    <Modal
      open
      minHeight="auto"
      closePosition="left"
      onClose={() => navigate(`/mint`)}
      topRight={<Icon name="settings" style={{ cursor: "pointer" }} onClick={() => setSettingsOpen(true)} />}
      headerContent={
        <Box display="flex" flexDirection="row">
          <TokenStack tokens={["OHM"]} />

          <Box display="flex" flexDirection="column" ml={1} justifyContent="center" alignItems="center">
            <Typography variant="h5">{`HYDR`}</Typography>
          </Box>
        </Box>
      }
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        <BondSettingsModal
          slippage={slippage}
          open={isSettingsOpen}
          recipientAddress={recipientAddress}
          handleClose={() => setSettingsOpen(false)}
          onRecipientAddressChange={event => setRecipientAddress(event.currentTarget.value)}
          onSlippageChange={event => setSlippage(event.currentTarget.value)}
        />

        <Typography>{t`Fixed Term`}</Typography>

        <Box mt="4px">
          <Typography>
            <MintDuration duration={86400} />
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" width={["100%", "70%"]} mt="24px">
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h5" color="textSecondary">
              <Trans>Minting Price</Trans>
            </Typography>

            <Typography variant="h3" style={{ fontWeight: "bold" }}>
              {formatCurrency((new DecimalBigNumber("1").toApproxNumber(), 2))}
            </Typography>
          </Box>

          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h5" color="textSecondary">
              <Trans>Market Price</Trans>
            </Typography>

            <Typography variant="h3" style={{ fontWeight: "bold" }}>
              <TokenPrice token={DAI_TOKEN} />
            </Typography>
          </Box>
        </Box>

        <Box width="100%" mt="24px">
          <MintInputArea slippage={slippage} recipientAddress={recipientAddress} />
        </Box>
      </Box>
    </Modal>
  );
};

const TokenPrice: React.VFC<{ token: Token }> = ({ token }) => {
  const { data: priceToken = new DecimalBigNumber("0") } = useTokenPrice({ token, networkId: NetworkId.MAINNET });

  return priceToken ? <>${priceToken.toString({ decimals: 2, format: true, trim: false })}</> : <Skeleton width={60} />;
};
