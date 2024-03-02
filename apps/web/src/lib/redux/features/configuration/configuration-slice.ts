import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FretBoardMode, FretBoardTuning } from '../../../models';

type ConfigurationState = {
  stringCount: number;
  tuning: FretBoardTuning;
  fretBoardMode: FretBoardMode;
  fretCount: number;
  settingIsOpen: boolean;
  stringToPractice: number;
  interval: number;
  blurFretboard: boolean;
  focusMode: boolean;
};

export const initialState: ConfigurationState = {
  stringCount: 6,
  tuning: 'EADGBE',
  fretBoardMode: 'sharp',
  fretCount: 12,
  settingIsOpen: false,
  stringToPractice: 6,
  interval: 5,
  blurFretboard: true,
  focusMode: false,
};

const configurationSlice = createSlice({
  name: 'configuration',
  initialState,
  reducers: {
    fretBoardModeChanged: (state, action: PayloadAction<FretBoardMode>) => {
      state.fretBoardMode = action.payload;
    },
    setFretCount: (state, action: PayloadAction<number>) => {
      state.fretCount = action.payload;
    },
    setSettingIsOpen: (state, action: PayloadAction<boolean>) => {
      state.settingIsOpen = action.payload;
    },
    setStringToPractice: (state, action: PayloadAction<number>) => {
      state.stringToPractice = action.payload;
    },
    setInterval: (state, action: PayloadAction<number>) => {
      state.interval = action.payload;
    },
    setBlurFretBoard: (state, action: PayloadAction<boolean>) => {
      state.blurFretboard = action.payload;
    },
    setFocusMode: (state, action: PayloadAction<boolean>) => {
      state.focusMode = action.payload;
    },
  },
});

export const configurationReducer = configurationSlice.reducer;
export const configurationActions = configurationSlice.actions;
