import { SvgIcon } from "@material-ui/core";
import { SvgIconProps } from "@material-ui/core";
import { Token } from "@olympusdao/component-library";

import { ReactComponent as HYDR } from "../assets/icons/hydr.svg";

type TokenName =
  | "33T"
  | "AVAX"
  | "CVX"
  | "DAI"
  | "FANTOM"
  | "FANTOM_TESTNET"
  | "FRAX"
  | "LUSD"
  | "MATIC"
  | "OHM"
  | "sOHM"
  | "wsOHM"
  | "ETH"
  | "wETH"
  | "zap"
  | "more"
  | "ALCX"
  | "ANGLE"
  | "BANK"
  | "BANKLESS"
  | "BOO"
  | "FIXEDFOREX"
  | "FLOAT"
  | "FTM"
  | "GEL"
  | "GRODEFI"
  | "ICHI"
  | "IQ"
  | "LQDR"
  | "MTA"
  | "placeholder"
  | "PNG"
  | "PREMIA"
  | "QUARTZ"
  | "ROOK"
  | "USF"
  | "WHEAT"
  | "FXS"
  | "BOND"
  | "POOL"
  | "INV"
  | "PENDLE"
  | "SCREAM"
  | "xSDT"
  | "SPIRIT"
  | "SYN"
  | "XRUNE"
  | "FOX"
  | "UST"
  | "wBTC"
  | "USDC"
  | "RARI"
  | "gOHM"
  | "ARBITRUM"
  | "ARBITRUM_TESTNET"
  | "OPTIMISM"
  | "OPTIMISM_TESTNET"
  | "MAINNET"
  | "TESTNET_RINKEBY"
  | "POLYGON"
  | "POLYGON_TESTNET"
  | "AVALANCHE"
  | "AVALANCHE_TESTNET"
  | "MARKET"
  | "VST"
  | "TOKEMAK"
  | "TERRA"
  | "DOPEX"
  | "JONES"
  | "jgOHM"
  | "IMPERMAX"
  | "BOBA"
  | "BOBA_TESTNET";

export type AllTokenName = "HYDR" | TokenName;

export interface HYDRTokenProps extends SvgIconProps {
  name: AllTokenName;
  viewBox?: string;
  fontSize?: SvgIconProps["fontSize"];
}

const TokenIcons = (props: HYDRTokenProps) => {
  if (props.name === "HYDR") {
    return <SvgIcon viewBox="0 0 32 32" fontSize="large" component={HYDR} />;
  } else {
    return <Token name={props.name} style={props.style} />;
  }
};

export default TokenIcons;
