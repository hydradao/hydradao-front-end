import { t, Trans } from "@lingui/macro";
import { Box, Divider, Grid, Link, makeStyles, Paper, SvgIcon, Typography } from "@material-ui/core";
import { Icon, NavItem } from "@olympusdao/component-library";
import React from "react";
import { NavLink } from "react-router-dom";
import { sortByDiscount } from "src/helpers/bonds/sortByDiscount";
import { Environment } from "src/helpers/environment/Environment/Environment";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useWeb3Context } from "src/hooks/web3Context";
import { BondDiscount } from "src/views/Bond/components/BondDiscount";
import { useLiveBonds } from "src/views/Bond/hooks/useLiveBonds";

import { ReactComponent as OlympusIcon } from "../../assets/icons/olympus-nav-header.svg";
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

  return (
    <Paper className="dapp-sidebar">
      <Box className="dapp-sidebar-inner" display="flex" justifyContent="space-between" flexDirection="column">
        <div className="dapp-menu-top">
          <Box className="branding-header">
            <Link href="https://olympusdao.finance" target="_blank">
              <SvgIcon
                color="primary"
                viewBox="0 0 151 100"
                component={OlympusIcon}
                style={{ minWidth: "151px", minHeight: "98px", width: "151px" }}
              />
            </Link>

            <WalletAddressEns />
          </Box>

          <div className="dapp-menu-links">
            <div className="dapp-nav" id="navbarNav">
              <NavItem to="/dashboard" icon="dashboard" label={t`Dashboard`} />

              <NavItem to="/mint" icon="stake" label="Mint HYDR" />

              <NavItem to="/stake" icon="zap" label="Stake HYDR" />

              {Environment.isGiveEnabled() && <NavItem to="/give" icon="give" label="Realize prHYDR" />}

              <NavItem to="/wrap" icon="wrap" label="Get/Repay WATER" />

              <NavItem to="/wrappp" icon="wrap" label="WATER buyback" />

              <Box className="menu-divider">
                <Divider />
              </Box>
              <Box ml={3} mr={2} mt={1}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography>My Portfolio</Typography>
                  </Grid>
                  <Grid container item xs={6} justifyContent="flex-end">
                    <Typography>$130.22</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>HYDR</Typography>
                  </Grid>
                  <Grid container item xs={6} justifyContent="flex-end">
                    <Typography>$88.22</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Staked HYDR</Typography>
                  </Grid>
                  <Grid container item xs={6} justifyContent="flex-end">
                    <Typography>$88.22</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>prHYDR</Typography>
                  </Grid>
                  <Grid container item xs={6} justifyContent="flex-end">
                    <Typography>$88.22</Typography>
                  </Grid>
                  <Grid item xs={6}>
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
                  </Grid>
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
