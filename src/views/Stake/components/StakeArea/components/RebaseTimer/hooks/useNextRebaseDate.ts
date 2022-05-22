import { useQuery } from "react-query";
import { NetworkId } from "src/constants";
import { STAKING_ADDRESSES } from "src/constants/addresses";
import { HYDRA_MINTING } from "src/constants/contracts";
import { parseBigNumber } from "src/helpers";
import { useWeb3Context } from "src/hooks";

export const useNextRebaseDate = () => {
  const { networkId } = useWeb3Context();

  const minting = HYDRA_MINTING.getEthersContract(networkId);

  return useQuery<Date, Error>(["useTimerEndsDate", networkId], async () => {
    const secondsToTimerEnds = await minting.secondsToTimerEnds();

    const parsedSeconds = parseBigNumber(secondsToTimerEnds, 0);

    return new Date(Date.now() + parsedSeconds * 1000);
  });
};
