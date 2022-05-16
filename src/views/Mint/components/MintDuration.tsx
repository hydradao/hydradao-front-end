import { prettifySecondsInDays } from "src/helpers/timeUtil";

export const MintDuration: React.VFC<{ duration: number }> = props => {
  return <>{prettifySecondsInDays(props.duration)}</>;
};
