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
      getTextToSpeech,
      getVoiceUri,
    },
  ] = useLocalStorageSettings();
  const dispatch = useAppDispatch();

  React.useLayoutEffect(() => {
    const fretCount = Number(getFretCount());
    const stringToPractice = Number(getStringToPractice());
    const interval = Number(getInterval());
    const blur = getBlurFretboard();
    const focusMode = getFocusMode();
    const textToSpeech = getTextToSpeech();
    const voiceUri = getVoiceUri();

    dispatch(configurationActions.setFretCount(fretCount));
    dispatch(configurationActions.setStringToPractice(stringToPractice));
    dispatch(configurationActions.setInterval(interval));
    dispatch(configurationActions.setBlurFretBoard(blur));
    dispatch(configurationActions.setFocusMode(focusMode));
    dispatch(configurationActions.setTextToSpeech(textToSpeech));
    dispatch(configurationActions.setVoiceUri(voiceUri));

    setIsReady(true);
  }, [
    dispatch,
    getBlurFretboard,
    getFocusMode,
    getFretCount,
    getInterval,
    getStringToPractice,
    getTextToSpeech,
    getVoiceUri,
  ]);

  return (
    <MainContent>
      {!isReady && <></>}
      {isReady && <Fretboard />}
    </MainContent>
  );
}
