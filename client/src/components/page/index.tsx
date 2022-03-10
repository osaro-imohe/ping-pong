/* eslint-disable no-use-before-define */
import Container from '../container';
import { PageProps } from '../../types/components';

const Page = ({ children }: PageProps) => (
  <Container
    fullWidth
    fullHeight
    overflow="scroll"
    paddingTop="33px"
    paddingBottom="33px"
    paddingLeft="33px"
    paddingRight="33px"
    backgroundColor="black"
  >
    {children}
  </Container>
);

export default Page;
