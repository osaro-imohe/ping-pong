import { BallProps } from '../../types/components';
import Container from '../container';

const Ball = ({
  x, y, width, height, radius,
} : BallProps) => (
  <Container
    top={y}
    left={x}
    width={`${width}px`}
    height={`${height}px`}
    position="relative"
    borderRadius={`${radius}px`}
    backgroundColor="white"
  />
);

export default Ball;
