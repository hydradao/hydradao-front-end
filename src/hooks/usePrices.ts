import { useQuery } from "react-query";
import { NetworkId } from "src/constants";
import { HYDRA_MINTING, HYDRA_TREASURY, WETH_USDT_LP_CONTRACT } from "src/constants/contracts";
import { OHM_DAI_RESERVE_CONTRACT_DECIMALS } from "src/constants/decimals";
import { parseBigNumber } from "src/helpers";
import { ohm_dai } from "src/helpers/AllBonds";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { queryAssertion } from "src/helpers/react-query/queryAssertion";
import { assert } from "src/helpers/types/assert";
import { nonNullable } from "src/helpers/types/nonNullable";
import { useWeb3Context } from "src/hooks";
import { MintFromTreasuryEvent } from "src/typechain/Minting";
import { SwapEvent } from "src/typechain/UniswapV2Lp";
import { FloorPrice } from "src/views/TreasuryDashboard/components/Metric/Metric";

import { useStaticPairContract } from "./useContract";
import { useCurrentIndex } from "./useCurrentIndex";

export const ohmPriceQueryKey = () => ["useOhmPrice"];
export const hydraPriceQueryKey = () => ["useHYDRMarketPrice"];
export const hydraSwapEventsQueryKey = () => ["useHYDRSwapEvents"];
export const hydrMintEventsQueryKey = (networkId: number) => ["useHYDRSwapEvents", networkId];

interface PricePoint {
  timestamp: number;
  floorPrice: number;
  mintPrice: number;
  marketPrice: number;
}

export const useHydrMintPrice = () => {
  const { networkId } = useWeb3Context();

  const minting = HYDRA_MINTING.getEthersContract(networkId);

  return useQuery<number, Error>(["useHydrMintPrice", networkId], async () => {
    const mintPrice = await minting.mintPrice();
    return parseBigNumber(mintPrice, 9);
  });
};

export const useHydrFloorPrice = () => {
  const { networkId } = useWeb3Context();

  const treasury = HYDRA_TREASURY.getEthersContract(networkId);

  return useQuery<number, Error>(["useHydrMintPrice", networkId], async () => {
    const floorPrice = await treasury.getFloorPrice();
    return parseBigNumber(floorPrice, 9);
  });
};

// TODO: right now it is wETH market price from uniswap.
export const useHydrMarketPrice = () => {
  const reserveContract = WETH_USDT_LP_CONTRACT.getEthersContract(NetworkId.MAINNET);

  const key = hydraPriceQueryKey();
  return useQuery<number, Error>(key, async () => {
    const [weth, usdt] = await reserveContract.getReserves();
    // TODO: we could do better on getting decimals of those tokens.
    return parseBigNumber(usdt, 6) / parseBigNumber(weth, 18);
  });
};

export const useHYDRSwapEvents = () => {
  const reserveContract = WETH_USDT_LP_CONTRACT.getEthersContract(NetworkId.MAINNET);
  const key = hydraSwapEventsQueryKey();
  return useQuery<SwapEvent[], Error>(key, async () => {
    console.log("Swap Events");
    const provider = Providers.getStaticProvider(NetworkId.MAINNET);
    const currentBlock = await provider.getBlockNumber();
    const eventFilter = reserveContract.filters.Swap(null, null, null, null, null, null);
    const existing_records = await reserveContract.queryFilter(eventFilter, currentBlock - 200);
    console.log(existing_records);
    return existing_records;
  });
};

export const useHydrMintEvents = () => {
  const { networkId, provider } = useWeb3Context();

  const minting = HYDRA_MINTING.getEthersContract(networkId);
  const key = hydrMintEventsQueryKey(networkId);
  return useQuery<MintFromTreasuryEvent[], Error>(key, async () => {
    const currentBlock = await provider.getBlockNumber();
    const eventFilter = minting.filters.MintFromTreasury(null, null, null, null, null, null);
    const existing_records = await minting.queryFilter(eventFilter, currentBlock - 200);
    return existing_records;
  });
};

/**
 * Returns the market price of OHM.
 */
export const useOhmPrice = () => {
  const address = ohm_dai.getAddressForReserve(NetworkId.MAINNET);
  assert(address, "Contract should exist for NetworkId.MAINNET");

  const reserveContract = useStaticPairContract(address, NetworkId.MAINNET);

  const key = ohmPriceQueryKey();
  return useQuery<number, Error>(key, async () => {
    const [ohm, dai] = await reserveContract.getReserves();
    return parseBigNumber(dai.div(ohm), OHM_DAI_RESERVE_CONTRACT_DECIMALS);
  });
};

