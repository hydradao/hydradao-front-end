import { SvgIcon } from "@material-ui/core";

import { ReactComponent as HYDR } from "../assets/icons/hydr.svg";

const TokenIcons = (props: { name: string }) => {
  if (props.name === "HYDR") {
    return <SvgIcon viewBox="0 0 32 32" fontSize="large" component={HYDR} />;
  } else {
    return <SvgIcon viewBox="0 0 32 32" fontSize="large" component={HYDR} />;
  }
};

export default TokenIcons;
