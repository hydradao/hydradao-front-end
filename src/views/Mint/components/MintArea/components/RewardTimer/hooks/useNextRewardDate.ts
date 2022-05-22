import { useQuery } from "react-query";
import { HYDRA_MINTING } from "src/constants/contracts";
import { parseBigNumber } from "src/helpers";
import { useWeb3Context } from "src/hooks";

export const nextRewardDateQueryKey = (networkId: number) => ["useTimerEndsDate", networkId];

export const useNextRewardDate = () => {
  const { networkId } = useWeb3Context();

  const minting = HYDRA_MINTING.getEthersContract(networkId);

  return useQuery<Date, Error>(nextRewardDateQueryKey(networkId), async () => {
    const secondsToTimerEnds = await minting.secondsToTimerEnds();

    const parsedSeconds = parseBigNumber(secondsToTimerEnds, 0);

    return new Date(Date.now() + parsedSeconds * 1000);
  });
};
