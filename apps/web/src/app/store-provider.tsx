'use client';
import React, { useRef } from 'react';
import { Provider } from 'react-redux';
import { AppStore, PreloadedState, makeStore } from '../lib/redux';
import { useLocalStorageSettings } from '../lib/hooks';

type Props = {
  children: React.ReactNode;
};

export const StoreProvider: React.FC<Props> = ({ children }) => {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore({ maxFretCount: 24 });
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
};
