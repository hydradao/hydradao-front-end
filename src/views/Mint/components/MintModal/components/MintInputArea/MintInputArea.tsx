import { t, Trans } from "@lingui/macro";
import { Box } from "@material-ui/core";
import { DataRow, Input, PrimaryButton } from "@olympusdao/component-library";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import { BOND_DEPOSITORY_ADDRESSES, OP_BOND_DEPOSITORY_ADDRESSES } from "src/constants/addresses";
import { shorten } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useBalance } from "src/hooks/useBalance";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useWeb3Context } from "src/hooks/web3Context";

export const MintInputArea: React.VFC<{ slippage: string; recipientAddress: string }> = props => {
  const quoteToken = {
    name: "OHM",
    addresses: {
      "1": "0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5",
      "4": "0xd7B98050962ec7cC8D11a83446B3217257C754B7",
    },
    icons: ["OHM"],
    decimals: 9,
    purchaseUrl:
      "https://app.sushi.com/swap?inputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f&outputCurrency=0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5",
  };

  const mintingPrice = new DecimalBigNumber("1");

  const { pathname } = useLocation();
  const isInverseBond: boolean = pathname.includes("inverse");

  const { address } = useWeb3Context();
  const networks = useTestableNetworks();

  const currentIndex = useCurrentIndex().data;
  const balance = useBalance({
    "1": "0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5",
    "4": "0xd7B98050962ec7cC8D11a83446B3217257C754B7",
  })[networks.MAINNET].data;

  const [amount, setAmount] = useState("");
  const parsedAmount = new DecimalBigNumber(amount, quoteToken.decimals);
  const amountInBaseToken = parsedAmount.div(mintingPrice, 4);

  // const purchaseBondMutation = usePurchaseBond(props.bond);
  const handleSubmit = (event: React.FormEvent<StakeFormElement>) => {
    event.preventDefault();
    const amount = event.currentTarget.elements["amount"].value;
    // purchaseBondMutation.mutate({
    //   amount,
    //   isInverseBond,
    //   slippage: props.slippage,
    //   recipientAddress: props.recipientAddress,
    // });
  };

  return (
    <Box display="flex" flexDirection="column">
      <WalletConnectedGuard message="Please connect your wallet to purchase bonds">
        <form onSubmit={handleSubmit}>
          <Box display="flex" justifyContent="center">
            <Box display="flex" flexDirection="column" width={["100%", "70%"]}>
              <Input
                type="string"
                name="amount"
                value={amount}
                endString={t`Max`}
                id="outlined-adornment-amount"
                onChange={event => setAmount(event.currentTarget.value)}
                placeholder={t`Enter an amount of` + ` ${`USDC`}`}
              />

              <TokenAllowanceGuard
                isVertical
                tokenAddressMap={{
                  "1": "0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5",
                  "4": "0xd7B98050962ec7cC8D11a83446B3217257C754B7",
                }}
                spenderAddressMap={isInverseBond ? OP_BOND_DEPOSITORY_ADDRESSES : BOND_DEPOSITORY_ADDRESSES}
                message={
                  <>
                    <Trans>First time minting</Trans> <b>HYDR</b>? <br />{" "}
                    <Trans>Please approve Hydra DAO to use your</Trans> <b>{`USDC`}</b> <Trans>for bonding</Trans>.
                  </>
                }
              >
                <Box mt="8px">
                  <PrimaryButton fullWidth className="" type="submit" disabled={false}>
                    {/* {purchaseBondMutation.isLoading ? "Minting..." : "Mint"} */}
                    {"Mint"}
                  </PrimaryButton>
                </Box>
              </TokenAllowanceGuard>
            </Box>
          </Box>
        </form>
      </WalletConnectedGuard>

      <Box mt="24px">
        <DataRow
          isLoading={!balance}
          title={t`Your Balance`}
          balance={`${balance?.toString({ decimals: 4, format: true, trim: true })} ${`HYDR`}`}
        />

        <DataRow
          title={t`You Will Get`}
          balance={
            <span>
              {amountInBaseToken.toString({ decimals: 4, format: true, trim: true })} {"HYDR"}
            </span>
          }
          tooltip={t`The total amount of payout asset you will recieve from this minting.`}
        />

        <DataRow
          title={t`Max Reward You Can Get`}
          tooltip={t`The maximum quantity of prHYDR token we can give if you are the last 50 minters of this round.`}
          balance={`${balance?.toString({ decimals: 4, format: true, trim: true })} ${`HYDR`}`}
        />

        <DataRow
          title={t`The Reward Is Now Worth`}
          balance={`${balance?.toString({ decimals: 4, format: true, trim: true })} ${`HYDR`}`}
          tooltip={t`Each prHYDR is worth (market price - floor price). The Reward is worth (reward you can get * reward price)`}
        />

        <DataRow
          title={t`Your Reward Profit Is`}
          balance={`${balance?.toString({ decimals: 4, format: true, trim: true })} ${`HYDR`}`}
          tooltip={t`Your reward worth minus what you overpaid is the profit.`}
        />

        {props.recipientAddress !== address && (
          <DataRow title={t`Recipient`} balance={shorten(props.recipientAddress)} />
        )}
      </Box>
    </Box>
  );
};

interface StakeFormElement extends HTMLFormElement {
  elements: HTMLFormControlsCollection & { amount: HTMLInputElement };
}
