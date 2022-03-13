import {
  useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import Button from '../../components/button';
import Container from '../../components/container';
import Paddle from '../../components/paddle';
import Page from '../../components/page';
import Text from '../../components/text';
import { delay } from '../../helpers';
import Loader from '../../components/loader';
import Ball from '../../components/ball';
import {
  BASE_URL, generateGameCode, generateRandomUserId, msg,
} from '../../utils';
import { GameState } from '../../types/components';
import ScoreBoard from '../../components/scoreboard';
import { Context } from '../../context';

const Game = () => {
  const code = useMemo(() => generateGameCode(), []);

  const userId = useMemo(() => generateRandomUserId(), []);

  const { gameCode, setGameCode } = useContext(Context);
  const [c, setC] = useState<null | WebSocket>(null);
  const [wins, setWins] = useState<number>(0);
  const [loses, setLoses] = useState<number>(0);
  const [paddleOffsetX, setPaddleOffsetX] = useState(0);
  const [paddleOffsetY, setPaddleOffsetY] = useState(0);
  const [oppPaddleOffsetY, setOppPaddleOffsetY] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [ballRadius, setBallRadius] = useState<number>(0);
  const [ballWidth, setBallWidth] = useState<number>(0);
  const [ballHeight, setBallHeight] = useState<number>(0);
  const [ballX, setBallX] = useState<number>(0);
  const [ballY, setBallY] = useState<number>(0);
  const [boardWidth, setBoardWidth] = useState<number>(0);
  const [boardHeight, setBoardHeight] = useState<number>(0);
  const [paddleWidth, setPaddleWidth] = useState<number>(0);
  const [paddleHeight, setPaddleHeight] = useState<number>(0);
  const [isOpponentConnected, setIsOpponentConnected] = useState<boolean>(false);

  const updateGameState = (data: GameState) => {
    setBallX(data.Ball.X);
    setBallY(data.Ball.Y);
    setBallWidth(data.Ball.Width);
    setBallHeight(data.Ball.Height);
    setBallRadius(data.Ball.Radius);
    setBoardWidth(data.Board.Width);
    setBoardHeight(data.Board.Height);
    setPaddleOffsetX(data.PlayerOne.X);
    setPaddleOffsetY(data.PlayerOne.Y);
    setOppPaddleOffsetY(data.PlayerTwo.Y);
    setPaddleWidth(data.PlayerOne.PaddleWidth);
    setPaddleHeight(data.PlayerOne.PaddleHeight);
    setIsOpponentConnected(data.PlayerOne.ID !== '' && data.PlayerTwo.ID !== '');
    setWins(data.PlayerOne.ID === userId ? data.PlayerOne.Score : data.PlayerTwo.Score);
    setLoses(data.PlayerOne.ID !== userId ? data.PlayerOne.Score : data.PlayerTwo.Score);
  };

  const connect = useCallback(async () => {
    try {
      setLoading(true);
      // 5 second delay for dramatic flare XD
      await delay(5);
      const conn = new WebSocket(`${BASE_URL}/new-game/${gameCode}`);
      conn.onopen = () => {
        setC(conn);
        setLoading(false);
        setError(false);
        const m = msg(userId, 'connected', {});
        conn.send(m);
      };
      conn.onclose = () => {
        setError(true);
      };
      conn.onmessage = (event) => {
        const data: GameState = JSON.parse(event.data);
        updateGameState(data);
      };
      conn.onerror = () => {
        setError(true);
      };
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [userId, gameCode]);

  const onKeyPress = useCallback((event: KeyboardEvent) => {
    const clickedKey = `${event.code}`;
    const upKeys = ['KeyW', 'ArrowUp'];
    const downKeys = ['KeyS', 'ArrowDown'];
    const validKeys = [...upKeys, ...downKeys, 'Space'];
    if (c && validKeys.includes(clickedKey)) {
      const direction = upKeys.includes(clickedKey) ? 'move-paddle-up' : 'move-paddle-down';
      const key = clickedKey === 'Space' ? 'start-game' : direction;
      const message = msg(userId, key);
      c.send(message);
    }
  }, [c, userId]);

  useEffect(() => {
    const gC = gameCode === '' ? code : gameCode;
    setGameCode(gC);
    connect();
  }, [connect, code]);

  useEffect(() => {
    document.addEventListener('keydown', onKeyPress);

    return () => {
      document.removeEventListener('keydown', onKeyPress);
    };
  }, [onKeyPress]);
  return (
    <Page>
      <Container inline fullHeight fullWidth justifyContent="center" alignItems="center">
        {(loading && !error) && (
          <Container>
            <Container block justifyContent="center">
              <Text text="Sit tight while we get your game started :)" variant="secondary" />
              <Container inline justifyContent="center" fullWidth marginTop="20px">
                <Loader width={60} height={60} center={false} />
              </Container>
            </Container>
          </Container>
        )}

        {(!loading && !error) && (
          <Container textAlign="center">
            <Container textAlign="center" fullWidth marginBottom="20px">
              <Text text={`Game code: ${gameCode}`} variant="secondary" />
              {!isOpponentConnected
                ? <Text text="Waiting for opponent ..." variant="secondary" />
                : (
                  <>
                    <ScoreBoard wins={wins} loses={loses} />
                    <Text text="Press the space button to begin" variant="secondary" />
                  </>
                )}
            </Container>
            <Container width={`${boardWidth}px`} inline height={`${boardHeight}px`} justifyContent="space-between" position="relative" border="2px solid white">
              <Ball x={ballX} y={ballY} width={ballWidth} height={ballHeight} radius={ballRadius} />
              <Paddle type="left-paddle" boardWidth={boardWidth} width={paddleWidth} height={paddleHeight} offsetX={paddleOffsetX} offsetY={paddleOffsetY} />
              <Paddle type="right-paddle" boardWidth={boardWidth} width={paddleWidth} height={paddleHeight} offsetX={paddleOffsetX} offsetY={oppPaddleOffsetY} />
            </Container>
          </Container>
        )}

        {(error) && (
          <Container>
            <Text text="We're having some difficulties connecting to the game server" variant="secondary" />
            <Container fullWidth justifyContent="center" inline marginTop="20px">
              <Button text="Try again" variant="auxilary" onClick={() => window.location.reload()} />
            </Container>
          </Container>
        )}
      </Container>
    </Page>
  );
};

export default Game;
