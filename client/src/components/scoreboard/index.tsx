import Text from '../text';
import { ScoreBoardProps } from '../../types/components';

const ScoreBoard = ({ wins, loses }: ScoreBoardProps) => (
  <Text text={`Score | You: ${wins} <> Opponent: ${loses} |`} variant="secondary" />
);

export default ScoreBoard;
