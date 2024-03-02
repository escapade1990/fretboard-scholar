'use client';

import React from 'react';
import { Fretboard, MainContent } from '../lib/components';
import { useLocalStorageSettings } from '../lib/hooks';
import { useAppDispatch } from '../lib/redux';
import { configurationActions } from '../lib/redux/features';

export default function Page() {
  const [isReady, setIsReady] = React.useState(false);
  const [
    _,
    {
      getFretCount,
      getStringToPractice,
      getInterval,
      getBlurFretboard,
      getFocusMode,
    },
  ] = useLocalStorageSettings();
  const dispatch = useAppDispatch();

  React.useLayoutEffect(() => {
    const fretCount = Number(getFretCount());
    const stringToPractice = Number(getStringToPractice());
    const interval = Number(getInterval());
    const blur = getBlurFretboard();
    const focusMode = getFocusMode();

    dispatch(configurationActions.setFretCount(fretCount));
    dispatch(configurationActions.setStringToPractice(stringToPractice));
    dispatch(configurationActions.setInterval(interval));
    dispatch(configurationActions.setBlurFretBoard(blur));
    dispatch(configurationActions.setFocusMode(focusMode));

    setIsReady(true);
  }, [
    dispatch,
    getBlurFretboard,
    getFocusMode,
    getFretCount,
    getInterval,
    getStringToPractice,
  ]);

  return (
    <MainContent>
      {!isReady && <></>}
      {isReady && <Fretboard />}
    </MainContent>
  );
}
