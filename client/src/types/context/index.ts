import React from 'react';

export type ContextProps = {
  gameCode: string;
  setGameCode: (code: string) => void;
};

export type ContextProviderProps = {
  children: React.ReactNode
};
