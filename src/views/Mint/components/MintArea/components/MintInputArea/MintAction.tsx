import { t, Trans } from "@lingui/macro";
import {
  Box,
  Button,
  ButtonBase,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  SvgIcon,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Icon } from "@olympusdao/component-library";
import { BigNumber, ethers } from "ethers";
import React, { useEffect, useMemo, useState } from "react";
import { ReactComponent as DownIcon } from "src/assets/icons/arrow-down.svg";
import { ReactComponent as FirstStepIcon } from "src/assets/icons/step-1.svg";
import { ReactComponent as SecondStepIcon } from "src/assets/icons/step-2.svg";
import { ReactComponent as CompleteStepIcon } from "src/assets/icons/step-complete.svg";
import { useApproveToken, useApproveTokenSpend } from "src/components/TokenAllowanceGuard/hooks/useApproveToken";
import TokenIcons, { AllTokenName } from "src/components/TokenIcons";
import { HYDRA_MINTING_ADDRESSES } from "src/constants/addresses";
import { trim } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { prettifySeconds } from "src/helpers/timeUtil";
import { useWeb3Context } from "src/hooks";
import { useContractAllowance } from "src/hooks/useContractAllowance";
import { useActivate, useMint } from "src/hooks/useMinting";
import { useHydrMintPrice } from "src/hooks/usePrices";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { TokenWithBalance, useBalance, useBalances } from "src/hooks/useTokenBalances";

import { useNextRewardDate } from "../RewardTimer/hooks/useNextRewardDate";
import SelectTokenModal from "./SelectTokenModal";
import SlippageModal from "./SlippageModal";

const iconStyle = { height: "24px", width: "24px", zIndex: 1 };
const viewBox = "-8 -12 48 48";
const buttonIconStyle = { height: "16px", width: "16px", marginInline: "6px" };

const DECIMAL_PLACES_SHOWN = 2;

const formatBalance = (balance?: DecimalBigNumber) =>
  balance?.toString({ decimals: DECIMAL_PLACES_SHOWN, trim: false, format: true });

const useStyles = makeStyles(theme => ({
  ApprovedButton: {
    backgroundColor: theme.palette.type === "light" ? "#9EC4AB !important" : "#92A799 !important",
  },
  ApprovedText: {
    color: theme.palette.type === "light" ? "#fff" : "#333333",
  },
}));

type QuoteQuantity = string | number | null;

