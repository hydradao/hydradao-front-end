import "./Mint.scss";

import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import { useWeb3Context } from "src/hooks";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";

import { MintArea } from "./components/MintArea/MintArea";
import { MintHistory } from "./components/MintHistory/MintHistory";
import { MintModalContainer } from "./components/MintModal/MintModal";

const Stake: React.FC = () => {
  const navigate = useNavigate();
  const { networkId } = useWeb3Context();
  usePathForNetwork({ pathName: "stake", networkID: networkId, navigate });

  return (
    <>
      <div id="stake-view">
        <MintArea />

        {/* NOTE (appleseed-olyzaps) olyzaps disabled until v2 contracts */}
        {/* <ZapCta /> */}

        <MintHistory />
      </div>
      <Routes>
        <Route path="modal" element={<MintModalContainer />} />
      </Routes>
    </>
  );
};

export default memo(Stake);
