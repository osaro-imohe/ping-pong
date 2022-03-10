import { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '../../components/page';
import Text from '../../components/text';
import Button from '../../components/button';
import Container from '../../components/container';
import { Input } from '../../components/input';
import LinkTo from '../../components/link';
import { verbs, adjectives, nouns } from '../../utils';
import { HomeSubcomponentProps } from '../../types/components';
import { Context } from '../../context';

const Init = ({ nextStage } : HomeSubcomponentProps) => (
  <Container block textAlign="center">
    <Text text="Ping-Pong 🏓" variant="secondary" />
    <Container marginTop="20px">
      <Container marginRight="5px" inline>
        <LinkTo path="/game">
          <Button text="Create game" variant="auxilary" onClick={() => nextStage('start')} />
        </LinkTo>
      </Container>
      <Container marginRight="5px" inline>
        <Button text="Join game" variant="tertiary" onClick={() => nextStage('join')} />
      </Container>
    </Container>
  </Container>
);

const Join = () => {
  const navigate = useNavigate();
  const [gC, setGc] = useState<string>('');
  const { setGameCode } = useContext(Context);
  const isDisabled = useMemo(() => {
    const arr = gC.split('-');
    const verb = arr[0];
    const adjective = arr[1];
    const noun = arr[2];
    if (verbs.includes(verb) && adjectives.includes(adjective) && nouns.includes(noun)) {
      return false;
    }
    return true;
  }, [gC]);
  return (
    <Container block textAlign="center" fullWidth fullHeight justifyContent="center" alignItems="center" inline>
      <Container justifyContent="center" inline borderRadius="20px" width="60%" height="60%" paddingTop="20px" paddingBottom="20px" alignItems="center">
        <Input size="lg" placeHolder="eg. deliver-lovely-failure" labelText="Game code" label onChangeText={(text: string) => setGc(text)} />
        <Container marginLeft="20px">
          <Button
            size="sm"
            type="submit"
            text="Join"
            variant="tertiary"
            disabled={isDisabled}
            onClick={() => {
              setGameCode(gC);
              navigate('game');
            }}
          />
        </Container>
      </Container>
    </Container>
  );
};

const Home = () => {
  const [stage, setStage] = useState('init');
  const setCurrStage = (s: string) => setStage(s);

  return (
    <Page>
      <Container fullHeight fullWidth inline justifyContent="center" alignItems="center">
        {stage === 'init' && <Init nextStage={setCurrStage} />}
        {stage === 'join' && <Join />}
      </Container>
    </Page>
  );
};

export default Home;
