import { t, Trans } from "@lingui/macro";
import { Box, Divider, Grid, Link, makeStyles, Paper, SvgIcon, Typography } from "@material-ui/core";
import AddBoxIcon from "@material-ui/icons/AddBox";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CallMergeIcon from "@material-ui/icons/CallMerge";
import LocalDrinkIcon from "@material-ui/icons/LocalDrink";
import MultilineChartIcon from "@material-ui/icons/MultilineChart";
import ViewStreamIcon from "@material-ui/icons/ViewStream";
import { Icon, NavItem } from "@olympusdao/component-library";
import React from "react";
import { NavLink } from "react-router-dom";
import { trim } from "src/helpers";
import { sortByDiscount } from "src/helpers/bonds/sortByDiscount";
import { Environment } from "src/helpers/environment/Environment/Environment";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { TokenWithBalance, useBalance, useBalances } from "src/hooks/useTokenBalances";
import { useWeb3Context } from "src/hooks/web3Context";
import { BondDiscount } from "src/views/Bond/components/BondDiscount";
import { useLiveBonds } from "src/views/Bond/hooks/useLiveBonds";

import { ReactComponent as HydraIcon } from "../../assets/icons/hydr.svg";
import WalletAddressEns from "../TopBar/Wallet/WalletAddressEns";
const useStyles = makeStyles(theme => ({
  gray: {
    color: theme.colors.gray[90],
  },
}));

const NavContent: React.VFC = () => {
  const classes = useStyles();
  const { networkId } = useWeb3Context();
  const networks = useTestableNetworks();

  const hydrBalance = useBalance("HYDR");
  const prhydrBalance = useBalance("PRHYDR");

  return (
    <Paper className="dapp-sidebar">
      <Box className="dapp-sidebar-inner" display="flex" justifyContent="space-between" flexDirection="column">
        <div className="dapp-menu-top">
          <Box className="branding-header">
            <Link href="https://hydradao.finance" target="_blank">
              <SvgIcon
                color="primary"
                viewBox="0 0 32 32"
                component={HydraIcon}
                style={{ minWidth: "200px", minHeight: "200px", width: "200px" }}
              />
            </Link>

            <WalletAddressEns />
          </Box>

          <div className="dapp-menu-links">
            <div className="dapp-nav" id="navbarNav">
              <Box style={{ marginLeft: "15px", paddingLeft: "10px", display: "flex" }}>
                <MultilineChartIcon style={{ marginTop: "12px" }} />
                <NavItem style={{ display: "inline-block", paddingLeft: "5px" }} to="/dashboard" label={t`Dashboard`} />
              </Box>

              <Box style={{ marginLeft: "15px", paddingLeft: "10px", display: "flex" }}>
                <AddBoxIcon style={{ marginTop: "12px" }} />
                <NavItem style={{ display: "inline-block", paddingLeft: "5px" }} to="/mint" label="Mint HYDR" />
              </Box>

              <Box style={{ marginLeft: "15px", paddingLeft: "10px", display: "flex" }}>
                <ViewStreamIcon style={{ marginTop: "12px" }} />
                <NavItem style={{ display: "inline-block", paddingLeft: "5px" }} to="/stake" label="Stake HYDR" />
              </Box>

              <Box style={{ marginLeft: "15px", paddingLeft: "10px", display: "flex" }}>
                <CallMergeIcon style={{ marginTop: "12px" }} />
                <NavItem
                  style={{ display: "inline-block", paddingLeft: "5px" }}
                  to="/give"
                  label="Claim/Realize prHYDR"
                />
              </Box>

              <Box style={{ marginLeft: "15px", paddingLeft: "10px", display: "flex" }}>
                <LocalDrinkIcon style={{ marginTop: "12px" }} />
                <NavItem style={{ display: "inline-block", paddingLeft: "5px" }} to="/wrap" label="Get/Repay WATER" />
              </Box>

              <Box style={{ marginLeft: "15px", paddingLeft: "10px", display: "flex" }}>
                <ArrowBackIcon style={{ marginTop: "12px" }} />
                <NavItem style={{ display: "inline-block", paddingLeft: "5px" }} to="/buyback" label="HYDR buyback" />
              </Box>

              <Box className="menu-divider">
                <Divider />
              </Box>
              <Box ml={3} mr={2} mt={1}>
                <Grid container spacing={2}>
                  {/* <Grid item xs={6}>
                    <Typography>My Portfolio</Typography>
                  </Grid>
                  <Grid container item xs={6} justifyContent="flex-end">
                    <Typography>$130.22</Typography>
                  </Grid> */}
                  <Grid item xs={6}>
                    <Typography>HYDR</Typography>
                  </Grid>
                  <Grid container item xs={6} justifyContent="flex-end">
                    <Typography>{hydrBalance.data ? trim(hydrBalance.data.toApproxNumber(), 2) : 0} HYDR</Typography>
                  </Grid>
                  {/* <Grid item xs={6}>
                    <Typography>Staked HYDR</Typography>
                  </Grid>
                  <Grid container item xs={6} justifyContent="flex-end">
                    <Typography>$88.22</Typography>
                  </Grid> */}
                  <Grid item xs={6}>
                    <Typography>prHYDR</Typography>
                  </Grid>
                  <Grid container item xs={6} justifyContent="flex-end">
                    <Typography>
                      {prhydrBalance.data ? trim(prhydrBalance.data.toApproxNumber(), 2) : 0} prHYDR
                    </Typography>
                  </Grid>
                  {/* <Grid item xs={6}>
                    <Typography>Claimable prHYDR</Typography>
                  </Grid>
                  <Grid container item xs={6} justifyContent="flex-end">
                    <Typography>$88.22</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>WATER balance</Typography>
                  </Grid>
                  <Grid container item xs={6} justifyContent="flex-end">
                    <Typography>$88.22</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>borrowed WATER</Typography>
                  </Grid>
                  <Grid container item xs={6} justifyContent="flex-end">
                    <Typography>$88.22</Typography>
                  </Grid> */}
                </Grid>
              </Box>
            </div>
          </div>
        </div>

        <Box display="flex" justifyContent="space-between" paddingX="50px" paddingY="24px">
          <Link href="https://github.com/OlympusDAO" target="_blank">
            <Icon name="github" className={classes.gray} />
          </Link>

          <Link href="https://olympusdao.medium.com/" target="_blank">
            <Icon name="medium" className={classes.gray} />
          </Link>

          <Link href="https://twitter.com/OlympusDAO" target="_blank">
            <Icon name="twitter" className={classes.gray} />
          </Link>

          <Link href="https://discord.gg/6QjjtUcfM4" target="_blank">
            <Icon name="discord" className={classes.gray} />
          </Link>
        </Box>
      </Box>
    </Paper>
  );
};