export const gohmPriceQueryKey = (marketPrice?: number, currentIndex?: DecimalBigNumber) =>
  ["useGOHMPrice", marketPrice, currentIndex].filter(nonNullable);

/**
 * Returns the calculated price of gOHM.
 */
export const useGohmPrice = () => {
  const { data: ohmPrice } = useOhmPrice();
  const { data: currentIndex } = useCurrentIndex();

  const key = gohmPriceQueryKey(ohmPrice, currentIndex);
  return useQuery<number, Error>(
    key,
    async () => {
      queryAssertion(ohmPrice && currentIndex, key);

      return currentIndex.toApproxNumber() * ohmPrice;
    },
    { enabled: !!ohmPrice && !!currentIndex },
  );
};

export const useGraphPrice = () => {
  const randomNumbers = [
    0.6361439133625886, 0.3452624897845934, 0.45871272807962993, 0.26359224480545307, 0.9160297704479365,
    0.42267303671805123, 0.28853973646495845, 0.2380143887275643, 0.9586918620385472, 0.9246942486794929,
    0.4679889894451088, 0.6069087200898663, 0.030423294903804132, 0.766569555665051, 0.5803383212158589,
    0.8684990851871014, 0.4938005946334876, 0.700437522961737, 0.2430560496220353, 0.6046514548932982,
    0.15719019092992614, 0.22142683331447388, 0.36640142610218496, 0.8360572836751902, 0.6075828946761156,
    0.5287378511625682, 0.13751915393854208, 0.4584812777676832, 0.07986471252821736, 0.5407113577498136,
    0.36668471072502506, 0.7034407090470389, 0.6775465852742958, 0.25111511279156407, 0.6686597291805471,
    0.8028096161728008, 0.3330954004480907, 0.36348250623251865, 0.6899408822000146, 0.1990114584139413,
    0.8039551223448553, 0.3279697965811714, 0.08223346684798949, 0.552035277937734, 0.33461847891927377,
    0.5074610916806372, 0.049270767575736785, 0.9399523672111276, 0.8955554829524196, 0.6507168533439139,
    0.0733207666923773, 0.7252964527545325, 0.940364801856521, 0.1828326954346614, 0.49822060067825014,
    0.18649208464843015, 0.4229864654387827, 0.43518000762903475, 0.09618701801216778, 0.4751659328175285,
    0.5795740671468648, 0.5305290041096969, 0.7182419134007869, 0.4603831275546624, 0.8019374247226024,
    0.2929140323436603, 0.17013377308135813, 0.27184061701213946, 0.24886535860089176, 0.7276165915258205,
    0.29407302159715454, 0.7352163137456457, 0.9003989824547614, 0.8021383048062821, 0.2068959930781029,
    0.5393579145693413, 0.2610648511883076, 0.7482874318722852, 0.18611315343042745, 0.7965981676768938,
    0.4001036671454632, 0.19893448631582678, 0.5902023107419505, 0.9849681343394558, 0.5996805307486095,
    0.7800628074233911, 0.6085193753618823, 0.4772495622692906, 0.8741104816819245, 0.14712496012124643,
    0.6538945873392875, 0.09033455881939667, 0.5647353193653656, 0.9687405830393698, 0.5338629018143657,
    0.6259786745872956, 0.40008252185868154, 0.7933357240892001, 0.23108550595141164, 0.9474699802768498,
    0.015361306894781546,
  ];
  const prices: PricePoint[] = [];
  const currentTimestamp = Math.ceil(Date.now() / 1000);
  const currentPrice = 1975;
  let floorPrice = 0;
  for (let i = 100; i >= 0; i--) {
    const marketPrice = currentPrice - 2 * i * (1 - randomNumbers[i] / 10);
    const proposedFloor = currentPrice - i * 3 * (1 - randomNumbers[i] / 10) - 10;
    floorPrice = floorPrice < proposedFloor ? proposedFloor : floorPrice;
    prices.push({
      timestamp: currentTimestamp - i * 86400,
      marketPrice: marketPrice,
      floorPrice: Math.floor(floorPrice / 10) * 10,
      mintPrice: (marketPrice + floorPrice) / 2,
    });
  }
  return prices;
};
