import { useQueries, useQuery, UseQueryResult } from "react-query";
import { NetworkId } from "src/constants";
import { DAI_TOKEN, HYDR_TOKEN, LUSD_TOKEN, PRHYDR_TOKEN, TEST_DAI_TOKEN, USDC_TOKEN } from "src/constants/tokens";
import { isTestnet } from "src/helpers";
import { Token } from "src/helpers/contracts/Token";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { nonNullable } from "src/helpers/types/nonNullable";

import { useWeb3Context } from ".";
import { useTestMode } from "./useTestMode";

export interface TokenWithBalance extends Token {
  balance: UseQueryResult<DecimalBigNumber, Error>;
}

const tokens = [DAI_TOKEN, LUSD_TOKEN, USDC_TOKEN, HYDR_TOKEN, PRHYDR_TOKEN];

export const balanceQueryKey = (address?: string, tokenAddress?: string, networkId?: NetworkId) =>
  ["useTokenBalances", address, tokenAddress, networkId].filter(nonNullable);

// TODO: only return token info, no functions
export const useBalances = (tokenNames: string[]) => {
  const isTestMode = useTestMode();
  const { networkId, address } = useWeb3Context();

  const selectedTokens = tokens.filter(token => tokenNames.includes(token.name));

  const results = useQueries(
    selectedTokens.map(token => ({
      queryKey: balanceQueryKey(address, token.addresses[networkId], networkId),
      enabled: !!address && (isTestMode ? isTestnet(networkId) : !isTestnet(networkId)),
      queryFn: async () => {
        if (token.inNetwork(networkId)) {
          const contract = token.getEthersContract(networkId);
          const [balance, decimals] = await Promise.all([contract.balanceOf(address), contract.decimals()]);
          return new DecimalBigNumber(balance, decimals);
        }
      },
    })),
  );

  return selectedTokens.reduce(
    (prev, token, index) =>
      Object.assign(prev, {
        [token.name]: {
          ...token,
          balance: results[index],
        },
      }),
    {} as Record<string, TokenWithBalance>,
  );
};

export const useBalance = (tokenName: string) => {
  const { networkId, address } = useWeb3Context();

  const selectedToken = tokens.filter(token => tokenName === token.name);
  if (selectedToken.length !== 1) {
    throw `No token ${tokenName} stored`;
  }

  const token = selectedToken[0];

  return useQuery<DecimalBigNumber, Error>(
    balanceQueryKey(address, token.addresses[networkId], networkId),
    async () => {
      if (token.inNetwork(networkId)) {
        const contract = token.getEthersContract(networkId);
        const [balance, decimals] = await Promise.all([contract.balanceOf(address), contract.decimals()]);

        return new DecimalBigNumber(balance, decimals);
      }
      return new DecimalBigNumber("");
    },
  );
};