const Bonds: React.VFC = () => {
  const bonds = useLiveBonds().data;

  if (!bonds || bonds.length === 0) return null;

  return (
    <Box ml="26px" mt="16px" mb="12px">
      {sortByDiscount(bonds)
        .filter(bond => !bond.isSoldOut)
        .map(bond => (
          <Box mt="8px">
            <Link key={bond.id} component={NavLink} to={`/bonds/${bond.id}`}>
              <Typography variant="body1">
                <Box display="flex" flexDirection="row" justifyContent="space-between">
                  {bond.quoteToken.name}
                  <BondDiscount discount={bond.discount} />
                </Box>
              </Typography>
            </Link>
          </Box>
        ))}
    </Box>
  );
};

const InverseBonds: React.VFC = () => {
  const bonds = useLiveBonds({ isInverseBond: true }).data;

  if (!bonds || bonds.length === 0) return null;

  return (
    <Box ml="26px" mt="16px" mb="12px">
      <Typography variant="body2" color="textSecondary">
        <Trans>Inverse Bonds</Trans>
      </Typography>

      <Box mt="12px">
        {sortByDiscount(bonds)
          .filter(bond => !bond.isSoldOut)
          .map(bond => (
            <Box mt="8px">
              <Link key={bond.id} component={NavLink} to={`/bonds/inverse/${bond.id}`}>
                <Typography variant="body1">
                  <Box display="flex" flexDirection="row" justifyContent="space-between">
                    {bond.quoteToken.name}
                    <BondDiscount discount={bond.discount} />
                  </Box>
                </Typography>
              </Link>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default NavContent;
