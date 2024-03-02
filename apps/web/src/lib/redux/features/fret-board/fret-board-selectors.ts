import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';

const activeStringsWithNotes = createSelector(
  (state: RootState) => state.configuration.fretCount,
  (state: RootState) => state.fretboard.stringsWithNotes,
  (fretCount, stringsWithNotes) => {
    const result = Object.entries(stringsWithNotes).reduce<
      typeof stringsWithNotes
    >(
      (acc, [key, value]) => ({ ...acc, [key]: value.slice(0, fretCount + 1) }),
      {},
    );

    return result;
  },
);

const notesToPractice = createSelector(
  (state: RootState) => state.configuration.stringToPractice,
  activeStringsWithNotes,
  (stringToPractice, stringsWithNotes) => {
    const stringWithNotes = stringsWithNotes[stringToPractice - 1];

    return stringWithNotes.filter((note) => !note.alternativeName);
  },
);

export const fretboardSelectors = {
  activeStringsWithNotes,
  notesToPractice,
};
