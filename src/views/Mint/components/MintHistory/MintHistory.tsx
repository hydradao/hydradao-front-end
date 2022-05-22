import { formatUnits } from "@ethersproject/units";
import { t, Trans } from "@lingui/macro";
import { Box, makeStyles, Table, TableCell, TableHead, TableRow, Typography, Zoom } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Skeleton } from "@material-ui/lab";
import { DataRow, OHMTokenProps, Paper, SecondaryButton, Token, TokenStack } from "@olympusdao/component-library";
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import { WETH_USDT_LP_CONTRACT } from "src/constants/contracts";
import { formatCurrency, formatNumber } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { useHydrMintEvents } from "src/hooks/usePrices";
import { useWeb3Context } from "src/hooks/web3Context";
import { ExternalPool } from "src/lib/ExternalPool";
import { NetworkId } from "src/networkDetails";

interface Record {
  time: string;
  inputValue: string;
  outputValue: string;
  avgPrice: string;
  walletAddress: string;
}

const useStyles = makeStyles(theme => ({
  stakePoolsWrapper: {
    display: "grid",
    gridTemplateColumns: `1.0fr 0.5fr 0.5fr 1.5fr auto`,
    gridTemplateRows: "auto",
    alignItems: "center",
  },
  stakePoolHeaderText: {
    color: theme.palette.text.secondary,
    lineHeight: 1.4,
  },
  poolPair: {
    display: "flex !important",
    alignItems: "center",
    justifyContent: "left",
    marginBottom: "15px",
  },
  poolName: {
    marginLeft: "10px",
  },
}));

export const MintHistory = () => {
  const styles = useStyles();
  const { connected } = useWeb3Context();
  const isSmallScreen = useMediaQuery("(max-width: 705px)");

  return (
    <Zoom in={true}>
      {isSmallScreen ? (
        <AllMints isSmallScreen={isSmallScreen} />
      ) : (
        <Paper headerText={t`Mint History`}>
          <Table style={{ tableLayout: "fixed" }}>
            <TableHead className={styles.stakePoolHeaderText}>
              <TableRow>
                <TableCell style={{ width: "180px", padding: "8px 0" }}>
                  <Trans>Time</Trans>
                </TableCell>

                <TableCell style={{ width: connected ? "100px" : "150px", padding: "8px 0" }}>
                  <Trans>Input Value</Trans>
                </TableCell>

                <TableCell style={{ width: connected ? "100px" : "150px", padding: "8px 0" }}>
                  <Trans>Output Value</Trans>
                </TableCell>

                <TableCell style={{ width: connected ? "100px" : "150px", padding: "8px 0" }}>
                  <Trans>Avg. Price</Trans>
                </TableCell>

                <TableCell style={{ width: connected ? "100px" : "150px", padding: "8px 0" }}>
                  <Trans>Wallet Address</Trans>
                </TableCell>
              </TableRow>
            </TableHead>

            <AllMints isSmallScreen={isSmallScreen} />
          </Table>
        </Paper>
      )}
    </Zoom>
  );
};

const fake_data = [
  {
    time: "Loading",
    inputValue: "Loading",
    outputValue: "Loading",
    avgPrice: "Loading",
    walletAddress: "Loading",
  },
];

const AllMints = (props: { isSmallScreen: boolean }) => {
  const { data: events } = useHydrMintEvents();

  // const [records, setRecords] = useState<Array<Record>>([]);
  // const provider = Providers.getStaticProvider(NetworkId.MAINNET);

  if (events) {
    // const reserveContract = WETH_USDT_LP_CONTRACT.getEthersContract(NetworkId.MAINNET);

    let processedEvents: Record[] = [];
    events.forEach(function (event) {
      const blockNumber = event.blockNumber.toString();

      // if (event.args.amount0Out.isZero()) {
      //   return;
      // }

      // const ethString: string = formatUnits(event.args.amount0Out, 18);

      // const usdtString: string = formatUnits(event.args.amount1In, 6);
      // const avgPrice = Number(usdtString) / Number(ethString);
      const wallet = event.args.minter.substring(0, 6) + "..." + event.args.minter.substring(38);

      processedEvents.push({
        time: blockNumber,
        inputValue: new DecimalBigNumber(event.args.paymentTokenAmount, 16).toString() + " DAI",
        outputValue: new DecimalBigNumber(event.args.amountInHYDR, 16).toString() + " HYDR",
        avgPrice: "$" + new DecimalBigNumber(event.args.avePrice, 9).toString(),
        walletAddress: wallet,
      });
    });

    processedEvents = processedEvents.reverse();
    if (processedEvents.length > 30) {
      processedEvents = processedEvents.slice(0, 30);
    }

    // TODO: temporarily disable auto update.
    // reserveContract.on("Swap", (sender: string, in0: number, in1: number, out0: number, out1: number, to: string) => {
    //   const record: Record = {
    //     time: string;
    //     inputValue: string;
    //     outputValue: string;
    //     avgPrice: string;
    //     walletAddress: sender;
    //   };
    //   setRecords(records.concat(record));
    // });

    return (
      <>
        {processedEvents.map(row => (
          <Row
            time={row.time}
            inputValue={row.inputValue}
            outputValue={row.outputValue}
            avgPrice={row.avgPrice}
            walletAddress={row.walletAddress}
          />
        ))}
      </>
    );
  }
  return (
    <>
      {fake_data.map(row => (
        <Row
          time={row.time}
          inputValue={row.inputValue}
          outputValue={row.outputValue}
          avgPrice={row.avgPrice}
          walletAddress={row.walletAddress}
        />
      ))}
    </>
  );
};

const Row: React.FC<{
  time: string;
  inputValue: string;
  outputValue: string;
  avgPrice: string;
  walletAddress: string;
}> = props => {
  return (
    <TableRow>
      <TableCell style={{ padding: "8px 0" }}>
        <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
          {props.time}
        </Typography>
      </TableCell>

      <TableCell style={{ padding: "8px 0" }}>
        <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
          {props.inputValue}
        </Typography>
      </TableCell>

      <TableCell style={{ padding: "8px 0" }}>
        <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
          {props.outputValue}
        </Typography>
      </TableCell>

      <TableCell style={{ padding: "8px 0" }}>
        <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
          {props.avgPrice}
        </Typography>
      </TableCell>

      <TableCell style={{ padding: "8px 0" }}>
        <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
          {props.walletAddress}
        </Typography>
      </TableCell>
    </TableRow>
  );
};
