import { formatUnits } from "@ethersproject/units";
import { t, Trans } from "@lingui/macro";
import { Box, makeStyles, Table, TableCell, TableHead, TableRow, Typography, Zoom } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Skeleton } from "@material-ui/lab";
import { DataRow, OHMTokenProps, Paper, SecondaryButton, Token, TokenStack } from "@olympusdao/component-library";
import { BigNumber } from "ethers";
import { useState } from "react";
import { WETH_USDT_LP_CONTRACT } from "src/constants/contracts";
import { formatCurrency, formatNumber } from "src/helpers";
import { useWeb3Context } from "src/hooks/web3Context";
import { ExternalPool } from "src/lib/ExternalPool";
import { NetworkId } from "src/networkDetails";

interface Record {
  sender: string;
  in0: string;
  in1: string;
  out0: string;
  out1: string;
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

const data = [
  {
    time: "5/13/2022, 9:44:10 PM",
    inputValue: "17.08 WATER",
    outputValue: "1.39 HYDR",
    avgPrice: "$12.28",
    walletAddress: "DwNW...wwtV",
  },
  {
    time: "5/13/2022, 9:40:30 PM",
    inputValue: "30,000 USDC",
    outputValue: "2,442.61 HYDR",
    avgPrice: "$12.28",
    walletAddress: "7cTW...QLZY",
  },
];

const AllMints = (props: { isSmallScreen: boolean }) => {
  const [records, setRecords] = useState<Array<Record>>([]);

  const reserveContract = WETH_USDT_LP_CONTRACT.getEthersContract(NetworkId.MAINNET);

  reserveContract.on("Swap", (sender: string, in0: number, in1: number, out0: number, out1: number, to: string) => {
    const record: Record = {
      sender: sender,
      in0: in0 + "",
      in1: in1 + "",
      out0: out0 + "",
      out1: out1 + "",
    };
    setRecords(records.concat(record));
  });

  return (
    <>
      {records.map(row => (
        <Row
          time="fake time"
          inputValue={row.in0}
          outputValue={row.out0}
          avgPrice="fakePrice"
          walletAddress={row.sender}
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
