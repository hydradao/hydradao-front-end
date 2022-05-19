import { t } from "@lingui/macro";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  SvgIcon,
  Typography,
} from "@material-ui/core";
import { ReactComponent as XIcon } from "src/assets/icons/x.svg";
import TokenIcons, { AllTokenName } from "src/components/TokenIcons";
import { trim } from "src/helpers";
import { TokenWithBalance } from "src/hooks/useBalances";

function SelectTokenModal(
  handleClose: () => void,
  modalOpen: boolean,
  handleSelectToken: { (token: string): void },
  tokens: {
    regularTokens: { [key: string]: TokenWithBalance };
  },
) {
  return (
    <Dialog
      onClose={handleClose}
      open={modalOpen}
      keepMounted
      fullWidth
      maxWidth="xs"
      id="zap-select-token-modal"
      className="zap-card"
    >
      <DialogTitle>
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
          <Box />
          <Box paddingLeft={6}>
            <Typography id="migration-modal-title" variant="h6" component="h2">
              {t`Select Token`}
            </Typography>
          </Box>
          <Button onClick={handleClose}>
            <SvgIcon component={XIcon} color="primary" />
          </Button>
        </Box>
      </DialogTitle>
      <Box paddingX="36px" paddingBottom="16px" paddingTop="12px">
        {
          <Paper style={{ maxHeight: 300, overflow: "auto", borderRadius: 10 }}>
            <List>
              {Object.values(tokens.regularTokens)
                .sort((tokenA, tokenB) => {
                  if (tokenB.balance.data && tokenA.balance.data) {
                    return tokenB.balance.data.sub(tokenA.balance.data).toApproxNumber();
                  } else {
                    return 0;
                  }
                })
                .map(token => (
                  <ListItem button onClick={() => handleSelectToken(token.name)} key={token.name}>
                    <ListItemAvatar>
                      <TokenIcons name={token.name as AllTokenName} />
                    </ListItemAvatar>
                    <ListItemText primary={token.name} />
                    <Box flexGrow={10} />
                    {token.balance.data ? (
                      <ListItemText
                        style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}
                        primary={`$` + trim(token.balance.data.toApproxNumber(), 2)}
                        secondary={trim(token.balance.data.toApproxNumber(), 4)}
                      />
                    ) : (
                      <ListItemAvatar>
                        <CircularProgress />
                      </ListItemAvatar>
                    )}
                  </ListItem>
                ))}
            </List>
          </Paper>
        }
      </Box>
    </Dialog>
  );
}

export default SelectTokenModal;