const MintAction: React.FC = () => {
  const classes = useStyles();

  const { networkId } = useWeb3Context();

  // TODO: change to mint function
  const mintMutation = useMint();
  const activateMutation = useActivate();

  const [quoteToken, setQuoteToken] = useState<string | null>(null);
  const handleSelectQuoteToken = (token: string) => {
    setQuoteToken(token);
    handleClose();
  };

  const quoteTokens = useBalances(["DAI", "USDC"]);

  const selectedToken: TokenWithBalance | undefined = useMemo(() => {
    if (!quoteToken || !quoteTokens[quoteToken]) return undefined;

    return quoteTokens[quoteToken];
  }, [quoteTokens, quoteToken]);

  useEffect(() => {
    if (!selectedToken) {
      setQuoteToken(null);
    }
  }, [selectedToken]);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const handleOpen = () => {
    setModalOpen(true);
  };
  const handleClose = () => setModalOpen(false);

  const [slippageModalOpen, setSlippageModalOpen] = useState(false);
  const handleSlippageModalOpen = () => setSlippageModalOpen(true);
  const handleSlippageModalClose = () => setSlippageModalOpen(false);

  const [inputQuantity, setInputQuantity] = useState("");
  const [outputQuantity, setOutputQuantity] = useState("");

  const hydrBalance = useBalance("HYDR");

  const hydrMintPrice = useHydrMintPrice();

  const nextRewardDate = useNextRewardDate();

  const getTimerWillBeIncreasedTo = () => {
    const rndInit = 1; // hours; // round timer starts at this
    const rndInc = 30; // seconds; // every full unit purchased adds this much to the timer
    const rndMax = 24; // hours; // max length a round timer can be
    const amountUnit = 1000000000000000000; // amount / amountUnit_ = how many rndInc_ will be added to the timer

    if (nextRewardDate.data) {
      return prettifySeconds(
        (nextRewardDate.data.getTime() - new Date().getTime()) / 1000 + Number(outputQuantity) * rndInc,
      );
    } else {
      return "Loading...";
    }
  };

  useEffect(() => setQuoteTokenQuantity(inputQuantity), [inputQuantity]);

  const setQuoteTokenQuantity = (q: QuoteQuantity) => {
    if (q == null || q === "") {
      setInputQuantity("");
      setOutputQuantity("");
      return;
    }
    setInputQuantity(q.toString());
    setOutputQuantity(hydrMintPrice.data ? (+q / hydrMintPrice.data).toString() : "");
  };

  const setOutputTokenQuantity = (q: QuoteQuantity) => {
    if (q == null || q === "") {
      setInputQuantity("");
      setOutputQuantity("");
      return;
    }
    setOutputQuantity(q.toString());
    setInputQuantity(hydrMintPrice.data ? (+q * hydrMintPrice.data).toString() : "");
  };

  useEffect(() => setQuoteTokenQuantity(null), [quoteToken]);

  const { data: tokenAllowance } = useContractAllowance(
    selectedToken ? selectedToken.addresses : {},
    HYDRA_MINTING_ADDRESSES,
  );

  /**
   * Indicates whether there is currently a token allowed for the selected token, `quoteToken`
   */
  const hasTokenAllowance = useMemo(() => {
    return tokenAllowance && tokenAllowance.gt(BigNumber.from(Math.floor(Number(inputQuantity)) || "0"));
  }, [tokenAllowance, inputQuantity]);

  // TODO: change it to mint contract address
  const approveMutation = useApproveTokenSpend(selectedToken, HYDRA_MINTING_ADDRESSES);

  const onSeekApproval = async () => {
    approveMutation.mutate();
  };

  const downIcon = <SvgIcon component={DownIcon} viewBox={viewBox} style={iconStyle}></SvgIcon>;

  const [customSlippage, setCustomSlippage] = useState<string>("1.0");

  // Number(outputQuantity) * (1 - +customSlippage / 100)
  const minimumAmount: DecimalBigNumber = useMemo(() => {
    if (!outputQuantity) return new DecimalBigNumber("0");

    return new DecimalBigNumber(outputQuantity).mul(new DecimalBigNumber((1 - +customSlippage / 100).toString(), 9));
  }, [customSlippage, outputQuantity]);

  const minimumAmountString: string = useMemo(() => {
    return minimumAmount.toString({ decimals: 4, trim: true });
  }, [minimumAmount]);

  const onActivate = async () => {
    activateMutation.mutate();
  };

  const onMint = async () => {
    if (selectedToken) {
      mintMutation.mutate({
        minAmountOfHYDR: "0", // TODO: change to min amount
        paymentTokenAddress: (selectedToken.addresses as any)[networkId] as string,
        paymentTokenAmount: inputQuantity,
      });
    }
  };

  let avgMintPrice = 0;
  if (inputQuantity && outputQuantity) {
    avgMintPrice = Number(inputQuantity) / Number(outputQuantity);
  } else {
    avgMintPrice = hydrMintPrice.data || 1;
  }

  return (
    <>
      <Typography>
        <Trans>You Pay</Trans>
      </Typography>
      <FormControl className="zap-input" variant="outlined" color="primary">
        <InputLabel htmlFor="amount-input"></InputLabel>
        {selectedToken ? (
          <OutlinedInput
            id="zap-amount-input"
            inputProps={{ "data-testid": "zap-amount-input" }}
            type="number"
            placeholder="Enter Amount"
            className="zap-input"
            disabled={quoteToken == null}
            value={inputQuantity}
            onChange={e => setQuoteTokenQuantity(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    minWidth: "50px",
                  }}
                >
                  <Box flexDirection="column" display="flex">
                    <Box flexDirection="row" display="flex" alignItems="center" justifyContent="flex-end">
                      <ButtonBase onClick={handleOpen}>
                        <TokenIcons name={selectedToken.name as AllTokenName} />
                        <Box width="10px" />
                        <Typography>{selectedToken && selectedToken.name}</Typography>
                        {downIcon}
                      </ButtonBase>
                    </Box>

                    <Box height="5px" />
                    <Box flexDirection="row" display="flex" alignItems="center">
                      <Typography color="textSecondary">{`Balance ${trim(
                        selectedToken && selectedToken.balance.data ? selectedToken.balance.data.toApproxNumber() : 0,
                        2,
                      )}`}</Typography>
                      <Box width="10px" />
                      <ButtonBase
                        onClick={() =>
                          setQuoteTokenQuantity(
                            selectedToken && selectedToken.balance.data
                              ? selectedToken.balance.data.toApproxNumber()
                              : null,
                          )
                        }
                      >
                        <Typography>
                          <b>Max</b>
                        </Typography>
                      </ButtonBase>
                    </Box>
                  </Box>
                </div>
              </InputAdornment>
            }
          />
        ) : (
          <Box className="zap-input" data-testid="zap-input">
            <Button variant="contained" className="zap-input" onClick={handleOpen} color="primary">
              <Box flexDirection="row" display="flex" alignItems="center" justifyContent="end" flexGrow={1}>
                <Typography>
                  <Trans>Select Token</Trans>
                </Typography>
                {downIcon}
              </Box>
            </Button>
          </Box>
        )}
      </FormControl>
      <Box minHeight="24px" display="flex" justifyContent="center" alignItems="center" width="100%">
        {downIcon}
      </Box>

      <Typography>
        <Trans>You Get</Trans>
      </Typography>
      <FormControl className="zap-input" variant="outlined" color="primary">
        <InputLabel htmlFor="amount-input"></InputLabel>

        <OutlinedInput
          id="zap-amount-output"
          type="number"
          placeholder="Enter Amount"
          className="zap-input"
          inputProps={{ "data-testid": "zap-amount-output" }}
          value={outputQuantity}
          disabled={quoteToken == null}
          onChange={e => setOutputTokenQuantity(e.target.value)}
          labelWidth={0}
          endAdornment={
            <InputAdornment position="end">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  minWidth: "50px",
                }}
              >
                <Box flexDirection="column" display="flex">
                  <Box flexDirection="row" display="flex" alignItems="center" justifyContent="flex-end">
                    <ButtonBase onClick={() => onActivate()}>
                      <TokenIcons name={"HYDR"} />
                      <Box width="10px" />
                      <Typography>{"HYDR"}</Typography>
                    </ButtonBase>
                  </Box>
                  <Box flexDirection="row" display="flex" alignItems="center">
                    <Typography color="textSecondary">{`Balance ${formatBalance(hydrBalance.data)}`}</Typography>
                  </Box>
                </Box>
              </div>
            </InputAdornment>
          }
        />
      </FormControl>

      <Box
        justifyContent="space-between"
        flexDirection="row"
        display="flex"
        width="100%"
        marginY="4px"
        alignItems="center"
      >
        <Typography>
          <Trans>Slippage Tolerance</Trans>
        </Typography>
        <Box display="flex" alignItems="center">
          <Typography>{customSlippage}%</Typography>
          <Box width="8px" />
          <IconButton name="settings" onClick={handleSlippageModalOpen} className="zap-settings-icon">
            <Icon name="settings" className="zap-settings-icon" />
          </IconButton>
        </Box>
      </Box>
      <Box justifyContent="space-between" flexDirection="row" display="flex" width="100%" marginY="8px">
        <Typography>
          <Trans>Avg. Mint Price</Trans>
        </Typography>
        {selectedToken ? (
          <Typography>{avgMintPrice ? `${avgMintPrice} ${selectedToken.name} = 1 HYDR` : `UNKOWN`}</Typography>
        ) : (
          <Typography>{`${avgMintPrice} USD = 1 HYDR`}</Typography>
        )}
      </Box>
      <Box justifyContent="space-between" flexDirection="row" display="flex" marginY="8px" width="100%">
        <Typography>
          <Trans>Minimum You Get</Trans>
        </Typography>
        <Typography>{`${minimumAmountString} HYDR`}</Typography>
      </Box>
      <Box justifyContent="space-between" flexDirection="row" display="flex" width="100%" marginY="8px">
        <Typography>
          <Trans>Max Reward You Can Get</Trans>
        </Typography>
        <Typography>{outputQuantity || 0} PRHYDR</Typography>
      </Box>
      <Box justifyContent="space-between" flexDirection="row" display="flex" width="100%" marginY="8px">
        <Typography>
          <Trans>The Reward Is Now Worth</Trans>
        </Typography>
        <Typography>N/A</Typography>
      </Box>
      <Box justifyContent="space-between" flexDirection="row" display="flex" width="100%" marginY="8px">
        <Typography>
          <Trans>Your Reward Profit Is (minus what you over paid)</Trans>
        </Typography>
        <Typography>N/A</Typography>
      </Box>
      <Box
        justifyContent="space-between"
        flexDirection="row"
        display="flex"
        marginTop="8px"
        marginBottom="36px"
        width="100%"
      >
        <Typography>
          <Trans>Timer Will Be Increased To</Trans>
        </Typography>
        <Typography>{getTimerWillBeIncreasedTo()}</Typography>
      </Box>

      {hasTokenAllowance ? (
        <Button
          fullWidth
          className="zap-stake-button"
          variant="contained"
          color="primary"
          disabled={
            quoteToken == null ||
            mintMutation.isLoading ||
            outputQuantity === "" ||
            // We cannot pass a minimum amount of 0 to the mutation, so catch it here
            minimumAmountString === "0"
          }
          onClick={onMint}
        >
          {mintMutation.isLoading ? (
            <Trans>Pending...</Trans>
          ) : outputQuantity === "" || minimumAmountString === "0" ? (
            <Trans>Enter Amount</Trans>
          ) : (
            <Trans>Mint</Trans>
          )}
        </Button>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              className="zap-stake-button"
              variant="contained"
              color="primary"
              disabled={!selectedToken || selectedToken.balance.isLoading || approveMutation.isLoading}
              onClick={onSeekApproval}
              classes={approveMutation.isSuccess ? { disabled: classes.ApprovedButton } : {}}
            >
              {/* {txnButtonText(pendingTransactions, approveTxnName, "Approve")} */}
              <Box display="flex" flexDirection="row">
                {approveMutation.isSuccess ? (
                  <>
                    <SvgIcon component={CompleteStepIcon} style={buttonIconStyle} viewBox={"0 0 18 18"} />
                    <Typography classes={{ root: classes.ApprovedText }}>
                      <Trans>Approved</Trans>
                    </Typography>
                  </>
                ) : (
                  <>
                    <SvgIcon component={FirstStepIcon} style={buttonIconStyle} viewBox={"0 0 16 16"} />
                    <Typography>
                      {approveMutation.isLoading ? <Trans>Pending...</Trans> : <Trans>Approve</Trans>}
                    </Typography>
                  </>
                )}
              </Box>
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              className="zap-stake-button"
              variant="contained"
              color="primary"
              disabled={!hasTokenAllowance || mintMutation.isLoading || outputQuantity === ""}
              onClick={onMint}
            >
              <Box display="flex" flexDirection="row" alignItems="center">
                <SvgIcon component={SecondStepIcon} style={buttonIconStyle} viewBox={"0 0 16 16"} />
                <Typography>{outputQuantity === "" ? <Trans>Enter Amount</Trans> : <Trans>Mint</Trans>}</Typography>
              </Box>
            </Button>
          </Grid>
        </Grid>
      )}

      {SelectTokenModal(handleClose, modalOpen, handleSelectQuoteToken, {
        regularTokens: quoteTokens || {},
      })}
      {SlippageModal(handleSlippageModalClose, slippageModalOpen, customSlippage, setCustomSlippage)}
    </>
  );
};

export default MintAction;
