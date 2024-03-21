import React from 'react';
import { configurationInitialState } from '../redux/features';

const settingsKeyPrefix = 'fretboard-scholar-settings';
const keys = {
  fretCount: `${settingsKeyPrefix}__fret-count`,
  stringToPractice: `${settingsKeyPrefix}__string-to-practice`,
  interval: `${settingsKeyPrefix}__interval`,
  blurFretboard: `${settingsKeyPrefix}__blur-fretboard`,
  focusMode: `${settingsKeyPrefix}__focus-mode`,
  highlightNotesOnAllStrings: `${settingsKeyPrefix}__highlight-notes-on-all-strings`,
  textToSpeech: `${settingsKeyPrefix}__text-to-speech`,
  voiceUri: `${settingsKeyPrefix}__voice-uri`,
};

export const useLocalStorageSettings = () => {
  const setFretCount = React.useCallback((fretCount: number) => {
    window.localStorage.setItem(
      keys.fretCount,
      JSON.parse(fretCount.toString()),
    );
  }, []);

  const getFretCount = React.useCallback(() => {
    let fretCount = window.localStorage.getItem(keys.fretCount);

    if (!fretCount) {
      setFretCount(configurationInitialState.fretCount);
      fretCount = window.localStorage.getItem(keys.fretCount);
    }

    return fretCount ? JSON.parse(fretCount) : undefined;
  }, [setFretCount]);

  const setStringToPractice = React.useCallback((stringToPractice: number) => {
    window.localStorage.setItem(
      keys.stringToPractice,
      JSON.parse(stringToPractice.toString()),
    );
  }, []);

  const getStringToPractice = React.useCallback(() => {
    let stringToPractice = window.localStorage.getItem(keys.stringToPractice);
    if (!stringToPractice) {
      setStringToPractice(configurationInitialState.stringToPractice);
      stringToPractice = window.localStorage.getItem(keys.stringToPractice);
    }

    return stringToPractice ? JSON.parse(stringToPractice) : undefined;
  }, [setStringToPractice]);

  const setInterval = React.useCallback((interval: number) => {
    window.localStorage.setItem(keys.interval, JSON.parse(interval.toString()));
  }, []);

  const getInterval = React.useCallback(() => {
    let interval = window.localStorage.getItem(keys.interval);
    if (!interval) {
      setInterval(configurationInitialState.interval);
      interval = window.localStorage.getItem(keys.interval);
    }

    return interval ? JSON.parse(interval) : undefined;
  }, [setInterval]);

  const setBlurFretboard = React.useCallback((blur: boolean) => {
    window.localStorage.setItem(
      keys.blurFretboard,
      JSON.parse(blur.toString()),
    );
  }, []);

  const getBlurFretboard = React.useCallback(() => {
    let blur = window.localStorage.getItem(keys.blurFretboard);
    if (!blur) {
      setBlurFretboard(configurationInitialState.blurFretboard);
      blur = window.localStorage.getItem(keys.blurFretboard);
    }

    return blur ? JSON.parse(blur) : undefined;
  }, [setBlurFretboard]);

  const setFocusMode = React.useCallback((blur: boolean) => {
    window.localStorage.setItem(keys.focusMode, JSON.parse(blur.toString()));
  }, []);

  const getFocusMode = React.useCallback(() => {
    let focusMode = window.localStorage.getItem(keys.focusMode);
    if (!focusMode) {
      setFocusMode(configurationInitialState.focusMode);
      focusMode = window.localStorage.getItem(keys.focusMode);
    }

    return focusMode ? JSON.parse(focusMode) : undefined;
  }, [setFocusMode]);

  const setHighlightNotesOnAllStrings = React.useCallback(
    (highlightNotesOnAllStrings: boolean) => {
      window.localStorage.setItem(
        keys.highlightNotesOnAllStrings,
        JSON.parse(highlightNotesOnAllStrings.toString()),
      );
    },
    [],
  );

  const getHighlightNotesOnAllStrings = React.useCallback(() => {
    let highlightNotesOnAllStrings = window.localStorage.getItem(
      keys.highlightNotesOnAllStrings,
    );
    if (!highlightNotesOnAllStrings) {
      setHighlightNotesOnAllStrings(
        configurationInitialState.highlightNotesOnAllStrings,
      );
      highlightNotesOnAllStrings = window.localStorage.getItem(
        keys.highlightNotesOnAllStrings,
      );
    }

    return highlightNotesOnAllStrings
      ? JSON.parse(highlightNotesOnAllStrings)
      : undefined;
  }, [setHighlightNotesOnAllStrings]);

  const setTextToSpeech = React.useCallback((textToSpeech: boolean) => {
    window.localStorage.setItem(
      keys.textToSpeech,
      JSON.parse(textToSpeech.toString()),
    );
  }, []);

  const getTextToSpeech = React.useCallback(() => {
    let textToSpeech = window.localStorage.getItem(keys.textToSpeech);
    if (!textToSpeech) {
      setTextToSpeech(configurationInitialState.textToSpeech);
      textToSpeech = window.localStorage.getItem(keys.textToSpeech);
    }

    return textToSpeech ? JSON.parse(textToSpeech) : undefined;
  }, [setTextToSpeech]);

  const setVoiceUri = React.useCallback((voiceUri: string) => {
    window.localStorage.setItem(keys.voiceUri, voiceUri);
  }, []);

  const getVoiceUri = React.useCallback(() => {
    let voiceUri = window.localStorage.getItem(keys.voiceUri);
    if (!voiceUri) {
      setVoiceUri('');
      voiceUri = window.localStorage.getItem(keys.voiceUri);
    }

    return voiceUri ? voiceUri : undefined;
  }, [setVoiceUri]);

  return [
    {
      setFretCount,
      setStringToPractice,
      setInterval,
      setBlurFretboard,
      setFocusMode,
      setHighlightNotesOnAllStrings,
      setTextToSpeech,
      setVoiceUri,
    },
    {
      getFretCount,
      getStringToPractice,
      getInterval,
      getBlurFretboard,
      getFocusMode,
      getHighlightNotesOnAllStrings,
      getTextToSpeech,
      getVoiceUri,
    },
  ] as const;
};
