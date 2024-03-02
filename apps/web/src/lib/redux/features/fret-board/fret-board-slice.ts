import { createSlice } from '@reduxjs/toolkit';
import { Note } from '../../../models';

type FretboardState = {
  stringsWithNotes: Record<string, Note[]>;
};

const initialState: FretboardState = {
  stringsWithNotes: {},
};

const fretboardSlice = createSlice({
  name: 'fret-board',
  initialState,
  reducers: {},
});

export const fretboardReducer = fretboardSlice.reducer;
export const fretboardActions = fretboardSlice.actions;
