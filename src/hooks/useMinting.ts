import { ContractReceipt } from "@ethersproject/contracts";
import { useMutation, useQueryClient } from "react-query";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { DAI_ADDRESSES, HYDR_ADDRESSES, PRHYDR_ADDRESSES, USDC_ADDRESSES } from "src/constants/addresses";
import { HYDRA_MINTING } from "src/constants/contracts";
import { parseBigNumber } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useWeb3Context } from "src/hooks";
import { balanceQueryKey } from "src/hooks/useTokenBalances";
import { NETWORKS } from "src/networkDetails";
import { error as createErrorToast, info as createInfoToast } from "src/slices/MessagesSlice";
import { nextRewardDateQueryKey } from "src/views/Mint/components/MintArea/components/RewardTimer/hooks/useNextRewardDate";

export const useActivate = () => {
  const dispatch = useDispatch();
  const client = useQueryClient();
  const { networkId } = useWeb3Context();
  const minting = HYDRA_MINTING.getEthersContract(networkId);

  return useMutation<ContractReceipt, Error>(
    async () => {
      if (!minting) throw new Error("Token doesn't exist on current network. Please switch networks.");
      const transaction = await minting.activate();
      return transaction.wait();
    },
    {
      onError: error => void dispatch(createErrorToast(error.message)),
      onSuccess: async () => {
        dispatch(createInfoToast("Successfully activated"));
        // TODO: refresh the timer
        await client.refetchQueries(nextRewardDateQueryKey(networkId));
      },
    },
  );
};

interface MintOptions {
  minAmountOfHYDR: string;
  paymentTokenAddress: string;
  paymentTokenAmount: string;
}

export const useMint = () => {
  const dispatch = useDispatch();
  const client = useQueryClient();
  const { networkId, address } = useWeb3Context();
  const minting = HYDRA_MINTING.getEthersContract(networkId);

  return useMutation<ContractReceipt, Error, MintOptions>(
    async ({ minAmountOfHYDR, paymentTokenAddress, paymentTokenAmount }) => {
      if (!minting) throw new Error("Token doesn't exist on current network. Please switch networks.");

      const amount = new DecimalBigNumber(paymentTokenAmount, 18);

      const transaction = await minting.mintHYDR(minAmountOfHYDR, paymentTokenAddress, amount.toBigNumber());

      return transaction.wait();
    },
    {
      onError: error => void dispatch(createErrorToast(error.message)),
      onSuccess: async () => {
        dispatch(createInfoToast("Successfully minted"));
        await client.refetchQueries(nextRewardDateQueryKey(networkId));
        await client.refetchQueries(balanceQueryKey(address, HYDR_ADDRESSES[networkId], networkId));
        await client.refetchQueries(balanceQueryKey(address, DAI_ADDRESSES[networkId], networkId));
        await client.refetchQueries(balanceQueryKey(address, USDC_ADDRESSES[networkId], networkId));
      },
    },
  );
};

export const useClaimReward = () => {
  const dispatch = useDispatch();
  const client = useQueryClient();
  const { networkId, address } = useWeb3Context();
  const minting = HYDRA_MINTING.getEthersContract(networkId);

  return useMutation<ContractReceipt, Error>(
    async () => {
      if (!minting) throw new Error("Token doesn't exist on current network. Please switch networks.");

      const transaction = await minting.claimReward(1);

      return transaction.wait();
    },
    {
      onError: error => void dispatch(createErrorToast(error.message)),
      onSuccess: async () => {
        dispatch(createInfoToast("Successfully claimed!"));
        await client.refetchQueries(getRewardQueryKey(networkId));
        await client.refetchQueries(balanceQueryKey(address, PRHYDR_ADDRESSES[networkId], networkId));
      },
    },
  );
};

export const getRewardQueryKey = (networkId: number) => ["useGetReward", networkId];

export const useGetReward = () => {
  const { networkId, address } = useWeb3Context();

  const minting = HYDRA_MINTING.getEthersContract(networkId);

  return useQuery<number, Error>(getRewardQueryKey(networkId), async () => {
    const reward = await minting.getReward(address, 1);
    return parseBigNumber(reward, 18);
  });
};
