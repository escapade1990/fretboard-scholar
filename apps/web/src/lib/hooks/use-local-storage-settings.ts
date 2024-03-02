import React from 'react';
import { configurationInitialState } from '../redux/features';

const settingsKeyPrefix = 'fretboard-scholar-settings';
const keys = {
  fretCount: `${settingsKeyPrefix}__fret-count`,
  stringToPractice: `${settingsKeyPrefix}__string-to-practice`,
  interval: `${settingsKeyPrefix}__interval`,
  blurFretboard: `${settingsKeyPrefix}__blur-fretboard`,
  focusMode: `${settingsKeyPrefix}__focus-mode`,
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

  return [
    {
      setFretCount,
      setStringToPractice,
      setInterval,
      setBlurFretboard,
      setFocusMode,
    },
    {
      getFretCount,
      getStringToPractice,
      getInterval,
      getBlurFretboard,
      getFocusMode,
    },
  ] as const;
};
