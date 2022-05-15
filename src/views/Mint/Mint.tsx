import "./Mint.scss";

import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useWeb3Context } from "src/hooks";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";

import { MintHistory } from "./components/MintHistory/MintHistory";
import { MintArea } from "./components/MintArea/MintArea";

const Stake: React.FC = () => {
  const navigate = useNavigate();
  const { networkId } = useWeb3Context();
  usePathForNetwork({ pathName: "stake", networkID: networkId, navigate });

  return (
    <div id="stake-view">
      <MintArea />

      {/* NOTE (appleseed-olyzaps) olyzaps disabled until v2 contracts */}
      {/* <ZapCta /> */}

      <MintHistory />
    </div>
  );
};

export default memo(Stake);
