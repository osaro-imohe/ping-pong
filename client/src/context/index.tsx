/* eslint-disable react/jsx-no-constructed-context-values */
import {
  createContext, useCallback, useMemo, useState,
} from 'react';
import { ContextProviderProps, ContextProps } from '../types/context';

const Context = createContext({} as ContextProps);
const ContextProvider = ({ children }: ContextProviderProps) => {
  const [gC, setGC] = useState<string>('');
  const gameCode = useMemo(() => gC, [gC]);
  const setGameCode = useCallback((code: string) => { setGC(code); }, [gameCode]);
  return (
    <Context.Provider
      value={{ gameCode, setGameCode }}
    >
      {children}
    </Context.Provider>
  );
};

export { Context, ContextProvider };
