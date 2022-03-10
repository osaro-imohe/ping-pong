import { PaddleProps } from '../../types/components';
import Container from '../container';

const Paddle = ({
  width, height, offsetY, offsetX, boardWidth, type = 'left-paddle',
} : PaddleProps) => (
  <Container
    top={offsetY}
    width={`${width}px`}
    height={`${height}px`}
    backgroundColor="white"
    borderRadius="10px"
    marginLeft={`${offsetX}px`}
    marginRight={`${offsetX}px`}
    position="absolute"
    left={type === 'left-paddle' ? '0px' : `${boardWidth - (width + 3 * offsetX)}px`}
  />
);

export default Paddle;
