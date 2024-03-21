import { configureStore } from '@reduxjs/toolkit';
import { configurationReducer, fretboardReducer } from './features';
import { getNotesPerString } from '../utils';

export type PreloadedState = {
  maxFretCount: number;
};

export const makeStore = ({ maxFretCount }: PreloadedState) => {
  return configureStore({
    reducer: {
      configuration: configurationReducer,
      fretboard: fretboardReducer,
    },
    preloadedState: {
      fretboard: {
        stringsWithNotes: getNotesPerString(maxFretCount),
      },
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
